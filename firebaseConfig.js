const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

const PROD = 'PRODUCTION';

if (true) {
  admin.initializeApp();
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
module.exports = db;
