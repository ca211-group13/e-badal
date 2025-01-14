import mongoose, { model } from "mongoose";

const feeSchema = new mongoose.Schema({
    depositFee: {
        type: Number,
        default: 2
    },
    withdrawalFee: {
        type: Number,
        default: 2
    }
});

const Fee = model("Fee", feeSchema);

export const initializeFee = async () => {
    try {
        const existingFee = await Fee.findOne();
        if (!existingFee) {
            await Fee.create({}); // Create a document with default values
            console.log("Default Fee document created successfully.");
        } else {
            console.log("Fee document already exists.");
        }
    } catch (error) {
        console.error("Error initializing Fee document:", error.message);
    }
};

export default Fee;