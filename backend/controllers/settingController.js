const pool = require('../config/db');

const getAboutText = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_value FROM settings WHERE setting_key = "about_us"');
    res.status(200).json({ text: rows[0]?.setting_value || '' });
  } catch (error) {
    res.status(500).json({ message: 'Ayar çekilemedi' });
  }
};

const updateAboutText = async (req, res) => {
  try {
    const { text } = req.body;
    await pool.query('UPDATE settings SET setting_value = ? WHERE setting_key = "about_us"', [text]);
    res.status(200).json({ message: 'Hakkımızda yazısı güncellendi' });
  } catch (error) {
    res.status(500).json({ message: 'Ayar güncellenemedi' });
  }
};

module.exports = { getAboutText, updateAboutText };