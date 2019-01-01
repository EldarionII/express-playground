const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

const mongodbUrl = 'mongodb://admin:admin123@ds026658.mlab.com:26658/express-playground';

let db;

MongoClient.connect(mongodbUrl, (error, client) => {
    if (error) {
        return console.log(error)
    }

    db = client.db('express-playground');

    app.listen(3000, () => {
        console.log('listening on 3000')
    })
});


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {
        if (err) return console.log(err);
        // renders index.ejs
        res.render('index.ejs', {quotes: result})
    })
});

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (error, result) => {
        if (error) {
            return console.log(error);
        }

        console.log('saved to database');

        res.redirect('/')
    })
});

app.put('/quotes', (req, res) => {
    db.collection('quotes')
        .findOneAndUpdate({name: 'Yoda'}, {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        }, {
            sort: {_id: -1},
            upsert: true
        }, (err, result) => {
            if (err) return res.send(err);
            res.send(result)
        })
});

app.delete('/quotes', (req, res) => {
    db.collection('quotes').findOneAndDelete({name: req.body.name},
        (err, result) => {
            if (err) return res.send(500, err);
            res.send({message: 'A darth vadar quote got deleted'})
        })
});