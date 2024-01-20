const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;
const dataFilePath = 'data.json';

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      req.data = JSON.parse(data);
      next();
    }
  });
});

app.get('/', (req, res) => {
  if (req.data.length > 0) {
    res.json(req.data);
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

app.put('/updateData/:NISN', (req, res) => {
  const requestedNISN = req.params.NISN;
  const newData = req.body;

  const dataIndex = req.data.findIndex(entry => entry.NISN === requestedNISN);

  if (dataIndex !== -1) {
    req.data[dataIndex] = { ...req.data[dataIndex], ...newData };

    fs.writeFile(dataFilePath, JSON.stringify(req.data), 'utf8', err => {
      if (err) {
        console.error('Error writing updated data to file:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Data updated successfully' });
      }
    });
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
