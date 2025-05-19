const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/routes');

const app = express();

// Middleware
app.use(bodyParser.json()); // Untuk parsing JSON body

// Rute untuk autentikasi
app.use('/api/user', authRoutes);

// Menjalankan server pada port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
