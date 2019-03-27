const userModel = require('../../models/user');

module.exports = app => {
	app.delete('/api/users/:id', (req, res) => {
		const id = req.params.id;

		userModel.findOneAndDelete({id},
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				res.sendStatus(204)
			})
	});
};