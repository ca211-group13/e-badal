import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  localPhoneNumber: {
    type: String,
    required: true,
  },
  usdtAddress: {
    type: String,
    required: true,
  },
  chainType: {
    type: String,
    enum: ["BEP-20", "TRC-20"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Failed", "Success"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

transactionSchema.plugin(mongoosePaginate);


const Transaction = mongoose.model('Transaction', transactionSchema);
export default  Transaction;
