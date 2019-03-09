module.exports = function (db, app) {
    app.get('/api/users', (req, res) => {
        db.collection('users').find().toArray((err, result) => {
            if (err) return console.log(err);
            res.send(result)
        })
    });

    app.post('/api/users', (req, res) => {
        db.collection('users').save(req.body, (error, result) => {
            if (error) {
                return console.log(error);
            }

            res.send(result)
        })
    });

    app.delete('/api/users', (req, res) => {
        db.collection('users').findOneAndDelete({name: req.body.name},
            (err, result) => {
                if (err) return res.send(500, err);
                res.send({message: 'A darth vader quote got deleted'})
            })
    });
};