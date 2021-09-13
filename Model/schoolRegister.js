// For school

// require
const mongoose = require('mongoose');
const validator = require('validator');
// create schema
// const SchoolSchema = new mongoose.Schema(
//     {
//         schoolname: {
//             type: String,
//             require: true
//         },
//         schoolemail: {
//             type: String,
//             require: true,
//             unique: true,
//             validate: {
//                 validator: validator.isEmail,
//                 message: '{VALUE} is not a valid email',
//                 isAsync: false
//             }
//         },
//         city: {
//             type: String,
//             require: true
//         }
//         ,
//         region: {
//             type: String,
//             require: true
//         },
//         area: {
//             type: String,
//             require: true
//         },

//     }
// )

const cityRegionSchema = new mongoose.Schema({
    cityname: {
        type: String,
        require: true
    },
    region: [mongoose.Schema.Types.ObjectId]
});

const regionAreaSchema = new mongoose.Schema({
    regionname: {
        type: String,
        require: true
    },
    area: [mongoose.Schema.Types.ObjectId]
});

const areaSchoolSchema = new mongoose.Schema({
    area: String,
    schoolname: Array
});

const SchoolSchema = new mongoose.Schema(
    {




    }
)

// create collection(table)
// const SchoolRegister = new mongoose.model("SchoolRegister", SchoolSchema);
const cityRegister = new mongoose.model("cityRegister", cityRegionSchema);
const regionRegister = new mongoose.model("regionRegister", regionAreaSchema);
const areaRegister = new mongoose.model("areaRegister", areaSchoolSchema);
// export the object
// module.exports = SchoolRegister;
module.exports={cityRegister,regionRegister,areaRegister}