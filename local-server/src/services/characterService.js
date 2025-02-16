import fs from 'fs';
import crypto from 'crypto';

export default class characterService {
  // Encrypt function
  encrypt(text, key) {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Save character data
  saveCharacterData(userId, characterData, key) {
    const filePath = `../userdata/${userId}.json`;
    const encryptedData = encrypt(JSON.stringify(characterData), key);
    fs.writeFileSync(filePath, encryptedData);
  }

  // Load character data
  loadCharacterData(userId, key) {
    const filePath = `./userdata/${userId}.json`;
    const encryptedData = fs.readFileSync(filePath, 'utf8');
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }
}
