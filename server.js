const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data', 'vip-data.json');
const POZICIJE_PATH = path.join(__dirname, 'data', 'pozicije.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

function loadData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function ensurePozicijeData() {
  if (!fs.existsSync(POZICIJE_PATH)) {
    const initial = { background: null, positions: [] };
    fs.writeFileSync(POZICIJE_PATH, JSON.stringify(initial, null, 2));
  }
}

function loadPozicije() {
  ensurePozicijeData();
  const raw = fs.readFileSync(POZICIJE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function savePozicije(data) {
  fs.writeFileSync(POZICIJE_PATH, JSON.stringify(data, null, 2));
}

function serveStatic(req, res, filePath) {
  let resolvedPath = path.join(PUBLIC_DIR, filePath);

  // Prevent directory traversal
  const normalized = path.normalize(resolvedPath);
  if (!normalized.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Default to index.html for root
  if (fs.statSync(PUBLIC_DIR).isDirectory() && filePath === '/') {
    resolvedPath = path.join(PUBLIC_DIR, 'index.html');
  }

  fs.readFile(resolvedPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function handleApi(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;

  if (req.method === 'GET' && pathname === '/api/pozicije') {
    const data = loadPozicije();
    sendJson(res, 200, data);
    return true;
  }

  if (req.method === 'PUT' && pathname === '/api/pozicije') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const nextData = {
          background: payload.background || null,
          positions: Array.isArray(payload.positions) ? payload.positions : [],
        };
        savePozicije(nextData);
        sendJson(res, 200, { message: 'Pozicije sacuvane.' });
      } catch (error) {
        sendJson(res, 400, { message: 'Neispravan JSON format.' });
      }
    });
    return true;
  }

  if (req.method === 'GET' && pathname === '/api/vip-zaglavlja') {
    const data = loadData();
    const zaglavlja = data.zaglavlja.map((zaglavlje) => {
      const stavke = data.stavke.filter((s) => s.VIPZaglavlje_Id === zaglavlje.Id);
      return {
        ...zaglavlje,
        BrojStavki: stavke.length,
      };
    });
    sendJson(res, 200, zaglavlja);
    return true;
  }

  const stavkeMatch = pathname.match(/^\/api\/vip-zaglavlja\/(\d+)\/stavke$/);
  if (req.method === 'GET' && stavkeMatch) {
    const zaglavljeId = Number(stavkeMatch[1]);
    const data = loadData();
    const stavke = data.stavke.filter((stavka) => stavka.VIPZaglavlje_Id === zaglavljeId);
    sendJson(res, 200, stavke);
    return true;
  }

  if (req.method === 'PUT' && stavkeMatch) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const updates = JSON.parse(body || '[]');
        if (!Array.isArray(updates)) {
          sendJson(res, 400, { message: 'Body must be an array of stavke.' });
          return;
        }

        const zaglavljeId = Number(stavkeMatch[1]);
        const data = loadData();

        const updatedStavke = data.stavke.map((stavka) => {
          if (stavka.VIPZaglavlje_Id !== zaglavljeId) return stavka;
          const update = updates.find((u) => u.Id === stavka.Id);
          return update ? { ...stavka, Kolicina: Number(update.Kolicina) || 0 } : stavka;
        });

        data.stavke = updatedStavke;
        saveData(data);
        sendJson(res, 200, { message: 'Kolicine azurirane.' });
      } catch (error) {
        sendJson(res, 400, { message: 'Neispravan JSON format.' });
      }
    });
    return true;
  }

  return false;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  if (parsedUrl.pathname.startsWith('/api/')) {
    const handled = handleApi(req, res);
    if (!handled) {
      sendJson(res, 404, { message: 'Ruta nije pronadjena.' });
    }
    return;
  }

  const filePath = parsedUrl.pathname === '/' ? '/' : decodeURIComponent(parsedUrl.pathname);
  serveStatic(req, res, filePath);
});

server.listen(PORT, () => {
  console.log(`Vikend Akcije server running on port ${PORT}`);
});
