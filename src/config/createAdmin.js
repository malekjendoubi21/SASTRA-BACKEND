const User = require('../models/User');
const bcrypt = require('bcrypt');

const createAdmin = async () => {
    try {
        const adminEmail = 'admin@SastraEnergy.com';
        const existingAdmin = await User.findOne({ mail: adminEmail });

        if (existingAdmin) {
            console.log('Admin déjà existant');
            return;
        }

        const hashedPassword = await bcrypt.hash('Admin123!', 10); // mot de passe par défaut
        const adminUser = new User({
            nom: 'Admin',
            prenom: 'Super',
            mail: adminEmail,
            motDePasse: hashedPassword,
            typeUser: 'admin'
        });

        await adminUser.save();
        console.log('Admin créé avec succès');
    } catch (err) {
        console.error('Erreur lors de la création de l’admin :', err.message);
    }
};

module.exports = createAdmin;
