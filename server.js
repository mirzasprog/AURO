const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data', 'vip-data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function loadData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

app.get('/api/vip-zaglavlja', (req, res) => {
  const data = loadData();
  const zaglavlja = data.zaglavlja.map((zaglavlje) => {
    const stavke = data.stavke.filter((s) => s.VIPZaglavlje_Id === zaglavlje.Id);
    return {
      ...zaglavlje,
      BrojStavki: stavke.length,
    };
  });
  res.json(zaglavlja);
});

app.get('/api/vip-zaglavlja/:id/stavke', (req, res) => {
  const data = loadData();
  const zaglavljeId = Number(req.params.id);
  const stavke = data.stavke.filter((stavka) => stavka.VIPZaglavlje_Id === zaglavljeId);
  res.json(stavke);
});

app.put('/api/vip-zaglavlja/:id/stavke', (req, res) => {
  const data = loadData();
  const zaglavljeId = Number(req.params.id);
  const updates = req.body;

  if (!Array.isArray(updates)) {
    return res.status(400).json({ message: 'Body must be an array of stavke.' });
  }

  const updatedStavke = data.stavke.map((stavka) => {
    if (stavka.VIPZaglavlje_Id !== zaglavljeId) return stavka;
    const update = updates.find((u) => u.Id === stavka.Id);
    return update ? { ...stavka, Kolicina: update.Kolicina } : stavka;
  });

  data.stavke = updatedStavke;
  saveData(data);
  res.json({ message: 'Kolicine azurirane.' });
});

app.listen(PORT, () => {
  console.log(`Vikend Akcije server running on port ${PORT}`);
});
