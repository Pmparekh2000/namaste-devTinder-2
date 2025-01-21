# DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/:status/:userId -> status => INTERESTED/IGNORED
- POST /request/review/:status/:requestId -> status => ACCEPTED/REJECTED

## user

- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignore, interested, accepted, rejected.
