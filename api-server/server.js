const http = require('http');
const { handleRequest } = require('./routes');

const server = http.createServer((req, res) => {
  let body = '';

  req.on('data', chunk => body += chunk);

  req.on('end', () => {
    try {
      body = body ? JSON.parse(body) : {};
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
    handleRequest(req, res, body);
  });
});

server.listen(3000, () => {
  console.log('Inventory API server running on http://localhost:3000');
});
