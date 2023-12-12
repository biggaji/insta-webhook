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
    throw error;
  }
}

/**
 * Compares 2 sha256 hmac hash
 * @param {string} foreignSig
 * @param {string} localSig
 * @returns {boolean} true | false
 */
function compareHmac(foreignSig, localSig) {
  try {
    return crypto.timingSafeEqual(Buffer.from(foreignSig, 'hex'), Buffer.from(localSig, 'hex'));
  } catch (error) {
    console.error('Error comparing hmac hash:', error.message);
    throw error;
  }
}

module.exports = {
  genHmac,
  compareHmac,
};
