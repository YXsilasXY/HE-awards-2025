const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const DB_FILE = path.join(__dirname, 'database.json');

app.use(express.json());

function loadReservations() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, '{}');
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveReservations(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/reservations', (req, res) => {
  const data = loadReservations();
  res.json(data);
});

app.post('/api/reservations', (req, res) => {
  const { table, seat } = req.body;
  const id = `${table}-${seat}`;
  const data = loadReservations();

  if (data[id]) {
    return res.json({ success: false, message: 'Pladsen er allerede reserveret' });
  }

  data[id] = true;
  saveReservations(data);
  res.json({ success: true });
});

app.delete('/api/reservations', (req, res) => {
  const { table, seat } = req.body;
  const id = `${table}-${seat}`;
  const data = loadReservations();

  if (!data[id]) {
    return res.json({ success: false, message: 'Pladsen er ikke reserveret' });
  }

  delete data[id];
  saveReservations(data);
  res.json({ success: true });
});

app.delete('/api/reservations/all', (req, res) => {
  saveReservations({});
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server kører på http://localhost:${PORT}`);
});
