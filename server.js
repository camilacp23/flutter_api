require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// ✅ CORS PRIMERO (antes de rutas)
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, curl) y cualquier localhost
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:')) return callback(null, true);

    // Si luego quieres permitir tu dominio real del front, agrégalo aquí:
    // if (origin === 'https://tu-front.com') return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ JSON (solo una vez)
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API para Flutter activa.');
});

// Rutas CRUD
const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

// ✅ Conectar DB y levantar servidor
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conexión exitosa a MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch((error) => console.error('❌ Error de conexión a MongoDB:', error.message));