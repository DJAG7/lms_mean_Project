const { default: axios } = require("axios");
const { razorPayUrls } = require("../../../constants");
const courseModel = require("../../models/courseModel");
const orderModel = require("../../models/orderModel");
const enrolledStudentModel = require("../../models/enrolledStudentModel");
const studentModel = require("../../models/studentModel");
const dotenv = require("dotenv");
dotenv.config();
const createOrder = async (req, res) => {
  try {
    let itemObj;
    if (req.body.itemType == "course") {
      let student = await studentModel.find({ email: req.body.email });
      if (student.length > 0) {
        student = student[0];
        var enrolledStudentcheck = await enrolledStudentModel.find({
          courseId: req.body.itemId,
          studentId: student._id,
        });
        // console.log(enrolledStudentcheck);
        if (enrolledStudentcheck.length > 0) {
          res
            .status(200)
            .send({ Message: "Student already Enrolled", code: 2 });
          return;
        }
      }
      let course = await courseModel.find({ _id: req.body.itemId });
      if (course.length > 0) {
        itemObj = course[0];
      } else {
        res.status(500).send({ message: "Course not found", code: 2 });
        return;
      }
    } else {
      res.status(500).send({ message: "Unsupported item", code: 2 });
      return;
    }

    let order = await orderModel.find({
      email: req.body.email,
      itemId: req.body.itemId,
    });
    if (order.length) {
      order = order[0];
      if (order.transactionComplete) {
        res.status(200).send({ message: "Already Enrolled", code: 2 });
        return;
      }
      res.status(200).send({ details: order.orderDetails, code: 1 });
      return;
    } else {
      let student = await studentModel.find({ email: req.body.email });
      if (student.length) student = student[0];
      else {
        res.status(500).send({ message: "Student Not Found", code: 2 });
        return;
      }
      let orderData = {
        amount: itemObj.price * 100,
        currency: "INR",
        receipt: "Receipt no. 1",
        notes: {
          email: req.body.email,
          itemId: req.body.itemId,
          itemType: req.body.itemType,
        },
      };
      const username = process.env.RAZOR_KEY;
      const password = process.env.RAZOR_SECRET;
      const credentials = btoa(`${username}:${password}`);
      let orderDetails = await axios.post(
        razorPayUrls.createOrder_Post,
        orderData,
        {
          headers: { Authorization: `Basic ${credentials}` },
        }
      );
      let newOrder = new orderModel({
        email: req.body.email,
        itemType: req.body.itemType,
        itemId: req.body.itemId,
        userId: student._id,
        orderId: orderDetails.data.id,
        amount: orderDetails.data.amount_due,
        transactionCompleate: false,
        currency: "INR",
        orderDetails: orderDetails.data,
      });
      await newOrder.save();
      res.status(200).send({ details: orderDetails.data, code: 1 });
      return;
    }

    // console.log(orderDetails.data);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong", code: 2 });
  }
};
module.exports = { createOrder };
