 const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, default: null },
    google_id: { type: Number, unique: true,default: null},
    email: {type: String,default: null},
    jobtitle: {type: String,default: null},
    music_pref: [String],
    google:{
        access_token: { type: String, required: true, unique: true },
        id_token: { type: String, required: true },
        scope:{ type: String, required: true },
        token_type: { type: String, required: true },
        expiry_date: {type: Number, required: true}
    },
}, { collection: "users" });


userSchema.statics.findUserByAcceessToken = function (access_token) {
    return this.find({ access_token: access_token }, function (err) {
        if (err) {
            throw err;
        }
    });
}

userSchema.statics.findOneAndDelete = function (email) {
    return this.find({ email: email }, function (err) {
        if (err) {
            throw err;
        }
    });
}

userSchema.statics.findUserByEmail = function (email) {
    return this.find({ email: email }, function (err) {
        if (err) {
            throw err;
        }
    });
}

userSchema.statics.CreateGoogleUserDetails = async function (body) {
    console.log(body.data);
    let userObj = new this({
        google_id:body.data.id,
        email: body.data.email,
        name: body.data.name,
    });
   return await userObj.udpate({});
}

userSchema.statics.createGoogleUser = async function (body) {
    let userObj = new this({
        google:{
            access_token: body.access_token,
            id_token: body.id_token,
            scope: body.scope,
            token_type: body.token_type,
            expiry_date: body.expiry_date,
        }
    });
    return await userObj.save();
}

const userModel = model('users', userSchema);

module.exports = userModel;
