// *************************Exprees Js******************************

// require
require('dotenv').config();
require('./Db/conn');
var express = require("express")
var bodyParser = require("body-parser")
const path = require('path');
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const auth = require('./middleware/auth')
const Techauth = require('./middleware/teachAuth')
const UserRegister = require('./Model/register');
const TeacherRegister = require('./Model/teacherRegister')
const studentData = require('./Model/studentData')
const schoolData = require('./Model/schoolRegister')
var JSAlert = require("js-alert");
const querystring = require('querystring');
var passport = require('passport');
const { response } = require('express');
require('./middleware/studentPassport')(passport)
// require('./middleware/teacherPassport')(passport)

// get port
const port = process.env.PORT || 8000;

// express app
const app = express();

const staticpath = path.join(__dirname, "/public")
app.set("view engine", "hbs");
app.use(bodyParser.json())
app.use(express.static("public"));
app.use(cookieParser())
app.use(passport.initialize())

// routing
app.get('/', (req, res) => {
    res.sendFile('index.html')
})

// student signup
app.post('/add', async (req, res) => {
    const userReg = new UserRegister({
        name: req.body.data.name,
        email: req.body.data.email,
        password: req.body.data.password
    })
    try {
        // generate token
        const token = await userReg.generateAuthToken()

        // set cookies
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 10000000),
            httpOnly: true
        })
        res.redirect('/student-dashboard');
    }
    catch (err) {
        console.log(err)
    }
})

// login
app.post('/getuser', async (req, res) => {
    try {
        // Get all data
        const name = req.body.data.name;
        const email = req.body.data.email;
        const pass = req.body.data.password;

        const check = await UserRegister.findOne({
            email: email,
            password: pass
        })
        if (check !== null) {
            // create token
            const token = await check.generateAuthToken();
            console.log(token)
            // set cookies
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 10000000)
            })
            // verify name
            if (check.name == name) {
                console.log("login successfully")
                // res.redirect('/student-dashboard');
                res.redirect('/student-dashboard?email=' + email);
            }
            else {
                alert('Enter valid details')
            }
        }
        else {
            JSAlert.alert("Enter valid details");
        }
    }
    catch (err) {
        console.log(err);
    }
})

// add middleware for authenication
// app.get('/student-dashboard', auth, (req, res) => {
//     console.log(req.query.email)
//     // res.sendFile(path.join(__dirname, '/public/studentDashboard.html'));
//     return res.json({'email':req.query.email})
//     // res.render("studentDashboard",{email:req.query.email})
// })

// add passportjs middleware for authenication
app.get('/student-dashboard', passport.authenticate('jwt', { session: false }),
    function (req, res) {
        return res.json({ 'email': req.query.email })
    })

// login teacher
app.post('/getTeacher', async (req, res) => {
    try {
        // Get all data
        const name = req.body.data.name;
        const email = req.body.data.email;
        const pass = req.body.data.password;
        const check = await TeacherRegister.findOne({
            email: email,
            password: pass
        })
        if (check !== null) {
            const token = await check.generateAuthToken();
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 10000000)
            })
            if (check.name == name) {
                console.log("login successfully")
                res.redirect('/teacher-dashboard?email=' + email);
            }
            else {
                alert('Enter valid details')
            }
        }
        else {
        }
    }
    catch (err) {
        console.log(err);
    }
})

// teacher signup
app.post('/addTeacher', async (req, res) => {
    const TeachReg = new TeacherRegister({
        name: req.body.data.name,
        email: req.body.data.email,
        password: req.body.data.password
    })
    try {
        const token = await TeachReg.generateAuthToken()
        
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 100000000),

        })

        res.redirect('/teacher-dashboard');
    }
    catch (err) {
        console.log(err)
    }


    // TeachReg.save().then(function(data){
    //     console.log("Add Data");   
    // }).catch(function(err)
    // {
    //     console.log(err);
    // })
})

// app.get('/teacher-dashboard', Techauth, (req, res) => {
//     console.log(req.query.email)
//     // res.sendFile(path.join(__dirname, '/public/teacherDashboard.html'));
//     return res.json({'email':req.query.email})
//     // res.render("studentDashboard",{email:req.query.email})
// })

// auth for teacher dashboard
app.get('/teacher-dashboard', Techauth, function (req, res) {
    return res.json({ 'email': req.query.email })
})

// student logout
app.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((elem) => {
            return elem.token != req.token;
        })
        res.clearCookie('jwt');
        console.log("logout successfully");
        await req.user.save();
        res.redirect("/")
    }
    catch (err) {
        console.log(err);
    }
})

// teacher logout
app.get('/Teachlogout', Techauth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((elem) => {
            return elem.token != req.token;
        })
        res.clearCookie('jwt');
        console.log("logout successfully");
        await req.user.save();
        res.redirect("/")
    }
    catch (err) {
        console.log(err);
    }
})

