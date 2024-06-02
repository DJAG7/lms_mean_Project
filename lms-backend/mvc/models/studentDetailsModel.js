const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const studentDetailsSchema = mongoose.Schema({
  username: {
    type: String,
    default: "",
  },
  name: {
    value: {
      type: String,
      default: "",
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  email: {
    value: {
      type: String,
      default: "",
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  profileVisibility: {
    type: Boolean,
    default: false,
  },
  description: {
    value: {
      type: String,
      default: "",
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  organization: {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
      default: null,
    },
    value: {
      type: String,
      default: "",
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  phone: {
    value: {
      type: String,
      default: "",
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  websiteURL: {
    value: {
      type: String,
      default: "",
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  codeforces: {
    value: {
      type: String,
      default: "",
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  leetcode: {
    value: {
      type: String,
      default: "",
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  education: {
    value: {
      type: String,
      default: "",
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  profilePicture: {
    type: String,
    default: "",
  },
  gitHub: {
    githubUsername: {
      type: String,
      default: "",
    },
    givenAccess: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      type: String,
      default: "",
    },
  },
});

let studentDetailsModel = mongoose.model(
  "studentDetails",
  studentDetailsSchema
);
module.exports = studentDetailsModel;
