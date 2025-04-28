const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage }).single('image');

app.set('view engine', 'ejs');
app.use(express.static('public'))

//routes
app.get('/', (req, res) => res.render("index"));

app.post('/upload', (req, res) => {

    upload(req, res, err  => {
        console.log(req.file)
        fs.readFile(`./uploads/${req.file.originalname}`, async (error, data) => {
            if(err) return console.log('Error', error)
            
            const worker = await createWorker();
            const ret = await worker.recognize(`./uploads/${req.file.originalname}`);
            console.log(ret.data.text);
            res.send(`<div>${ret.data.text.replace(/\n/g, '<br>')}</div>`);
            worker.terminate();
        })
    });

})

// start up our server
const PORT = 5000 | process.env.PORT;
app.listen(PORT, ()=> console.log(`Hey I'm running on port ${PORT}`));



