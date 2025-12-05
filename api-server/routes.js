const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'items.json');

//Helpers
function readItems() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

function send(res, status, message, data = null) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: status < 400,
    message,
    data
  }));
}

// Main Router
function handleRequest(req, res, body) {
  const urlParts = req.url.split('/');
  const id = urlParts[2]; // /items/:id

  //CREATE ITEM 
  if (req.method === 'POST' && req.url === '/items') {
    try {
      const { name, price, size } = body;
      const validSizes = ['s', 'm', 'l'];

      if (!name || !price || !validSizes.includes(size)) {
        return send(res, 400, "Invalid item data. Expected: name, price, size(s/m/l)");
      }

      const items = readItems();
      const newItem = {
        id: Date.now().toString(),
        name,
        price,
        size
      };

      items.push(newItem);
      writeItems(items);

      return send(res, 201, "Item created", newItem);

    } catch (err) {
      return send(res, 500, "Failed to create item");
    }
  }

  //GET ALL ITEMS
  if (req.method === 'GET' && req.url === '/items') {
    try {
      const items = readItems();
      return send(res, 200, "Items retrieved", items);
    } catch {
      return send(res, 500, "Failed to get items");
    }
  }

  //GET ONE ITEM
  if (req.method === 'GET' && urlParts[1] === 'items' && id) {
    try {
      const items = readItems();
      const item = items.find(i => i.id === id);

      if (!item) {
        return send(res, 404, "Item not found");
      }

      return send(res, 200, "Item retrieved", item);

    } catch {
      return send(res, 500, "Failed to get item");
    }
  }

  // UPDATE ITEM
  if (req.method === 'PUT' && urlParts[1] === 'items' && id) {
    try {
      const items = readItems();
      const index = items.findIndex(i => i.id === id);

      if (index === -1) {
        return send(res, 404, "Item not found");
      }

      // Update fields directly
      items[index] = { ...items[index], ...body };

      writeItems(items);

      return send(res, 200, "Item updated", items[index]);

    } catch {
      return send(res, 500, "Failed to update item");
    }
  }

  // DELETE ITEM
  if (req.method === 'DELETE' && urlParts[1] === 'items' && id) {
    try {
      let items = readItems();
      const index = items.findIndex(i => i.id === id);

      if (index === -1) {
        return send(res, 404, "Item not found");
      }

      const deletedItem = items.splice(index, 1)[0];
      writeItems(items);

      return send(res, 200, "Item deleted", deletedItem);

    } catch {
      return send(res, 500, "Failed to delete item");
    }
  }

  // ROUTE NOT FOUND
  return send(res, 404, "Route not found");
}

module.exports = { handleRequest };
