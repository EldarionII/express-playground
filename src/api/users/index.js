const getUsers = require('./getUsers');
const createUser = require('./createUser');
const updateUser = require('./updateUser');
const deleteUser = require('./deleteUser');

module.exports = app => {
	getUsers(app);
	createUser(app);
	updateUser(app);
	deleteUser(app);
};