const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

let db;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/express-playground', {useNewUrlParser: true});

db = mongoose.connection;

db.on('error', (e) => console.log(e));
db.once('open', () => {
    db.collection('users').find().toArray((err, result) => {
        console.log(result);
    });

    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app).listen(3000, () => {
        console.log('listening on 3000')
    });

    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(express.static('public'));
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.get(/^((?!api).)*$/, (req, res) => {
        db.collection('users').find().toArray(err => {
            if (err) return console.log(err);
        });
        res.render('index.ejs')
    });

    app.get('/api/users', (req, res) => {
        db.collection('users').find().toArray((err, result) => {
            if (err) return console.log(err);
            res.send(result)
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
                res.send({message: 'A darth vader quote got deleted'})
            })
    });

    require('./users/test').test();
});