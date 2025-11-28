const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

const pool = new Pool({
  connectionString: process.env.DB_URL
});

async function waitForDb(retries = 20, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Connected to DB');
      return;
    } catch (err) {
      console.log(`DB not ready yet (attempt ${i + 1}/${retries}), retrying in ${delayMs}ms...`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('Could not connect to the database after multiple attempts');
}

(async () => {
  try {
    await waitForDb();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS licznik (
        id INT PRIMARY KEY,
        ile INT DEFAULT 0
      );
    `);
    // Upewniamy się, że jest wiersz o id=1
    await pool.query('INSERT INTO licznik (id, ile) VALUES (1, 0) ON CONFLICT (id) DO NOTHING');
    console.log('DB initialized');
  } catch (err) {
    console.error('DB init error', err);
    // Jeśli init się nie powiedzie, aplikacja nadal wystartuje, ale endpointy będą zwracać błąd DB.
  }
})();

app.use(cors()); // pozwól na żądania z frontendu (w produkcji ogranicz origin)

app.get('/api/visit', async (req, res) => {
  try {
    const wynik = await pool.query(`
      INSERT INTO licznik (id, ile)
      VALUES (1, 1)
      ON CONFLICT (id) DO UPDATE
        SET ile = licznik.ile + 1
      RETURNING ile;
    `);
    const ile = wynik.rows[0].ile;
    res.json({ ile });
  } catch (err) {
    console.error('Error /api/visit', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(5000, '0.0.0.0', () => console.log('Backend gotowy!'));