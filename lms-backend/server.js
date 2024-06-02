const express = require("express");
const cluster = require("cluster");
const cors = require("cors");
const multer = require("multer");
var passport = require("passport");
var GitHubStrategy = require("passport-github2").Strategy;
var session = require("express-session");
const { ServerResponse } = require("http");
const dotenv = require("dotenv");
const healthCheckRoutes = require("./mvc/routes/healthCheckRoutes");
const studentRoutes = require("./mvc/routes/studentRoutes");
const instructorRoutes = require("./mvc/routes/instructorRoutes");
const courseRoutes = require("./mvc/routes/courseRoutes");
const adminRoutes = require("./mvc/routes/adminRoutes");
const testRoutes = require("./mvc/routes/testRoutes");
const liveClassRoutes = require("./mvc/routes/liveClassRoutes");
const organizationRoutes = require("./mvc/routes/organizationRoutes");
const profileRoutes = require("./mvc/routes/profileRoutes");
const updateDbRoutes = require("./mvc/routes/updateDbRoutes");
const studentDetailsModel = require("./mvc/models/studentDetailsModel");
const compilerRoutes = require("./mvc/routes/compilerRoutes");
const razorRoutes = require("./mvc/routes/razorRoutes");
const proxyRoutes = require("./mvc/routes/proxyRoutes");
const { uploadSingle } = require("./mvc/controllers/s3/uploadSingle");
const { default: axios } = require("axios");
const studentModel = require("./mvc/models/studentModel");
var numCPUs = require("os").cpus().length;
console.log(numCPUs);
numCPUs = 1;
if (numCPUs <= 1) {
  numCPUs = 1;
}
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // This event is first when worker died
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}

// For Worker
else {
  // Workers can share any TCP connection
  const app = express();
  dotenv.config();
  app.use(express.json({ limit: "5mb" }));
  app.use(cors());
  const upload = multer();

  app.get("/auth/github", async function (req, res) {
    const emptyResponse = new ServerResponse(req);
    // console.log(emptyResponse.getHeader("location"));
    res.send({ url: emptyResponse.getHeader("location") });
  });
  app.get("/auth/github/callback", function (req, res) {
    let email = req.query.state;
    let code = req.query.code;
    if (!req.query.error) {
      axios
        .post("https://github.com/login/oauth/access_token", {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        })
        .then(async (data) => {
          let studentDetails = await studentDetailsModel.find({
            "email.value": email,
          });
          if (studentDetails.length > 0) {
            studentDetails = studentDetails[0];
            let access_token = "";
            for (let i = 13; i < data.data.length; i++) {
              if (data.data[i] != "&")
                access_token = access_token + data.data[i];
              else break;
            }
            const config = {
              headers: { Authorization: `Bearer ${access_token}` },
            };
            axios
              .get("https://api.github.com/user", config)
              .then(async (userData) => {
                studentDetails.gitHub.givenAccess = true;
                studentDetails.gitHub.accessToken = access_token;
                studentDetails.gitHub.githubUsername = userData.data.login;
                await studentDetails.save();
                let student = await studentModel.find({ email: email });
                if (student.length > 0) {
                  student = student[0];
                  res.redirect(
                    process.env.DOMAIN + "/profile/student/" + student._id
                  );
                } else {
                  console.log("No student found");
                  res.redirect(
                    process.env.DOMAIN + "/profile/student/" + student._id
                  );
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.log("No studentDetails found");
            res.redirect(
              process.env.DOMAIN + "/profile/student/" + student._id
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.redirect(process.env.DOMAIN + "/profile/student/" + student._id);
    }
  });
  app.use("/compiler", compilerRoutes);
  app.post("/upload", upload.any(), uploadSingle);
  app.use("/health", healthCheckRoutes);
  app.use("/student", studentRoutes);
  app.use("/instructor", instructorRoutes);
  app.use("/course", courseRoutes);
  app.use("/admin", adminRoutes);
  app.use("/test", testRoutes);
  app.use("/organization", organizationRoutes);
  app.use("/profile", upload.any(), profileRoutes);
  app.use("/updateDb", updateDbRoutes);
  app.use("/live", liveClassRoutes);
  app.use("/payment", razorRoutes);
  app.use("/proxy", proxyRoutes);
  app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
  });
}
