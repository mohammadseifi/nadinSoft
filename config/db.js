const mongoose = require('mongoose');

module.exports = async ()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/nadin_db")
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
}