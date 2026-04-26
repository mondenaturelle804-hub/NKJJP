import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { dirname } from 'path';
import { mkdirSync } from 'fs';

const PDF_DIR = './pdfs';

// Ensure PDF directory exists
try {
  mkdirSync(PDF_DIR, { recursive: true });
} catch (error) {
  console.error('Erreur création répertoire PDF:', error.message);
}

export const generatePlanPDF = (plan, user) => {
  return new Promise((resolve, reject) => {
    const filename = `plan_${plan._id}_${Date.now()}.pdf`;
    const filepath = `${PDF_DIR}/${filename}`;

    const doc = new PDFDocument();
    const stream = createWriteStream(filepath);

    stream.on('error', reject);
    doc.on('error', reject);

    doc.pipe(stream);

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('VitalPlan AI', { align: 'center' });
    doc.fontSize(16).text(plan.title || 'Mon Plan Personnalisé', { align: 'center' });
    doc.moveDown(0.5);

    // User info
    doc.fontSize(10).font('Helvetica').text(`Généré pour: ${user.firstName} ${user.lastName}`, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });
    doc.moveDown(1);

    // Plan info section
    doc.fontSize(12).font('Helvetica-Bold').text('Informations du Plan');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Type: ${plan.type}`);
    doc.text(`Durée estimée: ${plan.estimatedDuration}`);
    doc.text(`Difficulté: ${plan.difficulty}`);
    doc.moveDown(1);

    // Content
    doc.fontSize(12).font('Helvetica-Bold').text('Contenu du Plan');
    doc.fontSize(10).font('Helvetica');
    doc.text(plan.content, {
      align: 'left',
      width: 500,
      ellipsis: false
    });

    // Footer
    doc.moveDown(1);
    doc.fontSize(8).text('VitalPlan AI © 2024 - Tous droits réservés', { align: 'center' });

    doc.end();

    stream.on('finish', () => {
      resolve({ filename, filepath, size: stream.bytesWritten });
    });
  });
};

export const getPDFPath = (filename) => {
  return `${PDF_DIR}/${filename}`;
};

export default {
  generatePlanPDF,
  getPDFPath
};
