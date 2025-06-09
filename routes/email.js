const express = require('express');
const Mailrouter = express.Router();
const sendVerificationCode = require('../mailer/sendCode');


const verificationCodes = {};

Mailrouter.get('/', (req, res) => {
  res.render('verify', { step: 'email', email: '', error: null });
});

Mailrouter.post('/', async (req, res) => {
  const { email, code } = req.body;
  
  // Etap 1: wpisanie e-maila
  if (!code) {
    if (!email.endsWith('@gmail.com')) {
      return res.render('verify', {
        step: 'email',
        email: '',
        error: 'Tylko adresy uczelniane są dozwolone.'
      });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = verificationCode;
    console.log(verificationCode)
    const sent = await sendVerificationCode(email, verificationCode);
    if (!sent) {
      return res.render('verify', {
        step: 'email',
        email: '',
        error: 'Nie udało się wysłać kodu. Spróbuj ponownie.'
      });
    }

    return res.render('verify', {
      step: 'code',
      email,
      error: null
    });
  }

  // Etap 2: weryfikacja kodu
  if (verificationCodes[email] === code) {
    delete verificationCodes[email];
    req.session.email = req.body.email;
    return res.render('index',{ email : req.session.email});
  }

  return res.render('verify', {
    step: 'code',
    email,
    error: 'Nieprawidłowy kod.'
  });
});

module.exports = Mailrouter;