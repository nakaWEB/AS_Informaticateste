const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Dados da InfinityFree
    const DB_USER = 'if0_40841993'; // usuario
    const DB_PASS = 'jumamjeetxtas'; // senha
    const DB_NAME = 'if0_40841993_XXX'; // banco
    const DB_HOST = 'sql109.infinityfree.com'; // host
    
    await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:3306/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Banco de dados conectado na nuvem!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};

module.exports = connectDB;