// index.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // for parsing JSON

app.get('/', (req, res) => {
  res.send('Hello from Node backend!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
