const express = require('express'); // Importieren des Express-Frameworks
const multer  = require('multer'); // Importieren des Multer-Moduls
const path = require('path'); // Importieren des Path-Moduls
const script = require('./script');

const app = express(); // Erstellen einer neuen Express-App

async function execute(filePath)
{
    const emails= await script.findAllEmails(filePath);
    console.log(emails);
}
const upload = multer({ // Konfigurieren von Multer
  storage: multer.diskStorage({ // Verwenden von Multer.diskStorage als Speicheroption
    destination: './upload/', // Speicherort für die hochgeladene Datei
    filename: function (req, file, cb) { // Konfigurieren des Dateinamens
      cb(null, file.originalname); // Verwenden des ursprünglichen Dateinamens der hochgeladenen Datei
    },
  }),
});




// Routen-Endpunkt für das Hochladen der Datei definieren
app.post('/uploads', upload.single('excel-file'), (req, res) => {
    // Die hochgeladene Datei ist jetzt unter req.file verfügbar
    const filePath = req.file.path;
    console.log(req.file);
    const filePathHtml = path.join(__dirname, './returns/loading.html');
    res.sendFile(filePathHtml);
    execute(filePath);
  });

// Server starten
app.listen(3000, () => {
  console.log('Server gestartet auf Port 3000');
});
