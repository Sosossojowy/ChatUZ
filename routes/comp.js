const express = require('express');
const router = express.Router();
const { readFileSync } = require("fs");
const dataContext = readFileSync("data.json", "utf8");
const {checkAuthenticated, checkNotAuthenticated} = require('../auth')
const transporter = require('../mailer/sendCode')
const nodemailer = require('nodemailer');

const OpenAI = require("openai");
require("dotenv").config();
const key = process.env.OPENAI_API_KEY;


// Inicjalizacja klienta OpenAI
const openai = new OpenAI({ apiKey: key });

router.get('/',checkAuthenticated(), (req, res) => {
  console.log("123")
  res.render('index', { email: req.session.email });
});

// Endpoint przyjmujący dane studenta i zwracający przydział tematu i promotora
router.post("/assign", async (req, res) => {
  const { imie, nazwisko, email, zainteresowania } = req.body;
  

  // Budowanie system prompta z danymi projektu, kontekstem z data.json oraz danymi studenta
  const systemPrompt = `
Projekt: Przydział Tematu Pracy i Promotora
Cel: Na podstawie zakresu zainteresowań studenta oraz dostępnych danych o promotorach i tematach, system przypisuje odpowiedni temat pracy oraz promotora.

Dane promotorów i tematów:
${dataContext}

Dane studenta:
Imię i nazwisko: ${imie} ${nazwisko}
Email: ${email}
Zakres zainteresowań: ${zainteresowania}

Na tej podstawie przygotuj listę najbardziej odpowiednich tematów prac wraz z promotorami, których specjalizacje najlepiej odpowiadają zainteresowaniom studenta.
Zwróć wyłącznie odpowiedź w formacie JSON:
{
  "propozycje": [
    { "temat": "...", "promotor": "..." },
    { "temat": "...", "promotor": "..." },
    ...
  ]
}
Nie dodawaj żadnych komentarzy, wstępów ani wyjaśnień, nie uwzględniaj poprzednich wpisów używkownika.
`;

  try {
    // Wywołanie API ChatGPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Proszę przydziel temat pracy i promotora dla studenta ${imie} ${nazwisko}.`,
        },
      ],
    });

    // Parsowanie odpowiedzi
    const answerContent = completion.choices[0].message.content;
    let assignment;
    try {
      assignment = JSON.parse(answerContent);
    } catch (parseError) {
      assignment = { error: "Nie udało się sparsować odpowiedzi z modelu.", raw: answerContent };
    }
    req.session.topics = assignment.propozycje || [];

    req.session.save(() => {
      res.render('assign', {
      propozycje: req.session.topics,
      mail: req.session.email
  });
});
  } catch (error) {
    console.error("Błąd pobierania odpowiedzi:", error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/send-topics", async (req, res) => {
  const transporter = nodemailer.createTransport({
      host: "smtp.poczta.onet.pl",
      port: 465,
      secure: true,
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
  });
  const email = req.session.email;
  const topics = req.session.topics; 

  if (!email || !topics) {
    return res.status(400).send("Brak maila lub tematów w sesji.");
  }

  // Formatowanie listy tematów
  const topicList = topics
    .map((t, i) => `${i + 1}. Temat: ${t.temat}\n   Promotor: ${t.promotor}`)
    .join("\n\n");
  const mailOptions = {
    from: 'chatuz@onet.pl',
    to: email,
    subject: "Twoja lista tematów",
    text: `Cześć!\n\nOto Twoja wygenerowana lista tematów:\n\n${topicList}\n\nPozdrawiam!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    delete req.session
    res.send("Tematy zostały wysłane na Twój adres email.");
  } catch (err) {
    console.error("Błąd przy wysyłaniu maila:", err);
    res.status(500).send("Wystąpił błąd przy wysyłaniu maila.");
  }
});

module.exports = router;