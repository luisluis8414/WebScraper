const express = require('express'); 
const multer  = require('multer'); 
const path = require('path');
const script = require('./script');

const app = express(); 

async function execute(filePath)
{
    const emails= await script.findAllEmails(filePath);
    console.log(emails);
}
const upload = multer({
  storage: multer.diskStorage({ 
    destination: './upload/', 
    filename: function (req, file, cb) {
      cb(null, file.originalname); 
    },
  }),
});





app.post('/uploads', upload.single('excel-file'), (req, res) => {

    const filePath = req.file.path;
    console.log(req.file);
    const filePathHtml = path.join(__dirname, './returns/loading.html');
    res.sendFile(filePathHtml);
    execute(filePath);
  });


app.listen(3000, () => {
  console.log('Server gestartet auf Port 3000');
});
