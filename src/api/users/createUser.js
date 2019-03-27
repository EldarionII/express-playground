const bcrypt = require('bcrypt');
const userModel = require('../../models/user');
const moment = require('moment');

class NewUser {
	constructor(newUser, res) {
		this.newUser = newUser;
		this.res = res;
	}

	createNewUser() {
		this.hashPassword()
			.then(() => this.formatNewUser()
				.then(() => this.saveNewUserInDB()))
	};

	hashPassword() {
		return new Promise(resolve => {
			bcrypt.hash(this.newUser.password, 10, (err, hash) => {
				if (err) {
					return this.res.status(500).send(err);
				}

				this.newUser.password = hash;

				resolve();
			});
		})
	};

	formatNewUser() {
		return new Promise(resolve => {
			userModel.findOne().sort({id: -1}).exec((err, lastUser) => {
				if (err) {
					return this.res.status(500).send(err);
				}

				const id = lastUser ? lastUser.id + 1 : 0;
				const created_at = moment().format();

				this.newUser = new userModel({
					id,
					...this.newUser,
					created_at,
					bio: "",
					own_projects_ids: [],
					open_projects_ids: [],
				});

				resolve()
			});
		});
	};

	saveNewUserInDB() {
		this.newUser.save((err, result) => {
			if (err) {
				if (err.name === "ValidationError") {
					this.res.status(400);
				} else {
					this.res.status(500);
				}

				this.res.send(err.message)
			}

			this.res.status(201).send(result);
		});
	};
}

module.exports = app => {
	app.post('/api/users', (req, res) => {
		const newUser = new NewUser(req.body, res);

		newUser.createNewUser();
	});
};