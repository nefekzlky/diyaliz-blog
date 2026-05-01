const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanılamadı! Hata:', err.message);
    return;
  }
  console.log('MySQL veritabanına başarıyla bağlanıldı!');
});

app.get('/', (req, res) => {
  res.send('Diyaliz Blog Backend Sunucusu Çalışıyor!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda ayağa kalktı.`);
});