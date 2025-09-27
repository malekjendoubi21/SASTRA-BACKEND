const express = require('express');
require('dotenv').config();
const cors = require('cors');

const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const createAdmin = require('./config/createAdmin');
const connectDB = require('./config/DBconfig'); // <-- import connexion DB
const app = express();

// Middleware
app.use(express.json());
/*app.use(cors({
    origin: 'http://localhost:5173'
}));*/
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Connexion MongoDB et démarrage serveur
const startServer = async () => {
    await connectDB();       // connexion à la DB
    await createAdmin();     // création admin si non existant

    app.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Serveur lancé sur http://localhost:${process.env.PORT || 5000}`);
    });
};

//startServer();
