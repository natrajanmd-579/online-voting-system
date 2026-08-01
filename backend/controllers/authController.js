const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const User=require("../models/userModel");
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,
                message: "Email and Password are required"

            });

        }

        const user = await User.loginUser(email);

        if (!user) {

            return res.status(401).json({

                success: false,
                message: "Invalid Email"

            });

        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {

            return res.status(401).json({

                success: false,
                message: "Invalid Password"

            });

        }

        const token = jwt.sign(

            {

                id: user.id,
                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1d"

            }

        );

        return res.json({

            success: true,
            message: "Login Successful",

            token,

            user: {

                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role

            }

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,
            message: err.message

        });

    }

};
const register=async(req,res)=>{

    try{

        const{
            full_name,
            email,
            phone,
            password
        }=req.body;

        const existingUser=await User.findUserByEmail(email);

        if(existingUser){

            return res.status(400).json({

                success:false,
                message:"Email already exists"

            });

        }

        const hashedPassword=await bcrypt.hash(password,10);

        const id=await User.createUser({

            full_name,
            email,
            phone,
            password:hashedPassword

        });

        res.status(201).json({

            success:true,
            message:"Registration Successful",
            userId:id

        });

    }

    catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }
};
const profile = async (req, res) => {

    try {

        const user = await User.findUserByEmail(req.user.email);

        res.json({

            success: true,

            user

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }
};
const updateProfile = async (req, res) => {

    try {

        const { full_name, phone } = req.body;

        await User.updateUser(
            req.user.id,
            full_name,
            phone
        );

        const updatedUser = await User.findUserById(req.user.id);

        return res.json({

            success: true,
            message: "Profile Updated Successfully",

            user: updatedUser

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findUserById(req.user.id);

        const existing = await User.findUserByEmail(user.email);

        const match = await bcrypt.compare(
            currentPassword,
            existing.password
        );

        if (!match) {

            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });

        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await User.updatePassword(
            req.user.id,
            hashed
        );

        res.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
const logout = async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Logout Successful"
    });

};
module.exports = {

    register,
    login,
    profile,
    updateProfile,
    changePassword,
    logout
};
