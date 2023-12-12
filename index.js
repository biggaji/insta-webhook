const express = require('express');
const { config } = require('dotenv');
const { genHmac, compareHmac } = require('./utils/crypto');
const app = express();

// Loads the environment variables
config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * Handles the verification request meta sends to verify your webhook endpoint
 * Modify the API path and logic as you see fit.
 * The curent code logic handles the verification request perfectly well.
 * It verifies that the hub.verify_token value matches the verification token you provided when setting up the webhook on the App dashboard
 * If the verification token matches, it sends back the hub.challenge value
 */
app.get('/meta/webhook/verify_request', (req, res, next) => {
  try {
    const query = req.query;

    const hubVerifyToken = query['hub.verify_token'];
    const hubChallenge = query['hub.challenge'];

    if (hubVerifyToken !== process.env.META_HUB_VERIFY_TOKEN) {
      throw new Error("Verify token don't match");
    }

    res.status(200).send(hubChallenge);
  } catch (error) {
    next(error);
  }
});

// Handle instagram webhook events
app.post('/meta/webhook/instagram', (req, res, next) => {
  try {
    const x_hub_signature = req.headers['x-hub-signature-256'];

    if (!x_hub_signature) {
      throw new Error('x-hub-signature-256 header is missing');
    }

    // Generate a SHA256 signature using the payload and your app secret
    const localSig = genHmac(req.body, process.env.META_APP_SECRET);

    // Compare the generated signature to the one in the x-hub-signature-256 header
    const metaSig = x_hub_signature.split('sha256=')[1];
    const sigMatched = compareHmac(metaSig, localSig);

    if (!sigMatched) {
      throw new Error("Signatures don't match");
    }

    // TODO: Add the specific business logic that aligns with your use case.
    // This section of the code is a placeholder for the functionality that
    // should be implemented based on the requirements of your application.
    // Feel free to modify or extend this logic to suit your needs.

    // Always respond with a 200 OK if everything goes well
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

// Central error handling middleware
app.use((err, req, res, next) => {
  let message = err.message !== undefined ? err.message : 'Internal server error';
  let status = err.code !== undefined ? err.code : 500;
  res.status(status).json({
    message,
    status,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port:`, PORT);
});

module.exports = app;
