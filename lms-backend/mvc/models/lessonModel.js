const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const lessonSchema = mongoose.Schema({
        name: {
          type: String,
          // required: true,
        },
        description: {
          type: String,
          // required: true,
        },
        content: {
          contentType: {
            type: String,
            enum: ["video", "text"],
            // required: true,
          },
          contentData: {
            type: String,
            // required: true,
          },
        },
        length: {
          hour: {
            type: Number,
            default: 0,
          },
          minutes: {
            type: Number,
            default: 0,
          },
        },
});

let lessonModel = mongoose.model("lessons", lessonSchema);
module.exports = lessonModel;
