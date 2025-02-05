const ALLOWED_UPDATES = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "about",
  "skills",
];
const INTERESTED = "interested";
const IGNORED = "ignored";
const ACCEPTED = "accepted";
const REJECTED = "rejected";
const ALLOWED_STATUS = [INTERESTED, IGNORED];
const ALLOWED_ACTIONS = [ACCEPTED, REJECTED];
const MALE = "male";
const FEMALE = "female";
const OTHERS = "others";
const FULFILLED = "fulfilled";

const MEMBERSHIP_AMOUNT = {
  silver: 300,
  gold: 500,
};

module.exports = {
  ALLOWED_UPDATES,
  INTERESTED,
  IGNORED,
  ALLOWED_STATUS,
  ACCEPTED,
  REJECTED,
  MALE,
  FEMALE,
  OTHERS,
  FULFILLED,
  ALLOWED_ACTIONS,
  MEMBERSHIP_AMOUNT,
};
