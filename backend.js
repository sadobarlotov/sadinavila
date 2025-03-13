const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// PostgreSQL connection string (replace with your actual credentials)
const connectionString = 'postgresql://sado_user:bUygMzAFCVlFwO1iu6Wb4Fr3S8lhcu0k@dpg-cv3haudumphs73ba5k6g-a.oregon-postgres.render.com/sado';

// Set up the PostgreSQL pool
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  }
});

// Connect to PostgreSQL
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.log('Error connecting to PostgreSQL:', err));

// POST route to create a new user
app.post('/forma', async (req, res) => {
  const { name, lastName, email, adresa } = req.body;

  if (!name || !email || !lastName || !adresa) {
    return res.status(400).json({ error: 'Name, last name, and email are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO forma (ime, prezime, email, adresa) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, lastName, email, adresa]
    );

    const newUser = result.rows[0];
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
