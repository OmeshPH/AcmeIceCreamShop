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

app.get('/api/flavors/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM flavors WHERE id = $1', [id]);
      const flavor = result.rows[0];
      if (!flavor) {
        return res.status(404).json({ error: 'Flavor not found' });
      }
      res.json(flavor);
      client.release();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  app.post('/api/flavors', async (req, res) => {
    try {
      const { name, is_favorite } = req.body;
      const client = await pool.connect();
      const result = await client.query('INSERT INTO flavors (name, is_favorite) VALUES ($1, $2) RETURNING *', [name, is_favorite]);
      const newFlavor = result.rows[0];
      res.status(201).json(newFlavor);
      client.release();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  app.delete('/api/flavors/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const client = await pool.connect();
      await client.query('DELETE FROM flavors WHERE id = $1', [id]);
      res.sendStatus(204);
      client.release();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }); 

  app.put('/api/flavors/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, is_favorite } = req.body;
      const client = await pool.connect();
      const result = await client.query('UPDATE flavors SET name = $1, is_favorite = $2 WHERE id = $3 RETURNING *', [name, is_favorite, id]);
      const updatedFlavor = result.rows[0];
      if (!updatedFlavor) {
        return res.status(404).json({ error: 'Flavor not found' });
      }
      res.json(updatedFlavor);
      client.release();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });