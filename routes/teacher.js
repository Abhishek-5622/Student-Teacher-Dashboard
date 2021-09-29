const express = require('express')
const router = express.Router();
const TeacherRegister = require('../Model/teacherRegister')
const studentData = require('../Model/studentData')

// teacher signup
router.post('/addTeacher', (req, res) => {
    const TeachReg = new TeacherRegister({
        name: req.body.data.name,
        email: req.body.data.email,
        password: req.body.data.password
    })
    TeachReg.save().then(function (data) {
        console.log("Add Data");
        res.status(200).redirect('/');
    }).catch(function (err) {
        console.log(err);
        res.status(400).send('error');
    })

})

// login teacher
router.post('/getTeacher', async (req, res) => {
    const name = req.body.data.name;
    const email = req.body.data.email;
    const pass = req.body.data.password;
    TeacherRegister.findOne({
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
        res.redirect('/teacher-dashboard?email=' + email);
    }).catch(function (err) {
        console.log(err)
    });

})




// all student data and pagination
router.post("/seeAllStudentData", (req, res) => {
    const pageOptions = {
        page: parseInt(req.body.page, 10) || 0,
        limit: parseInt(req.body.limit, 10) || 0,
    };
    studentData.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .then(function (doc) {
            res.status(200).json(doc)
        }).catch(function (err) {
            res.status(401).send(err)
        })
});

// get total length of student document
router.get('/getLength', (req, res) => {
    studentData.find().then(function (data) {
        res.status(200).json(data.length)
    }).catch(function (err) {
        console.log(err)
    })
})

// add student details
router.post('/addStudentDetails', (req, res) => {
    const [maths, science, english, hindi, sst] = req.body.data.marks;
    studentData.create({
        rollNo: req.body.data.rollNo,
        name: req.body.data.name,
        date: req.body.data.date,
        email: req.body.data.email,
        mobileNo: req.body.data.mobileNo,
        address: req.body.data.address,
        city: req.body.data.city,
        area: req.body.data.area,
        motherName: req.body.data.motherName,
        fatherName: req.body.data.fatherName,
        classCoordinator: req.body.data.classCoordinator,
        sclass: req.body.data.sclass,
        temail: req.body.data.temail,
        school: req.body.data.school,
        marks: [
            { title: 'maths', marks: maths.maths },
            { title: 'science', marks: science.science },
            { title: 'hindi', marks: hindi.hindi },
            { title: 'english', marks: english.english },
            { title: 'sst', marks: sst.sst },
        ],
    }).then(function (data) {
        res.status(200).json(data)
        console.log("Data save");
    })
        .catch(function (err) {
            console.log(err);
            res.status(400).json({ error: err })
        });
})

// delete student
router.post('/deleteStudent', (req, res) => {
    studentData.deleteOne({
        email: req.body.data.email
    }).then(function (data) {
        return res.status(200).json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// teacher logout
router.get('/Teachlogout', (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).redirect("/");
})

module.exports = router;