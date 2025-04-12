const admin = require('firebase-admin');
const serviceAccount = require('./firebase/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

db.collection('test').add({ createdAt: new Date() })
  .then(docRef => {
    console.log("Document écrit avec ID:", docRef.id);
  })
  .catch(error => {
    console.error("Erreur de connexion Firestore:", error);
  });
