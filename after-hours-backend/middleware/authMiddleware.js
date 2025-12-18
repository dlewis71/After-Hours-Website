import jwt from "jsonwebtoken";
// Using Default Import to match your 'userModel.js' export structure
import User from "../model/userModel.js"; 

export const protect = async (req, res, next) => {
    // Check if the Authorization header exists and has the 'Bearer <token>' format
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        // 1. Verify the token signature and expiry
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. Look up the user by ID and exclude the password field
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) return res.status(401).json({ message: "User not found" });

        // 3. Attach the user object to the request for downstream use
        req.user = user; 
        next();
    } catch (error) {
        // Handle expired, malformed, or invalid tokens
        res.status(401).json({ message: "Invalid token" });
    }
};
// FIX: Using the single, clean named export style for ES6 consistency.
// All router files must import this using: import { protect } from "..."
// This finalizes stability across your ES6 backend.
