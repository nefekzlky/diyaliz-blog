const pool = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories'); 
    res.status(200).json(rows);
  } catch (error) {
    console.error('Kategoriler çekilirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { kategori_adi } = req.body;

   
    const slug = kategori_adi.toLowerCase().replace(/ /g, '-');

    const [result] = await pool.query(
      'INSERT INTO categories (kategori_adi, slug) VALUES (?, ?)',
      [kategori_adi, slug]
    );

    res.status(201).json({ message: 'Kategori başarıyla eklendi', id: result.insertId });
  } catch (error) {
    console.error('Kategori eklenirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

module.exports = { getCategories, createCategory };