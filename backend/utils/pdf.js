const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateInvoicePDF(order) {
  return new Promise(async (resolve, reject) => {
    try {
      // Populate order data
      await order.populate(['client', 'produits.produit']);
      
      const invoicesDir = path.join(__dirname, '../public/invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }
      
      const filePath = path.join(invoicesDir, `facture-${order._id}.pdf`);
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('FACTURE', { align: 'center' });
      doc.moveDown();
      
      // Client info
      doc.fontSize(12);
      doc.text(`Client: ${order.client.nom}`);
      doc.text(`Email: ${order.client.email}`);
      doc.text(`Adresse de livraison: ${order.adresseLivraison}`);
      doc.text(`Date de commande: ${order.date.toLocaleDateString('fr-FR')}`);
      doc.text(`Mode de paiement: ${order.modePaiement}`);
      doc.text(`Statut: ${order.statut}`);
      doc.moveDown();

      // Products table
      doc.text('PRODUITS COMMANDÉS:', { underline: true });
      doc.moveDown(0.5);
      
      let total = 0;
      order.produits.forEach((item) => {
        const subtotal = item.prix * item.quantite;
        total += subtotal;
        doc.text(`• ${item.produit.nom}`);
        doc.text(`  Quantité: ${item.quantite} x ${item.prix}€ = ${subtotal}€`);
        doc.moveDown(0.3);
      });

      doc.moveDown();
      doc.fontSize(14).text(`TOTAL TTC: ${total}€`, { align: 'right' });
      
      doc.end();
      
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateInvoicePDF }; 