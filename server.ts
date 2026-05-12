import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Serve uploads directory - make it absolute to be safe
  app.use('/uploads', express.static(uploadDir));
  app.use(express.static(path.join(process.cwd(), 'public')));

  // API Route for file uploads
  app.post('/api/upload', upload.single('media'), (req, res) => {
    try {
      console.log('Upload request processed by multer:', req.file);
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or file type not supported' });
      }
      
      const publicPath = `/uploads/${req.file.filename}`;
      console.log('Successfully uploaded:', publicPath);
      res.json({ url: publicPath, filename: req.file.filename });
    } catch (err) {
      console.error('API Upload error:', err);
      res.status(500).json({ error: 'Internal server error during upload' });
    }
  });

  // API Routes for site data persistence
  const siteDataPath = path.join(process.cwd(), 'public', 'site_data.json');

  app.get('/api/site-data', (req, res) => {
    try {
      if (fs.existsSync(siteDataPath)) {
        const data = fs.readFileSync(siteDataPath, 'utf8');
        res.json(JSON.parse(data));
      } else {
        res.json({});
      }
    } catch (err) {
      console.error('Error reading site data:', err);
      res.status(500).json({ error: 'Failed to read site data' });
    }
  });

  app.post('/api/site-data', (req, res) => {
    try {
      fs.writeFileSync(siteDataPath, JSON.stringify(req.body, null, 2), 'utf8');
      res.json({ success: true });
    } catch (err) {
      console.error('Error saving site data:', err);
      res.status(500).json({ error: 'Failed to save site data' });
    }
  });

  // API Route for sending emails
  app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Configuration for email sending
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'bal.abinash@gmail.com',
        subject: `Contact Form: ${subject}`,
        text: `From: ${name} (${email})\n\nMessage:\n${message}`,
        replyTo: email
      };

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('EMAIL_USER or EMAIL_PASS not set. Email not sent.');
        return res.status(503).json({ 
          error: 'Email service not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.',
          debug: { name, email, subject, message }
        });
      }

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