// see student data
app.post('/seeStudentData', (req, res) => {
    studentData.findOne({
        email: req.body.data.email
    }).then(function (data) {
        return res.json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// app.post('/seeAllStudentData', (req, res) => {
//     // console.log("myt",req.body.data.email);
//     studentData.find({ temail: req.body.data.email }).then(function (data) {
//         // console.log("Start",data)
//         return res.json(data)
//     }).catch(function (err) {
//         console.log(err)
//     })
// })

// see all student details with pagination
app.post('/seeAllStudentData', paginationResult(studentData), (req, res) => {
    return res.json(res.paginationResult)
})


app.post('/addStudentDetails', (req, res) => {
    const studentDataObj = new studentData({
        rollNo: req.body.data.rollNo,
        name: req.body.data.name,
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
        marks: req.body.data.marks

    })
    studentDataObj.save().then(function (data) {
        console.log("Data save");
    }).catch(function (err) {
        console.log(err);
    })
    return res.redirect('/teacher-dashboard');
})

// add school details
app.post('/addSchoolDetails', (req, res) => {
    const schoolDataObj = new schoolData({
        schoolname: req.body.myObj.school_name,
        schoolemail: req.body.myObj.school_email,
        area: req.body.myObj.area,
        city: req.body.myObj.city,
    })
    
    schoolDataObj.save().then(function (data) {
        console.log("Data save");
    }).catch(function (err) {
        console.log(err);
    })
    return res.redirect('/teacher-dashboard');
})

// delete student
app.post('/deleteStudent', (req, res) => {
    studentData.deleteOne({
        email: req.body.data.email
    }).then(function (data) {
        return res.json(data)
    }).catch(function (err) {
        console.log(err)
    })

})

// get school name
app.get('/schoolName', (req, res) => {
    schoolData.find().then(function (data) {
        return res.json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// get area name
app.get('/areaName', (req, res) => {
    schoolData.find().then(function (data) {
        return res.json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// fetch all students that are of that school
app.post('/indiviualSchoolStudent', (req, res) => {
    
    var schoolName = req.body.data.school;
    var limit = req.body.data.limit;

    var schoolPip = [
        { $match: { school: schoolName } },
        {
            '$addFields': {
                'marks': { $objectToArray: '$marks' }
            }
        },
        { $unwind: "$marks" },
        {
            '$group': {
                _id: { rollNo: "$rollNo", name: "$name", school: "$school", email: "$email" },
                'total': { '$sum': '$marks.v' }
            }
        },
        {
            $project: {
                'percent': { $round: [{ $multiply: [{ $divide: ["$total", 500] }, 100] }, 1] },
                'totalMarks': '$total'
            }
        },
        { $sort: { totalMarks: -1 } }
    ]
    if (limit == 3) {
        schoolPip.push(
            { $limit: limit }
        )
    }
    else {
        schoolPip = schoolPip
    }
    studentData.aggregate(schoolPip).then(function (data) {
        return res.json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// fetch all students on the basic of percentage 
app.post('/criteria', (req, res) => { 
    var schoolName = req.body.data.school;
    var criteria = parseInt(req.body.data.crteria);
    var schoolPip = [
        { $match: { school: schoolName } },
        {
            '$addFields': {
                'marks': { $objectToArray: '$marks' }
            }
        },
        { $unwind: "$marks" },
        {
            '$group': {
                _id: { rollNo: "$rollNo", name: "$name", school: "$school", email: "$email" },
                'total': { '$sum': '$marks.v' }
            }
        },
        {
            $project: {
                'percent': { $round: [{ $multiply: [{ $divide: ["$total", 500] }, 100] }, 1] },
                'totalMarks': '$total'

            }
        },
        {$match: {percent: {$gt: criteria}}} ,
       
        { $sort: { totalMarks: -1 } }
    ]
    
    studentData.aggregate(schoolPip).then(function (data) {
        // console.log(data)
        return res.json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// fetch top 3 students of that area 
app.post('/topAreaStudent', (req, res) => {
    var areaName = req.body.data.area;
    schoolData.aggregate(
        [
            { $match: { area: areaName } }
        ]
    ).then(function (data) {
        var schoolList = []
        for (let i = 0; i < data.length; i++) {
            schoolList.push(data[i].schoolname);
        }
        
        var schoolAreaPip = [
            {
                $match: {
                    school: {
                        $in: schoolList
                    }
                }
            },
            {
                '$addFields': {
                    'marks': { $objectToArray: '$marks' }
                }
            },
            { $unwind: "$marks" },
            {
                '$group': {
                    _id: { rollNo: "$rollNo", name: "$name", school: "$school", email: "$email" },
                    'total': { '$sum': '$marks.v' }
                }
            },
            {
                $project: {
                    'percent': { $round: [{ $multiply: [{ $divide: ["$total", 500] }, 100] }, 1] },
                    'totalMarks': '$total'
                }
            },
            { $sort: { totalMarks: -1 } },
            { $limit: 3 }
        ]
        studentData.aggregate(schoolAreaPip).then(function (data) {
            return res.json(data)
        }).catch(function (err) {
            console.log(err)
        })
    }).catch(function (err) {
        console.log(err)
    })

})

// top 3 student of db
app.get('/topStudent', (req, res) => {

    var schoolPip2 = [
        {
            '$addFields': {
                'marks': { $objectToArray: '$marks' }
            }
        },
        { $unwind: "$marks" },
        {
            '$group': {
                _id: { rollNo: "$rollNo", name: "$name", school: "$school", email: "$email" },
                'total': { '$sum': '$marks.v' }
            }
        },
        {
            $project: {
                'percent': { $round: [{ $multiply: [{ $divide: ["$total", 500] }, 100] }, 1] },
                'totalMarks': '$total'
            }
        },
        { $sort: { totalMarks: -1 } },
        { $limit: 3 }

    ]

    studentData.aggregate(schoolPip2).then(function (data) {
        return res.json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// pagination function
function paginationResult(model) {
    return async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1

            // const limit = parseInt(req.query.limit)
            let limit = await model.countDocuments().exec() / 3;

            if (page == 1) {
                limit = Math.ceil(limit)
            }
            else {
                limit = Math.ceil(limit)
            }
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const result = {};

            result.result = await model.find({ temail: req.body.data.email }).limit(limit).skip(startIndex).exec();
            res.paginationResult = result;
            next();
        }
        catch (err) {
            console.log(err)
        }
    }
}

// listen to a port
app.listen(port, () => {
    console.log("server is running: " + port)
})