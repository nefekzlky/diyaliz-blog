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

const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const query = `
      SELECT p.id, p.baslik, p.slug, p.icerik, p.kapak_resmi, p.olusturulma_tarihi, c.kategori_adi, u.ad_soyad as yazar_adi
      FROM posts p
      LEFT JOIN categories c ON p.kategori_id = c.id
      LEFT JOIN users u ON p.yazar_id = u.id
      WHERE p.slug = ?
    `;
    
    const [rows] = await pool.query(query, [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Yazı bulunamadı' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Yazı detayı çekilirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    res.status(200).json({ message: 'Yazı başarıyla silindi' });
  } catch (error) {
    console.error('Yazı silinirken hata:', error);
    res.status(500).json({ message: 'Yazı silinemedi' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { baslik, icerik, kategori_id } = req.body;
    
    await pool.query(
      'UPDATE posts SET baslik = ?, icerik = ?, kategori_id = ? WHERE id = ?',
      [baslik, icerik, kategori_id || null, id]
    );
    res.status(200).json({ message: 'Yazı başarıyla güncellendi' });
  } catch (error) {
    console.error('Yazı güncellenirken hata:', error);
    res.status(500).json({ message: 'Yazı güncellenemedi' });
  }
};


module.exports = { getPosts, getPostBySlug, createPost, deletePost, updatePost };