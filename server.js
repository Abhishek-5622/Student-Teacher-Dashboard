// *************************Exprees Js******************************

require('dotenv').config();
// ************connection to db******************
require('./Db/conn');
// ***********Moules require*********************
var express = require("express")
var bodyParser = require("body-parser")
const path = require('path');
var passport = require('passport');
const cookieParser = require('cookie-parser')
// ************Model(Schema)**********************
const studentData = require('./Model/studentData')
// *****************Route file**********************
const studentRoute = require('./routes/student')
const teacherRoute = require('./routes/teacher')
const adminRoute = require('./routes/admin')
const analysisRoute = require('./routes/analysis')
//***************Auth middleware******************
var userAuth =passport.authenticate('jwt', { session: false })


// get port
const port = process.env.PORT || 8000;

// express app
const app = express();

// use 
const staticpath = path.join(__dirname, "/public")
app.use(bodyParser.json())
app.use(express.static("public"));
app.use(cookieParser())
app.use(passport.initialize())

app.use('/student',studentRoute)
app.use('/teacher',teacherRoute)
app.use('/admin',adminRoute)
app.use('/analysis',analysisRoute)


// routing and API Call
app.get('/', (req, res) => {
    res.status(200).sendFile('index.html')
})

// get role
app.post('/getRoleValue',(req,res)=>{
    var role =req.body.data.myrole
    require('./middleware/passport')(passport,role)
     userAuth = passport.authenticate('jwt', { session: false })
     res.send('done')
})

// add passportjs middleware for authenication
app.get('/student-dashboard', userAuth, function (req, res) {
    return res.status(200).json({ 'email': req.query.email })
})

// get student data (used in student and teacher controller)
app.post('/seeStudentData', (req, res) => {
    studentData.findOne({ email: req.body.data.email }).then(function (data) {
        return res.status(200).json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// auth for teacher dashboard
app.get('/teacher-dashboard', userAuth, function (req, res) {
    return res.status(200).json({ 'email': req.query.email })
})

// admin dashboard
app.get('/auth-dashboard', userAuth,(req, res) => {
    return res.status(200).send('auth_dashboard.html')
})

// listen to a port
app.listen(port, () => {
    console.log("server is running: " + port)
})