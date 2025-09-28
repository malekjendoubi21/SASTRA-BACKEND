const express = require('express');
require('dotenv').config();
const cors = require('cors');

const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const createAdmin = require('./config/createAdmin');
const connectDB = require('./config/DBconfig'); // connexion DB
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // autorise toutes les origines, tu peux limiter si besoin

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Connexion MongoDB et démarrage serveur
const startServer = async () => {
    try {
        await connectDB();       // connexion à la DB
        await createAdmin();     // création admin si non existant

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Erreur lors du démarrage :", err);
        process.exit(1); // quitte le process si erreur critique
    }
};

// 🔹 Appel du serveur
startServer();
