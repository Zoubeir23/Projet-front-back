const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOrderEmail(to, order, type) {
  let subject, text;
  
  switch (type) {
    case 'confirmation':
      subject = 'Confirmation de commande';
      text = `Votre commande #${order._id} a été confirmée. Statut: ${order.statut}`;
      break;
    case 'status_update':
      subject = 'Mise à jour de votre commande';
      text = `Le statut de votre commande #${order._id} a été mis à jour: ${order.statut}`;
      break;
    case 'payment_confirmation':
      subject = 'Confirmation de paiement';
      text = `Le paiement de votre commande #${order._id} a été confirmé.`;
      break;
    default:
      subject = 'Notification de commande';
      text = `Mise à jour concernant votre commande #${order._id}`;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès');
  } catch (error) {
    console.error('Erreur envoi email:', error);
  }
}

module.exports = { sendOrderEmail };