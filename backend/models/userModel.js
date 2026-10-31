const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true,
        validate: [validator.isEmail, 'Enter a valid email'] },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: {
        public_id: { type: String, required: true },
        url: { type: String, required: true }
    },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
};

userSchema.methods.getResetPasswordToken = function () {
    const token = crypto.randomBytes(24).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return token;
};

module.exports = mongoose.model('User', userSchema);
