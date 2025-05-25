const express = require('express');
const router = express.Router();
const { readFileSync } = require("fs");
const dataContext = readFileSync("data.json", "utf8");

const OpenAI = require("openai");
require("dotenv").config();
const key = process.env.OPENAI_API_KEY;


// Inicjalizacja klienta OpenAI
const openai = new OpenAI({ apiKey: key });

router.get("/", (req, res) => {
  res.render('index'); 
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

Na tej podstawie dobierz listing najodpowiedniejszych tematów prac oraz do każdego przypisz promotora, którego specjalizacja najlepiej odpowiada zainteresowaniom studenta.
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
    res.render('assign', { propozycje: assignment.propozycje || [] });
  } catch (error) {
    console.error("Błąd pobierania odpowiedzi:", error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;