const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    //Profile Fields

    bio: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    website: { type: String },
    location: { type: String }
},{timestamps: true})

userSchema.pre('save', async function (next) {
    console.log('🧠 Pre-save middleware is running...');
    const users = this;

    if (!users.isModified('password')) {
        return next()
    }
    try {
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(users.password, saltRounds)
        console.log('🔒 Hashed Password:', hashedPassword);
        users.password = hashedPassword;
        next()
    } catch (error) {
        console.log('❌ Error while hashing:', error);
        next(error)
    }
})


userSchema.methods.generateToken = async function () {
    const users = this;
    try {
        return jwt.sign({
            id: users._id.toString(),
            email: users.email,
            isAdmin: users.isAdmin
        }, process.env.JWT_SECRET, { expiresIn: '30d' })
    } catch (error) {
        console.log('❌ Error while generating token:', error);
    }

}


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);
module.exports = User;