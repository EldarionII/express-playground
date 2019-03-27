const userModel = require('../../models/user');

module.exports = app => {
	app.patch('/api/users/:id', (req, res) => {
		const id = req.params.id;

		userModel.findOneAndUpdate({id}, req.body, {new: true},
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				res.status(200).send(result)
			})
	});
};