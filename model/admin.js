const mongoose = require('mongoose');
const { schema } = require('./secure/adminValidation');

const adminSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 20,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    role: {
        type: String,
        default: "Admin"
    }
})
adminSchema.statics.adminvalidation = function(body){
    return schema.validate(body,{abortEarly: false})
}
const Admin = mongoose.model("admin",adminSchema)
module.exports = Admin