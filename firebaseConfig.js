const admin = require('firebase-admin');

const PROD = process.env.NODE_ENV === 'PRODUCTION';

if (PROD) {
  admin.initializeApp();
} else {
  const serviceAccount = require('./serviceAccount.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
module.exports = db;
