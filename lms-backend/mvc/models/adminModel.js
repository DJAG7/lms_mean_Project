const mongoose = require("./conn").mongoose;
const adminSchema = {
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
};
let adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;
