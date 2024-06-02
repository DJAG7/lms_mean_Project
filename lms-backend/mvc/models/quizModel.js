const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const quizSchema = mongoose.Schema({
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      length:{
        hour:{
        type: Number,
        },
        minutes:{
          type: Number,
        }
      },
      questions: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"questions",
        }
      ],
    
});

let quizModel = mongoose.model("quiz", quizSchema);
module.exports = quizModel;
