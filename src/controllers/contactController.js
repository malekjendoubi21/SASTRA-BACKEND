const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// 📩 POST contact (support anonyme, tout le monde peut l'utiliser)
const createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message, projectType } = req.body;

        // Vérification que le type de projet existe
        if (!projectType) {
            return res.status(400).json({ success: false, message: "Type de projet requis" });
        }

        const newContact = new Contact({
            name,
            email,
            phone,
            subject,
            message,
            projectType
        });

        await newContact.save();

        res.status(201).json({
            success: true,
            message: "Message envoyé avec succès",
            data: newContact
        });
    } catch (error) {
        console.error("Erreur createContact:", error);
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// 📊 GET all contacts (admin only)
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .populate("projectType", "label") // récupérer juste le label
            .sort({ createdAt: -1 });

        res.json({ success: true, data: contacts });
    } catch (error) {
        console.error("Erreur getAllContacts:", error);
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// ❌ DELETE contact (admin only)
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Message introuvable" });
        }
        res.json({ success: true, message: "Message supprimé" });
    } catch (error) {
        console.error("Erreur deleteContact:", error);
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};
// ✏️ PUT contact - ajouter ou modifier la réponse (admin only)
const updateContactResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { reponse } = req.body;

        if (!reponse) {
            return res.status(400).json({ success: false, message: "La réponse est requise" });
        }

        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Message introuvable" });
        }

        // Mettre à jour la réponse
        contact.reponse = reponse;
        await contact.save();

        // 🔔 Configurer Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 📧 Email à envoyer avec template HTML
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: contact.email,
            subject: `Réponse à votre message : ${contact.subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #007bff;">Bonjour ${contact.name},</h2>
            <p>Merci d'avoir contacté notre support. Voici la réponse à votre message :</p>
            <div style="padding: 10px; margin: 15px 0; border-left: 4px solid #007bff; background-color: #f1f1f1;">
                ${reponse}
            </div>
            <p>Cordialement,</p>
            <p><strong>L'équipe Support</strong></p>
        </div>
    `
        };


        // Envoyer l'email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Réponse ajoutée et email envoyé avec succès",
            data: contact
        });
    } catch (error) {
        console.error("Erreur updateContactResponse:", error);
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    deleteContact,
    updateContactResponse
};
