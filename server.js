const express = require('express');
const Pool = require('pg').Pool;

const app = express();
const port = process.env.PORT || 3000;

// Replace with your database credentials
const pool = new Pool({
  user: 'your_user',
  host: 'your_host',
  database: 'acme_ice_cream',
  password: 'your_password',
  port: 5432
});

// Route to get all flavors
app.get('/api/flavors', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM flavors');
    const flavors = result.rows;
    res.json(flavors);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});