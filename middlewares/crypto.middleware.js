const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHcdf5';

//Encrypting text
const IV_LENGTH = 16;

module.exports.encrypt = function (text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let key = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').slice(0, 32);

  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

module.exports.decrypt = function (text) {
  let textParts = text.split(':');
  let key = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').slice(0, 32);
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
