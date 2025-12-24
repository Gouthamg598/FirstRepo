const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
// const PORT = 3000;
const PORT = process.env.PORT || 3000;


//ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

//multer storage config
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const name = `snap_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    cb(null, name);
  }
});
const upload = multer({ storage });

//serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  res.sendStatus(200);
});

//gallery page to view images
app.get('/gallery', (req, res) => {
  const files = fs.readdirSync(uploadDir).filter(f => f.endsWith('.jpg'));
  const images = files.map(f => `
     <div style="margin-bottom:15px;">
       <img src="/uploads/${f}" style="width:200px; border-radius:8px" />
       <p>${f}</p>
     </div>
   `).join('');

  res.send(`
     <html>
       <head>
         <title>Captured Images</title>
         <style>
           body { font-family: Arial; padding: 20px; }
           .grid { display: flex; flex-wrap: wrap; gap: 15px; }
         </style>
       </head>
       <body>
         <h2>Captured Images</h2>
         <div class="grid">${images}</div>
       </body>
     </html>
   `);
});

//serve uploaded images
app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => console.log(`Server running at http:localhost:${PORT}`));

