const mongoose = require("./conn").mongoose;
const healthCheckSchema = mongoose.Schema({
    status:{
        type:String
    }
});

let healthCheckModel= mongoose.model("healthCheck",healthCheckSchema);
module.exports = healthCheckModel;