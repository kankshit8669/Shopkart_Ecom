const crypto = require('crypto');
const cloudinary = require('cloudinary');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/requestError');
const wrapAsyncRoute = require('../middlewares/asyncWrapper');
const issueLoginCookie = require('../utils/loginCookie');
const sendEmail = require('../utils/emailDelivery');

async function getUser(id, withPassword = false) {
    let query = User.findById(id);
    if (withPassword) query = query.select('+password');
    const user = await query;
    if (!user) throw new ErrorHandler('We could not find that account.', 404);
    return user;
}

async function uploadAvatar(image) {
    const uploaded = await cloudinary.v2.uploader.upload(image, {
        folder: 'avatars', width: 150, crop: 'scale'
    });
    return { public_id: uploaded.public_id, url: uploaded.secure_url };
}

function profileFields(body) {
    return { name: body.name, email: body.email };
}

exports.handleRegisterUser = wrapAsyncRoute(async (req, res) => {
    const { name, email, password, avatar } = req.body;
    const savedAvatar = await uploadAvatar(avatar);
    const user = await User.create({ name, email, password, avatar: savedAvatar });
    issueLoginCookie(user, 200, res);
});

exports.handleLoginUser = wrapAsyncRoute(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ErrorHandler('Enter your email address and password.', 400);
    const user = await User.findOne({ email }).select('+password');
    const valid = user && await user.comparePassword(password);
    if (!valid) throw new ErrorHandler('The email or password you entered is incorrect.', 401);
    issueLoginCookie(user, 200, res);
});

exports.handleForgotPassword = wrapAsyncRoute(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new ErrorHandler('No account is registered with that email address.', 404);

    const token = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${token}`;
    const message = `Use this link to reset your ShopKart password:\n\n${resetUrl}\n\nIf you did not ask for a password reset, ignore this message.`;

    try {
        await sendEmail({ email: user.email, subject: 'ShopKart Password Recovery', message });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ErrorHandler(error.message, 500);
    }
    res.json({ success: true, message: `Password reset instructions have been sent to ${user.email}.` });
});

exports.handleResetPassword = wrapAsyncRoute(async (req, res) => {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) throw new ErrorHandler('This reset link is invalid or has expired. Request a new one.', 400);
    if (req.body.password !== req.body.confirmPassword) {
        throw new ErrorHandler('The passwords do not match.', 400);
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    issueLoginCookie(user, 200, res);
});

exports.handleGetUserProfile = wrapAsyncRoute(async (req, res) => {
    const user = await getUser(req.user.id);
    res.json({ success: true, user });
});

exports.handleUpdatePassword = wrapAsyncRoute(async (req, res) => {
    const user = await getUser(req.user.id, true);
    if (!await user.comparePassword(req.body.oldPassword)) {
        throw new ErrorHandler('Your current password is incorrect.', 400);
    }
    user.password = req.body.password;
    await user.save();
    issueLoginCookie(user, 200, res);
});

exports.handleUpdateProfile = wrapAsyncRoute(async (req, res) => {
    const changes = profileFields(req.body);
    if (req.body.avatar) {
        const currentUser = await getUser(req.user.id);
        const savedAvatar = await uploadAvatar(req.body.avatar);
        if (currentUser.avatar && currentUser.avatar.public_id) {
            await cloudinary.v2.uploader.destroy(currentUser.avatar.public_id);
        }
        changes.avatar = savedAvatar;
    }
    await User.findByIdAndUpdate(req.user.id, changes, {
        new: true, runValidators: true, useFindAndModify: false
    });
    res.json({ success: true });
});

exports.handleLogout = wrapAsyncRoute(async (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true });
    res.json({ success: true, message: 'You have signed out successfully.' });
});

exports.handleAllUsers = wrapAsyncRoute(async (req, res) => {
    const users = await User.find();
    res.json({ success: true, users });
});

exports.handleGetUserDetails = wrapAsyncRoute(async (req, res) => {
    const user = await getUser(req.params.id);
    res.json({ success: true, user });
});

exports.handleUpdateUser = wrapAsyncRoute(async (req, res) => {
    const existing = await getUser(req.params.id);
    const changes = { ...profileFields(req.body), role: req.body.role };
    await User.findByIdAndUpdate(existing.id, changes, {
        new: true, runValidators: true, useFindAndModify: false
    });
    res.json({ success: true });
});

exports.handleDeleteUser = wrapAsyncRoute(async (req, res) => {
    const user = await getUser(req.params.id);
    if (user.avatar && user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }
    await user.remove();
    res.json({ success: true });
});
