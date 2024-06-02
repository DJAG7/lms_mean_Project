const { default: axios } = require("axios");
const { razorPayUrls } = require("../../../constants");
const courseModel = require("../../models/courseModel");
const orderModel = require("../../models/orderModel");
const studentModel = require("../../models/studentModel");
const enrolledStudentModel = require("../../models/enrolledStudentModel");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const enrollStudentCourse = async (data) => {
  console.log(data);
  var courses = await courseModel.find({ _id: data.itemId }).populate({
    path: "modules",
  });
  // console.log(courses,req.body);
  courses = courses[0];

  let modules = courses.modules;
  // console.log("modules",modules);
  let modulesTracker = [];
  for (let i = 0; i < modules.length; i++) {
    let content = modules[i].content;
    // console.log("Content",content);
    let contentTracker = [];
    for (let j = 0; j < content.length; j++) {
      let contentInfo = {
        type: content[j].type,
        contentId: content[j].id,
        isCompleted: false,
      };
      contentTracker.push(contentInfo);
    }
    let moduleInfo = {
      moduleId: modules[i]._id,
      contentCompleted: 0,
      content: contentTracker,
    };
    modulesTracker.push(moduleInfo);
  }
  let student = await studentModel.find({ email: data.email });
  if (student.length > 0) {
    student = student[0];
    var enrolledStudentcheck = await enrolledStudentModel.find({
      courseId: courses._id,
      studentId: student._id,
    });
    // console.log(enrolledStudentcheck);
    if (enrolledStudentcheck.length > 0) {
      return "Student Already Enrolled";
    }
    let enrollCourse = new enrolledStudentModel({
      courseId: courses._id,
      studentId: student._id,
      modulesCompleted: 0,
      modules: modulesTracker,
    });
    enrollCourse = await enrollCourse.save();
    return "Enrolled Successfully";
  }
};
const verifyOrder = async (req, res) => {
  try {
    console.log(req.body);
    let order = await orderModel.find({
      orderId: req.body.razorpay_order_id,
    });
    if (order.length) {
      order = order[0];
      const dataToHash = order.orderId + "|" + req.body.razorpay_payment_id;
      const hmac = crypto.createHmac("sha256", process.env.RAZOR_SECRET);
      hmac.update(dataToHash, "utf8");
      const hashResult = hmac.digest("hex");
      if (hashResult == req.body.razorpay_signature) {
        order.transactionComplete = true;
        order.orderDetails.amount_paid = order.orderDetails.amount;
        order.signature = req.body.razorpay_signature;
        order.paymentId = req.body.razorpay_payment_id;
        await order.save();
        if (order.itemType == "course") {
          let status = await enrollStudentCourse(order.orderDetails.notes);
          res.status(200).send({ Message: status, code: 1 });
          return;
        } else {
          res.status(200).send({ Message: "Invalid Type", code: 2 });
          return;
        }
      } else {
        res.status(500).send({ Message: "Payment Failed", code: 2 });
        return;
      }
    } else {
      res.status(500).send({ message: "Order Not Found" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { verifyOrder };
