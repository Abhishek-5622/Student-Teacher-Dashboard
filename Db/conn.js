// **********************Mongoose connection ***************************

// require mongoose
const mongoose = require("mongoose");

// connection
mongoose.connect('mongodb://localhost:27017/schoolDb', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connection successfully");
}).catch((err) => {
    console.log("Error: " + err);
})