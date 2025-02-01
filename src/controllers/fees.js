import Fee from "../models/fee.js";

export const getFees = async (req, res,next) => {
    try {
        const fees = await Fee.findOne(); // Assuming a single fee document exists
        if (!fees) {
            return res.status(404).json({ message: "Fees not found" });
        }
        res.status(200).json(fees);
    } catch (error) {
        next(error);
    }
};

// Update deposit fee
export const updateDepositFee = async (req, res,next) => {
    try {
        const { depositFee } = req.body;
        if (depositFee === undefined) {
            return res.status(400).json({ message: "Deposit fee is required" });
        }

        const fees = await Fee.findOneAndUpdate(
            {}, // Update the first document
            { depositFee },
            { new: true, upsert: true } // Create if doesn't exist
        );

        res.status(200).json(fees);
    } catch (error) {
        next(error);
    }
};

// Update withdrawal fee
export const updateWithdrawalFee = async (req, res,next) => {
    try {
        const { withdrawalFee } = req.body;
        if (withdrawalFee === undefined) {
            return res.status(400).json({ message: "Withdrawal fee is required" });
        }

        const fees = await Fee.findOneAndUpdate(
            {}, // Update the first document
            { withdrawalFee },
            { new: true, upsert: true } // Create if doesn't exist
        );

        res.status(200).json(fees);
    } catch (error) {
        next(error);
    }
};
