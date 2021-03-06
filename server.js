const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersApi = require('./src/api/users');

const app = express();

let db;

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/express-playground', {useNewUrlParser: true});

db = mongoose.connection;

db.on('error', (e) => console.log(e));
db.once('open', () => {
	https.createServer({
		key: fs.readFileSync('server.key'),
		cert: fs.readFileSync('server.cert')
	}, app).listen(3000, () => {
		console.log('listening on 3000')
	});
	mongoose.set('useCreateIndex', true);
	app.set('views', __dirname + '/src/views');
	app.set('view engine', 'ejs');

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(express.static('public'));
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
		next();
	});

	app.get(/^((?!api).)*$/, (req, res) => {
		db.collection('users').find().toArray(err => {
			if (err) {
				return console.log(err);
			}
		});
		res.render('index.ejs')
	});

	usersApi(app)
});