const express = require('express');
const cors = require('cors');
const NodeCouchDb = require('node-couchdb');

const app = express();
const port = 3000;
app.use(cors());

const counch = new NodeCouchDb({
  host: '127.0.0.1',
  protocol: 'http',
  port: 5984,
  auth: {
    user: 'admin',
    pass: 'admin'
  }
});

app.get('/api/pratos', async (req, res) => {
  const dbName = 'bancorestaurante';
  const viewUrl = ''; // <--

  try{
    const { data, headers, status } = await counch.get(dbName, viewUrl);

    const pratos = data.rows.map(item => item.value);
    res.json(pratos);
  } catch(error) {
    console.error('Error fetching pratos:', error);
    res.status(500).json({ error: 'Failed to fetch pratos' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});