const express = require('express');
const { config } = require('dotenv');
const { genHmac, compareHmac } = require('./utils/crypto');
const app = express();

// Load environment variables
config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Handle verification request
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
    const x_Hub_Signature = req.headers['X-Hub-Signature-256'];

    if (!x_Hub_Signature) {
      throw new Error('X_Hub_Signature is missing');
    }

    // Generate a SHA256 signature using the payload and your app secret
    const localSig = genHmac(req.body, process.env.META_APP_SECRET);

    // Compare your generated signature to the one in the X-Hub-Signature-256 header
    const foreignSig = x_Hub_Signature.split('sha256=')[1];
    const sigMatched = compareHmac(foreignSig, localSig);

    if (!sigMatched) {
      throw new Error("Signatures don't match");
    }

    // ... add more business logic as you see fit

    // Always respond with a 200 OK if everything goes well
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

// Central error handling middleware
app.use((err, req, res, next) => {
  let message = err.message !== undefined ? err.message : 'Something went wrong';
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
