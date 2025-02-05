const express = require("express");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../src/utils/razorpay");
const Payment = require("../src/models/payment");
const { MEMBERSHIP_AMOUNT } = require("../src/utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { User } = require("../src/models/user");

paymentRouter.post("/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: MEMBERSHIP_AMOUNT[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: "Akshay",
        lastName: "Saini",
      },
    });
    // Save the order information to database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();
    // Return back the order details to frontend
    res.status(200).send({
      orderDetails: {
        ...savedPayment.toJSON(),
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// Since razorpay is going to call our webhook API and hence it need not be authenticated
paymentRouter.post("/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).send({ message: "Invalid webhook signature" });
    }

    // Update the payment status in DB.
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    // Update the user as premium.
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;

    await user.save();

    // if (req.body.event === "payment.captured") {
    // }

    // if (req.body.event === "payment.failed") {
    // }

    // Always return a response with status of 200 to tell Razorpay that we have successfully received the data from you.
    return res.status(200).send({ message: "Webhook received successfully" });
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.get("/verify/premium", userAuth, async (req, res) => {
  try {
    const user = req.user.toJSON();
    if (user.isPremium) {
      return res.status(200).send({ isPremium: true });
    } else {
      return res.status(200).send({ isPremium: false });
    }
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = paymentRouter;
