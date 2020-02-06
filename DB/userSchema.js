const { Schema, model } = require('mongoose');

// const userSchema = new Schema({
//     id_token: { type: String, required: true, unique: true },               // per user from google sign in
//     //authorization: { type: String, required: true ,default:"client"}        // admin or client
// });

const userSchema = new Schema({
    id_token: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    google_id: { type: Number, required: true },
    email: {type: String, required :true },
}, { collection: "users" });


// read user by id_token that send in the body request and create by google sign in
userSchema.statics.findUser = function (id_token) {
    return this.find({ id_token: id_token }, function (err) {
        if (err) {
            throw err;
        }
    });
}

// create client user by sending id_token , authorization set to client by default
userSchema.statics.createNewClientUser = async function (body) {
    let userObj = new this({
        id_token: body.id_token,
        name: body.google_name,
        google_id:body.google_id,
        email: body.google_email,
    });
    return await userObj.save();
}


const userModel = model('users', userSchema);

module.exports = userModel;
