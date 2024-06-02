const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const organizationSchema = mongoose.Schema({
      organizationName: {
        type: String,
      },  
      password: {
        type: String,
      },  
});

let organizationeModel = mongoose.model("organizations", organizationSchema);
module.exports = organizationeModel;
