const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const SALT_ROUNDS = 10;

const signToken = (user) =>
    jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

const register = asyncHandler(async (req, res) => {
    const { full_name, email, phone, password } = req.body;

    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
        throw ApiError.conflict("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const id = await User.createUser({ full_name, email, phone, password: hashedPassword });

    ApiResponse.send(res, {
        statusCode: 201,
        message: "Registration successful",
        data: { userId: id },
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findUserByEmail(email);
    if (!user) {
        throw ApiError.unauthorized("Invalid email or password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw ApiError.unauthorized("Invalid email or password");
    }

    const token = signToken(user);

    ApiResponse.send(res, {
        message: "Login successful",
        data: {
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
            },
        },
    });
});

const profile = asyncHandler(async (req, res) => {
    const user = await User.findUserById(req.user.id);

    if (!user) {
        throw ApiError.notFound("User not found");
    }

    ApiResponse.send(res, { message: "Profile fetched successfully", data: user });
});

const updateProfile = asyncHandler(async (req, res) => {
    const { full_name, phone } = req.body;

    await User.updateUser(req.user.id, full_name, phone);
    const updatedUser = await User.findUserById(req.user.id);

    ApiResponse.send(res, { message: "Profile updated successfully", data: updatedUser });
});

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findUserByEmail((await User.findUserById(req.user.id)).email);
    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
        throw ApiError.badRequest("Current password is incorrect");
    }

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await User.updatePassword(req.user.id, hashed);

    ApiResponse.send(res, { message: "Password changed successfully" });
});

const logout = asyncHandler(async (req, res) => {
    // Stateless JWT: logout is handled client-side by discarding the token.
    ApiResponse.send(res, { message: "Logout successful" });
});

module.exports = { register, login, profile, updateProfile, changePassword, logout };
