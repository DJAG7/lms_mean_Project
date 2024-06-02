const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const moduleSchema = mongoose.Schema({
      name: {
        type: String,
        // required: true,
      },
      description: {
        type: String,
        // required: true,
      },
      content:[
        {
          type:{
            type:String
          },
          id:{
            type:mongoose.Schema.Types.ObjectId,
          }
        }
      ]
    
});

let moduleModel = mongoose.model("modules", moduleSchema);
module.exports = moduleModel;
