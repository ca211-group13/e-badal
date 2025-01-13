import User from "../models/user.js";


export const addAccount = async (req, res) => {
    try {
      const { userId } = req.user;
      if (!userId) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
      }
      
      const { type, phoneNumber, usdtAddress } = req.body;
  
      if (!type || (!phoneNumber && !usdtAddress)) {
        return res.status(400).json({ success: false, message: "Invalid request data" });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Check for existing account of the same type
      const existingAccountIndex = user.accounts.findIndex(account => account.type === type);
  
      // Prepare account data dynamically based on account type
      const accountData = { type };
      if (type.startsWith('USDT')) {
        accountData.usdtAddress = usdtAddress;
      } else {
        accountData.phoneNumber = phoneNumber;
      }
  
      if (existingAccountIndex !== -1) {
        // Update existing account
        user.accounts[existingAccountIndex] = accountData;
        await user.save();
        return res.json({ success: true, message: "Account updated successfully", user });
      } else {
        // Add new account
        user.accounts.push(accountData);
        await user.save();
        return res.json({ success: true, message: "Account added successfully", user });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  