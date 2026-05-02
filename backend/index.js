const express = require('express');
const cors = require('cors');
require('dotenv').config();

const categoryRoutes = require('./routes/categoryRoutes'); 
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/categories', categoryRoutes); 
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Diyaliz Blog Backend Sunucusu Çalışıyor!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda MVC yapısıyla ayağa kalktı.`);
});