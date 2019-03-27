const userModel = require('../../models/user');

module.exports = app => {
	app.get('/api/users', (req, res) => {
		const condition = req.body.id ? {id: req.body.id} : {};

		userModel.find(condition, (error, result) => {
			if (error) {
				return res.status(500).send(error);
			}

			res.send(result)
		});
	});
};