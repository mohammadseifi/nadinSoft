const mongoose = require('mongoose');
const { schema } = require('./secure/userValidation');


const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        minlength:5,
        maxlength:20,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 30,
        trim: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 15,
        trim: true,
        unique: true
    },
    tasks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:"tasks"
    },  
    role: {
        type: String,
        default: "User"
    },
    thumbnail:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

    
})

userSchema.statics.userValidation = function(body){
    return schema.validate(body,{abortEarly: false})
}

const User = mongoose.model("User",userSchema)

module.exports = User