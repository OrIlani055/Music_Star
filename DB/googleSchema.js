const { Schema, model } = require('mongoose');

// const googleSchema = new Schema({
//     id_token: { type: String, required: true, unique: true },               // per user from google sign in
//     //authorization: { type: String, required: true ,default:"client"}        // admin or client
// });

const googleSchema = new Schema({
    access_token: { type: String, required: true, unique: true },
    refresh_token: { type: String, required: true },
    scope:{ type: String, required: true },
    token_type: { type: String, required: true },
    expiry_date: {type: Number, required: true}

}, { collection: "googles" });


// read user by id_token that send in the body request and create by google sign in
googleSchema.statics.findUser = function (access_token) {
    return this.find({ access_token: access_token }, function (err) {
        if (err) {
            throw err;
        }
    });
}



// create client user by sending id_token , authorization set to client by default
googleSchema.statics.createNewClientUser = async function (body) {
    let userObj = new this({
        access_token: body.access_token,
        refresh_token: body.refresh_token,
        scope: body.scope,
        token_type: body.token_type,
        expiry_date: body.expiry_date,
    });
    return await userObj.save();
}


const googleModel = model('googles', googleSchema);

module.exports = googleModel;
