// backend/scripts/createAdmin.js
const User = require('../models/user');
const mongoose = require('mongoose');

const createAdmin = async () => {
  await mongoose.connect('mongodb://localhost:27017/seu_banco');
  
  const admin = new User({
    name: 'NAKA',
    email: 'maiconaurelio332@gmail.com',
    password: 'jumamjeetxt25',
    role: 'admin'
  });
  
  await admin.save();
  console.log('✅ Admin criado: maiconaurelio332@gmail.com / jumamjeetxt25');
  process.exit();
};

createAdmin();