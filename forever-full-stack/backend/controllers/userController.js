import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { createHash, randomBytes } from 'crypto'
import userModel from "../models/userModel.js";
import { sendTransactionalEmail } from "../services/senderService.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for fetching the signed-in user's profile
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId).select('name email')

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const requestPasswordReset = async (req, res) => {
    const genericMessage = "If an account exists for that email, a password reset link will be sent.";
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

    if (!process.env.SENDER_API_TOKEN || !process.env.SENDER_FROM_EMAIL || !process.env.FRONTEND_URL) {
        console.error("Password reset email configuration is incomplete");
        return res.status(503).json({ success: false, message: "Password reset is temporarily unavailable." });
    }

    if (!validator.isEmail(email)) {
        return res.json({ success: true, message: genericMessage });
    }

    try {
        const user = await userModel.findOne({ email }).select('+passwordResetRequestedAt');
        if (!user) {
            return res.json({ success: true, message: genericMessage });
        }

        const now = new Date();
        if (user.passwordResetRequestedAt && now - user.passwordResetRequestedAt < 60_000) {
            return res.json({ success: true, message: genericMessage });
        }

        const resetToken = randomBytes(32).toString('hex');
        const tokenHash = createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetToken = tokenHash;
        user.passwordResetExpires = new Date(now.getTime() + 30 * 60_000);
        user.passwordResetRequestedAt = now;
        await user.save();

        const resetUrl = new URL('/reset-password', process.env.FRONTEND_URL);
        resetUrl.searchParams.set('token', resetToken);
        const url = resetUrl.toString();

        try {
            await sendTransactionalEmail({
                to: user.email,
                subject: 'Reset your Clothes For You password',
                text: `Use this link to reset your password. It expires in 30 minutes: ${url}`,
                html: `<p>We received a request to reset your password.</p><p><a href="${url}">Reset your password</a></p><p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>`
            });
        } catch (error) {
            console.error("Sender password reset email failed", { status: error.status, message: error.message });
            await userModel.updateOne(
                { _id: user._id, passwordResetToken: tokenHash },
                { $unset: { passwordResetToken: 1, passwordResetExpires: 1 } }
            );
        }

        return res.json({ success: true, message: genericMessage });
    } catch (error) {
        console.error("Password reset request failed", { message: error.message });
        return res.json({ success: true, message: genericMessage });
    }
}

const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    if (typeof token !== 'string' || token.length !== 64 || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ success: false, message: "The reset link is invalid or expired." });
    }

    try {
        const tokenHash = createHash('sha256').update(token).digest('hex');
        const user = await userModel.findOne({
            passwordResetToken: tokenHash,
            passwordResetExpires: { $gt: new Date() }
        }).select('+passwordResetToken +passwordResetExpires');

        if (!user) {
            return res.status(400).json({ success: false, message: "The reset link is invalid or expired." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updateResult = await userModel.updateOne(
            {
                _id: user._id,
                passwordResetToken: tokenHash,
                passwordResetExpires: { $gt: new Date() }
            },
            {
                $set: { password: hashedPassword },
                $unset: {
                    passwordResetToken: 1,
                    passwordResetExpires: 1,
                    passwordResetRequestedAt: 1
                }
            }
        );

        if (updateResult.matchedCount !== 1) {
            return res.status(400).json({ success: false, message: "The reset link is invalid or expired." });
        }

        return res.json({ success: true, message: "Password updated. You can now sign in." });
    } catch (error) {
        console.error("Password reset failed", { message: error.message });
        return res.status(500).json({ success: false, message: "Unable to reset the password right now." });
    }
}

export { loginUser, registerUser, adminLogin, getUserProfile, requestPasswordReset, resetPassword }