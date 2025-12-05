# Altschool Month 1 Assessment (No Framework)

This project contains two simple servers built with pure Node.js:

## Web Server
- Serves `index.html` at `/index.html`
- Any other `.html` path returns a custom 404 page

## Inventory API
A lightweight REST API using the filesystem (`items.json`) for data storage.

### Endpoints
- `POST /items` – Create item  
- `GET /items` – Get all items  
- `GET /items/:id` – Get one item  
- `PUT /items/:id` – Update item  
- `DELETE /items/:id` – Delete item  

### Item Structure
`id`, `name`, `price`, `size (s | m | l)`

### Features
- No frameworks  
- Modular structure  
- Consistent JSON responses  
- Error handling  
- Data persisted in `items.json`
