const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Importar rotas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');

const app = express();

// Conectar ao banco de dados
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});