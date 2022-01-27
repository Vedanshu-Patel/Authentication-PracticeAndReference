let mongoose = require('mongoose');
let plm = require('passport-local-mongoose');



let userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(plm);

let User = mongoose.model('User',userSchema);
module.exports = User;