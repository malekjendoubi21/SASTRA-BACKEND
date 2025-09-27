const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB connecté');
    } catch (err) {
        console.error('❌ Erreur MongoDB:', err);
        process.exit(1); // arrêter le serveur si échec de connexion
    }
};

module.exports = connectDB;
