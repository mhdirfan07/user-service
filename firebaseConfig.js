const admin = require('firebase-admin');

const PROD = 'PRODUCTION';

if (true) {
  admin.initializeApp();
} else {
  const serviceAccount = require('./serviceAccount.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
module.exports = db;
