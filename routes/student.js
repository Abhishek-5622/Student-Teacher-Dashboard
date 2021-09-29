const express = require('express')
const router = express.Router();
const UserRegister = require('../Model/register');

// student signup
router.post('/add', (req, res) => {
    const userReg = new UserRegister({
        name: req.body.data.name,
        email: req.body.data.email,
        password: req.body.data.password
    })
    userReg.save().then(function (data) {
        console.log("data Save")
        res.status(200).send('hi');
    }).catch(function (err) {
        console.log(err)
        res.status(400).send('error');
    })
    
})

// student login
router.post('/getuser',  (req, res) => {
        // Get all data
        const name = req.body.data.name;
        const email = req.body.data.email;
        const pass = req.body.data.password;
        UserRegister.findOne({
            email: email,
            password: pass,
            name: name
        }).then(function (data) {
    
            var check = data;
            if (check !== null) {
                return check.generateAuthToken()
            }
            else {
                res.status(401).send("Error")
            }
        }).then(function (data) {
            res.cookie('jwt', data, {
                expires: new Date(Date.now() + 10000000)
            })
            console.log("login successfully")
            res.redirect('/student-dashboard?email=' + email);
        }).catch(function (err) {
            console.log(err)
        });

})

// student logout
router.get('/logout', (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).redirect("/");
})

module.exports = router;
