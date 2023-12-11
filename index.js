const express = require('express');
const { config } = require('dotenv');
const app = express();

// Dotenv
config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Handle verification request
app.get('/meta/webhook/verify_request', (req, res, next) => {
  try {
    const query = req.query;

    const hubVerifyToken = query['hub.verify_token'];
    const hubChallenge = query['hub.challenge'];

    if (!hubVerifyToken === process.env.META_HUB_VERIFY_TOKEN) {
      throw new Error("Verify token don't match");
    }

    res.status(200).send(hubChallenge);
  } catch (error) {
    next(error);
  }
});

// Handle webhook event

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port:`, PORT);
});
