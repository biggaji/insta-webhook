const crypto = require('node:crypto');

/**
 * Generates a sha256 hmac hash
 * @param {string} payload
 * @param {string} secret
 * @returns {string} sha256 hashed signature
 * @throws {Error} If any execption occurs during hashing
 */
function genHmac(payload, secret) {
  try {
    return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
  } catch (error) {
    console.error('Error generating hmac hash:', error.message);
    throw new Error('Error generating hmac hash. Please check the payload and secret.');
  }
}

/**
 * Compares 2 sha256 hmac hash
 * @param {string} metaSig
 * @param {string} localSig
 * @returns {boolean} true | false
 */
function compareHmac(metaSig, localSig) {
  try {
    return crypto.timingSafeEqual(Buffer.from(metaSig, 'hex'), Buffer.from(localSig, 'hex'));
  } catch (error) {
    console.error('Error comparing hmac hash:', error.message);
    throw new Error('Error comparing hmac hash. Please check the signature values.');
  }
}

module.exports = {
  genHmac,
  compareHmac,
};
