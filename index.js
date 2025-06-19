// index.js
const { readFileSync } = require("fs");
const express = require("express");
const OpenAI = require("openai");
const expressLayouts = require("express-ejs-layouts");
const router = require("./routes/comp")
const Mailroutes = require("./routes/email")
const session = require("express-session")
// Wczytanie zmiennych środowiskowych z pliku .env
require("dotenv").config();
const key = process.env.OPENAI_API_KEY;


// Inicjalizacja klienta OpenAI
const openai = new OpenAI({ apiKey: key });

// Wczytanie danych kontekstowych z pliku data.json
// const dataContext = readFileSync("data.json", "utf8");

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

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  next();
});


app.use(session({
  secret: 'tajny_klucz_sesji',         
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60,        
    httpOnly: true
  }
}));

app.use('/',router);
app.use('/verify', Mailroutes);


// Uruchomienie serwera na porcie 3000 lub określonym w zmiennych środowiskowych
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serwer działa na porcie ${port}`));
