// index.js
const { readFileSync } = require("fs");
const express = require("express");
const OpenAI = require("openai");
const expressLayouts = require("express-ejs-layouts");

// Wczytanie zmiennych środowiskowych z pliku .env
require("dotenv").config();
const key = process.env.OPENAI_API_KEY;


// Inicjalizacja klienta OpenAI
const openai = new OpenAI({ apiKey: key });

// Wczytanie danych kontekstowych z pliku data.json
const dataContext = readFileSync("data.json", "utf8");

// Inicjalizacja aplikacji Express
const app = express();

// Umożliwienie serwowania statycznych plików z katalogu public (HTML, CSS, JS)
app.use(express.static("views"));

//używamy szablonów ejs
app.set("view engine", "ejs");

// Parsowanie JSON w ciele zapytań
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts)
app.set('layout', 'layout')

app.get("/", (req, res) => {
  res.render('index'); 
});

// Endpoint przyjmujący dane studenta i zwracający przydział tematu i promotora
app.post("/assign", async (req, res) => {
  const { imie, nazwisko, email, zainteresowania } = req.body;

  // Budowanie system prompta z danymi projektu, kontekstem z data.json oraz danymi studenta
  const systemPrompt = `
Projekt: Przydział Tematu Pracy i Promotora
Cel: Na podstawie zakresu zainteresowań studenta oraz dostępnych danych o promotorach i ich przypisanych tematach, system przypisuje najodpowiedniejszy temat pracy oraz promotora.

Dane promotorów i przypisanych tematów:
${dataContext}

Dane studenta:
Imię i nazwisko: ${imie} ${nazwisko}
Email: ${email}
Zakres zainteresowań: ${zainteresowania}

Na tej podstawie dobierz najodpowiedniejszy temat pracy oraz promotora, którego specjalizacja najlepiej odpowiada zainteresowaniom studenta.
Zwróć wyłącznie odpowiedź w formacie JSON:
{
  "propozycje": [
    { "temat": "...", "promotor": "..." },
    { "temat": "...", "promotor": "..." },
    ...
  ]
}
Nie dodawaj żadnych komentarzy, wstępów ani wyjaśnień, nie uwzględniaj poprzednich wpisów użytkownika.
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



// Uruchomienie serwera na porcie 3000 lub określonym w zmiennych środowiskowych
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serwer działa na porcie ${port}`));
