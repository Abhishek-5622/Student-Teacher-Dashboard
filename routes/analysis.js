const express = require('express')
const router = express.Router();
const studentData = require('../Model/studentData')
const schoolData = require('../Model/schoolRegister')
const CityRegister = require('../Model/city')
const AreaRegister = require('../Model/area')

// get school name
router.get('/schoolName', (req, res) => {
    schoolData.find().then(function (data) {
        res.status(200).json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// fetch all students that are of that school
router.post('/indiviualSchoolStudent', (req, res) => {
    var schoolName = req.body.data.school;
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
        res.status(200).json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// top 3 student of db
router.get('/topStudent', (req, res) => {
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
        res.status(200).json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// fetch top 3 students of that region 
router.post('/topRegionStudent', (req, res) => {
    var regionName = req.body.data.region;
        var schoolAreaPip = [
            {
                $match: {
                    sRegion: regionName
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
            return res.status(200).json(data)
        }).catch(function (err) {
            console.log(err)
        })
  
})

// fetch top 3 students of that area 
router.post('/topAreaStudent', (req, res) => {
    var areaName = req.body.data.area;
        var schoolAreaPip = [
            {
                $match: {
                    sArea: areaName
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
   

})

// fetch top 3 students of that city 
router.post('/city', (req, res) => {
    var cityName = req.body.data.city;
        var schoolAreaPip = [
            {
                $match: {
                    sCity:cityName
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
            res.status(200).json(data)
        }).catch(function (err) {
            console.log(err)
        })
   
})

// fetch all students on the basic of percentage 
router.post('/criteria', (req, res) => {
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
        return res.json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// fetch area of school
router.post('/fetchallAreaSchool', (req, res) => {
    var areaName = req.body.area;
    schoolData.aggregate(
        [
            { $match: { area: areaName } }
        ]
    ).then(function (data) {
        res.status(200).json(data)
    }).catch(function (err) {
        console.log(err)
    })
})

// get all region list
router.post('/getRegionList', (req, res) => {
    CityRegister.find().then(
        function (data) {
            return res.status(200).json(data)
        }).catch(function (err) {
            console.log(err)
        })

})

// get all area list
router.post('/getareaList', (req, res) => {
    AreaRegister.find({ city: req.body.data.city }).then(
        function (data) {
            return res.status(200).json(data)
        }).catch(function (err) {
            console.log(err)
        })
})

// get all city list
router.post('/getcityList', (req, res) => {
    CityRegister.find({ region: req.body.data.region }).then(
        function (data) {
            return res.status(200).json(data)
        }).catch(function (err) {
            console.log(err)
        })
})

module.exports = router;