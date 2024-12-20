const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Task = require("./task")


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password not allowed. Try again");
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

UserSchema.virtual("tasks", {
    ref: "Task",
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject 
}

UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    const pass = "nodejscourse"
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}

// Returns user if user exists sand credentials are correct
UserSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error("Unable to login, User doesn't exists")
    }
    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw new Error("Username & password don't match")
    }
    return user
}

UserSchema.pre('save', async function (next) {
    const user = this

    // on create and update this is true
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


UserSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({owner: user._id}) 

    next()
})



const User = mongoose.model("User", UserSchema);



module.exports = User;