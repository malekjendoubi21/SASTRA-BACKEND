const express = require('express');
require('dotenv').config();
const cors = require('cors');

const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const contactRoutes = require('./routes/contactRoutes');
const projectTypeRoutes = require('./routes/projectTypeRoutes');
const locationRoutes = require('./routes/locationRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const createAdmin = require('./config/createAdmin');
const connectDB = require('./config/DBconfig'); // connexion DB
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/project-types", projectTypeRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/partners", partnerRoutes);


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
