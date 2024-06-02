const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const sectionSchema = mongoose.Schema({
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      questions: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"questions",
        }
      ],
    
});

let testSectionModel = mongoose.model("testSection", sectionSchema);
module.exports = testSectionModel;
