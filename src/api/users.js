const mongoose = require('mongoose');
const userModel = require('../models/user');

module.exports = function (db, app) {
    app.get('/api/users', (req, res) => {
        userModel.find({}, (error, result) => {
            if (error) {
                return console.log(error);
            }

            res.send(result)
        });
    });

    app.post('/api/users', (req, res) => {
        const newUser = new userModel({...req.body, first_name: "", family_name: ""});

        newUser.save((err, result) => {
            if (err) {
                console.log(err)
            }

            res.status(201);
            res.send(result)
        });
    });

    app.delete('/api/users/:id', (req, res) => {
        const _id = mongoose.Types.ObjectId(req.params.id);

        userModel.findOneAndDelete({_id},
            (err, result) => {
                if (err) {
                    return res.send(500, err);
                }

                res.status(204);
                res.send()
            })
    });
};