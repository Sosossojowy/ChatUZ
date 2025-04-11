const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serwuj folder public (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Uruchom serwer
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
