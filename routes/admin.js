// ***********************Admin Router**********************

const express = require('express')
const router = express.Router();
const adminRegister = require('../Model/adminRegister')
const schoolData = require('../Model/schoolRegister')
const CityRegister = require('../Model/city')
const AreaRegister = require('../Model/area')

// admin signup
router.post('/addNewAdmin', async (req, res) => {
    const adminReg = new adminRegister({
        name: req.body.data.name,
        email: req.body.data.email,
        password: req.body.data.password
    })
    adminReg.save().then(function (data) {
        console.log("admin save")
        res.status(200).send('Save');
    }).catch(function (err) {
        console.log(err)
        res.status(400).send(err);
    })
    
})

// Admin Login
router.post('/adminAuth', async (req, res) => {
        // Get all data
        var name = req.body.data.name;
        var email = req.body.data.email;
        var password = req.body.data.password;
        adminRegister.findOne({
            email: email,
            password: password,
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
            console.log("Admin login successfully")
            return res.status(200).redirect('/auth-dashboard');
        }).catch(function (err) {
            console.log(err)
            res.status(401).send('Error')
        });
      
})

// add school details
router.post('/addSchoolDetails', (req, res) => {
    const schoolDataObj = new schoolData(
        {
            schoolname: req.body.myObj.school_name,
            schoolemail: req.body.myObj.school_email,
            city: req.body.myObj.city,
            region: req.body.myObj.region,
            area: req.body.myObj.area,
        })
    schoolDataObj.save().then(function (data) {
        console.log("Data save");
        res.redirect('/admin/registered-school');
    }).catch(function (err) {
        console.log(err);
        // res.status(400).send("Error: ",err);
    })
})

router.get('/registered-school', (req, res) => {
    res.status(200).send('viewRegisteredSchool.html')
})

// give school document length
router.get('/getSchoolLength', (req, res) => {
    schoolData.find().then(function (data) {
        res.status(200).json(data.length)
    }).catch(function (err) {
        console.log(err)
    })
})

// school details and Pagination
router.post('/fetchSchoolDetails', (req, res) => {
    const pageOptions = {
        page: parseInt(req.body.page, 10) || 0,
        limit: parseInt(req.body.limit, 10) || 0,
    };
    schoolData.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .then(function (doc) {
            res.status(200).json(doc)
        }).catch(function (err) {
            res.status(401).send(err)
        })
})

// delete school
router.post('/deleteSchool', (req, res) => {
    schoolData.deleteOne({
        _id: req.body.data.id
    }).then(function (data) {
        return res.status(200).json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// add city in db
router.post('/addcity', (req, res) => {
    CityRegister.update({ city: req.body.data.city, region: req.body.data.region },
        { city: req.body.data.city, region: req.body.data.region }, { upsert: true }).then(
            function (data) {
                console.log("Add City")
            }
        ).catch(function (err) {
            console.log(err);
        })
    res.status(200).send('City Add')
})

// add area in db
router.post('/addArea', (req, res) => {
    AreaRegister.update({ area: req.body.data2.area, city: req.body.data2.city }, { area: req.body.data2.area, city: req.body.data2.city }
        , { upsert: true }).then(
            function (data) {
                console.log('areadata', data)
            }
        ).catch(function (err) {
            console.log(err);
        })
    res.status(200).send('Area Add')
})

// admin logout
router.get('/adminlogout', (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
})

module.exports = router;