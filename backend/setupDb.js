const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_soyad VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    sifre_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'yazar') DEFAULT 'yazar',
    olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const createCategoriesTable = `
  CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kategori_adi VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
  )
`;

// Kapak resmi eklendi ve icerik LONGTEXT yapıldı
const createPostsTable = `
  CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    baslik VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icerik LONGTEXT NOT NULL,
    kapak_resmi VARCHAR(255), 
    yayin_durumu ENUM('taslak', 'yayinda') DEFAULT 'taslak',
    yazar_id INT,
    kategori_id INT,
    olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (yazar_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (kategori_id) REFERENCES categories(id) ON DELETE SET NULL
  )
`;

db.connect((err) => {
  if (err) throw err;
  console.log('Veritabanına bağlanıldı, tablolar inşa ediliyor...');

  db.query(createUsersTable, (err) => {
    if (err) throw err;
    console.log('Users tablosu hazır.');

    db.query(createCategoriesTable, (err) => {
      if (err) throw err;
      console.log('Categories tablosu hazır.');

      db.query(createPostsTable, (err) => {
        if (err) throw err;
        console.log('Posts tablosu hazır. Kapak resmi sütunu eklendi.');
        
        db.end();
      });
    });
  });
});