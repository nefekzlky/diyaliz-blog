const pool = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, kategori_adi, slug FROM categories ORDER BY kategori_adi ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Kategoriler çekilirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { kategori_adi } = req.body;
    
    const slug = kategori_adi.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-') 
      .replace(/-+/g, '-'); 
      
    const query = 'INSERT INTO categories (kategori_adi, slug) VALUES (?, ?)';
    const [result] = await pool.query(query, [kategori_adi, slug]);
    
    res.status(201).json({ 
      message: 'Kategori başarıyla eklendi',
      insertId: result.insertId, 
      kategori_adi, 
      slug 
    });
  } catch (error) {
    console.error('Kategori eklenirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

module.exports = { getCategories, createCategory };