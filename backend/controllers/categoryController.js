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

module.exports = { getCategories };