import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const accountSchema = new Schema({
    type: {
        type: String,
        enum: ['EVC', 'Sahal', 'Zaad', 'USDT(TRC-20)','USDT(BEP-20)'],
        required: true
    },
    phoneNumber: {
        type: String,
        sparse: true,  // This will allow multiple null values
        required: function() { return !this.type.startsWith('USDT'); }
    },
    usdtAddress: {
        type: String,
        required: function() { return this.type.startsWith('USDT') ; }
    }
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'owner'],
        default: 'user'
    },
    accounts: [accountSchema],
  
    transactionHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    //i am using this for poups in order to give one transaction changes statusly to show her
    lastTransactionStatus: {
        type: String,  // Possible values: 'success', 'failed', 'pending'
        default: null  // Initially null
      }
}, {
    timestamps: true
});
// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = model('User', userSchema);
export default User;

