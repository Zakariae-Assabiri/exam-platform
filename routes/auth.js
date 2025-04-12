const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../firebase/firebaseConfig');
require('dotenv').config();

// POST /api/register
router.post('/register', async (req, res) => {
  const { email, password, nom, prenom, type } = req.body;
  const snapshot = await db.collection('users').where('email', '==', email).get();
  if (!snapshot.empty) return res.status(400).send('Email déjà utilisé.');

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection('users').add({
    email,
    password: hashedPassword,
    nom,
    prenom,
    type
  });

  res.status(201).send('Utilisateur créé');
});

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const snapshot = await db.collection('users').where('email', '==', email).get();

  if (snapshot.empty) return res.status(400).send('Utilisateur non trouvé.');

  const userDoc = snapshot.docs[0];
  const user = userDoc.data();
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(401).send('Mot de passe incorrect.');

  const token = jwt.sign({ id: userDoc.id, email: user.email, type: user.type }, process.env.JWT_SECRET, { expiresIn: '2h' });

  res.json({ token });
});

module.exports = router;
