// *************************Exprees Js******************************

// require
require('dotenv').config();
const ObjectID = require('mongodb').ObjectId;
require('./Db/conn');
var express = require("express")
var bodyParser = require("body-parser")
const path = require('path');
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const Techauth = require('./middleware/teachAuth')
const adminauth = require('./middleware/adminAuth')
const UserRegister = require('./Model/register');
const TeacherRegister = require('./Model/teacherRegister')
const studentData = require('./Model/studentData')
const adminRegister = require('./Model/adminRegister')
const schoolData = require('./Model/schoolRegister')
const CityRegister = require('./Model/city')
const AreaRegister = require('./Model/area')
var JSAlert = require("js-alert");
const querystring = require('querystring');
var passport = require('passport');
const { response } = require('express');
require('./middleware/studentPassport')(passport)


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


const userAuth = passport.authenticate('jwt', { session: false })


// const userAuth = passport.authenticate('local')

// routing
app.get('/', (req, res) => {
    res.sendFile('index.html')
})

// student signup
app.post('/add', (req, res) => {
    const userReg = new UserRegister({
        name: req.body.data.name,
        email: req.body.data.email,
        password: req.body.data.password
    })
    userReg.save().then(function (data) {
        console.log("data Save")
    }).catch(function (err) {
        console.log(err)
    })
    // try {
    //     // generate token
    //     const token = await userReg.generateAuthToken()

    //     // set cookies
    //     res.cookie('jwt', token, {
    //         expires: new Date(Date.now() + 10000000),

    //     })
    res.send('hi');
    // }
    // catch (err) {

    //     console.log(err)
    // }
})

// admin signup
app.post('/addNewAdmin', async (req, res) => {
    const adminReg = new adminRegister({
        name: req.body.data.name,
        email: req.body.data.email,
        password: req.body.data.password
    })
    adminReg.save().then(function (data) {
        console.log("admin save")
    }).catch(function (err) {
        console.log(err)
    })
    res.send('hi');
})


app.post('/adminAuth', async (req, res) => {
    try {
        // Get all data
        var name = req.body.data.name;
        var email = req.body.data.email;
        var password = req.body.data.password;

        const check = await adminRegister.findOne({
            email: email,
            password: password
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
                console.log("Admin login successfully")
                return res.redirect('/auth-dashboard');
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


app.get('/auth-dashboard', adminauth,
    (req, res) => {
        return res.send('auth_dashboard.html')
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
                alert('Enter valid details ')
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

// add passportjs middleware for authenication
app.get('/student-dashboard', userAuth,
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
app.post('/addTeacher', (req, res) => {
    const TeachReg = new TeacherRegister({
        name: req.body.data.name,
        email: req.body.data.email,
        password: req.body.data.password
    })
    TeachReg.save().then(function (data) {
        console.log("Add Data");
    }).catch(function (err) {
        console.log(err);
    })
    res.redirect('/');
})

// auth for teacher dashboard
app.get('/teacher-dashboard', Techauth, function (req, res) {
    return res.json({ 'email': req.query.email })
})



// student logout
app.get('/logout', (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
})

// teacher logout
app.get('/Teachlogout', (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
})

// student logout
app.get('/adminlogout', (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
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



// see all student details with pagination
app.post('/seeAllStudentData', paginationResult(studentData), (req, res) => {
    return res.json(res.paginationResult)
})


app.post('/addStudentDetails', Techauth, (req, res) => {
    const [maths, science, english, hindi, sst] = req.body.data.marks;
    console.log(req.body.data.marks)
    studentData.create({
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
        marks: [
            { title: 'maths', marks: maths.maths },
            { title: 'science', marks: science.science },
            { title: 'hindi', marks: hindi.hindi },
            { title: 'english', marks: english.english },
            { title: 'sst', marks: sst.sst },

        ],
    }).then(function (data) {
        console.log(data);
        console.log("Data save");
    })
        .catch(function (err) {
            console.log(err);
        });

    return res.redirect('/teacher-dashboard');
})

// add school details
app.post('/addSchoolDetails', (req, res) => {
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

    }).catch(function (err) {
        console.log(err);
    })
    return res.redirect('/registered-school');

})

app.post('/addcity', (req, res) => {
    CityRegister.update({ city: req.body.data.city, region: req.body.data.region },
        { city: req.body.data.city, region: req.body.data.region }, { upsert: true }).then(
            function (data) {
                console.log("citydata", data)
            }
        ).catch(function (err) {
            console.log(err);
        })
    res.send('City Add')
})

app.post('/addArea', (req, res) => {
    AreaRegister.update({ area: req.body.data2.area, city: req.body.data2.city }, { area: req.body.data2.area, city: req.body.data2.city }
        , { upsert: true }).then(
            function (data) {
                console.log('areadata', data)
            }
        ).catch(function (err) {
            console.log(err);
        })
    res.send('Area Add')
})



app.get('/registered-school', (req, res) => {
    res.send('viewRegisteredSchool.html')
})

// delete student
app.post('/deleteStudent', Techauth, (req, res) => {
    studentData.deleteOne({
        email: req.body.data.email
    }).then(function (data) {
        return res.json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

app.post('/deleteSchool', adminauth, (req, res) => {
    schoolData.deleteOne({
        _id: req.body.data.id
    }).then(function (data) {
        return res.json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

app.post('/fetchallAreaSchool', (req, res) => {
    console.log(req.body)
    var areaName = req.body.area;
    schoolData.aggregate(
        [
            { $match: { area: areaName } }
        ]
    ).then(function (data) {
        console.log(data)
        res.json(data)
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
app.post('/getRegionList', (req, res) => {
    CityRegister.find().then(
        function (data) {
            return res.json(data)
        }).catch(function (err) {
            console.log(err)
        })

})

app.post('/getareaList', (req, res) => {
    AreaRegister.find({ city: req.body.data.city }).then(
        function (data) {
            return res.json(data)
        }).catch(function (err) {
            console.log(err)
        })
})



app.post('/getcityList', (req, res) => {
    CityRegister.find({ region: req.body.data.region }).then(
        function (data) {
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
    console.log(schoolName)
    var limit = req.body.data.limit;

    var schoolPip = [
        { $match: { school: schoolName } },
        { $unwind: "$marks" },

        {
            '$group': {
                _id: { rollNo: "$rollNo", name: "$name", school: "$school", email: "$email" },
                'total': { '$sum': '$marks.marks' }
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
        console.log(data)
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
        { $unwind: "$marks" },
        {
            '$group': {
                _id: { rollNo: "$rollNo", name: "$name", school: "$school", email: "$email" },
                'total': { '$sum': '$marks.marks' }
            }
        },
        {
            $project: {
                'percent': { $round: [{ $multiply: [{ $divide: ["$total", 500] }, 100] }, 1] },
                'totalMarks': '$total'
            }
        },
        { $match: { percent: { $gt: criteria } } },

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

            { $unwind: "$marks" },
            {
                '$group': {
                    _id: { rollNo: "$rollNo", name: "$name", school: "$school", email: "$email" },
                    'total': { '$sum': '$marks.marks' }
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

        { $unwind: "$marks" },
        {
            '$group': {
                _id: { rollNo: "$rollNo", name: "$name", school: "$school", email: "$email" },
                'total': { '$sum': '$marks.marks' }
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