const pool = require('../config/db');

const createPost = async (req, res) => {
  try {
    const { baslik, icerik, kapak_resmi, kategori_id } = req.body;
    const yazar_id = 1; 

    const slug = baslik.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const query = `
      INSERT INTO posts (baslik, slug, icerik, kapak_resmi, yazar_id, kategori_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [baslik, slug, icerik, kapak_resmi, yazar_id, kategori_id]);

    res.status(201).json({ message: 'Yazı başarıyla eklendi', id: result.insertId });
  } catch (error) {
    console.error('Yazı eklenirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

const getPosts = async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.baslik, p.slug, p.icerik, p.kapak_resmi, p.olusturulma_tarihi, c.kategori_adi 
      FROM posts p
      LEFT JOIN categories c ON p.kategori_id = c.id
      ORDER BY p.olusturulma_tarihi DESC
    `;
    const [rows] = await pool.query(query);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Yazılar çekilirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

module.exports = { createPost, getPosts };