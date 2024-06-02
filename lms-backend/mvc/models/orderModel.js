const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const orderSchema = mongoose.Schema(
  {
    email: {
      type: String,
    },
    itemType: {
      type: String,
    },
    itemId: {
      type: String,
    },
    userId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    amount: {
      type: String,
    },
    transactionComplete: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
    },
    orderDetails: {
      type: Object,
    },
    signature: {
      type: String,
      default: "",
    },
    paymentId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

let orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
