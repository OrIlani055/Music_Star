// const { Schema, model } = require('mongoose');

// // const userSchema = new Schema({
// //     id_token: { type: String, required: true, unique: true },               // per user from google sign in
// //     //authorization: { type: String, required: true ,default:"client"}        // admin or client
// // });

// const userSchema = new Schema({
//     name: { type: String,  },
//     google_id: { type: Number, unique: true },
//     email: {type: String },
//     google:{
//         access_token: { type: String, required: true, unique: true },
//         refresh_token: { type: String, required: true },
//         scope:{ type: String, required: true },
//         token_type: { type: String, required: true },
//         expiry_date: {type: Number, required: true}
//     }
// }, { collection: "users" });


// // read user by id_token that send in the body request and create by google sign in
// userSchema.statics.findUser = function (google_id) {
//     return this.find({ google_id: google_id }, function (err) {
//         if (err) {
//             throw err;
//         }
//     });
// }

// // create client user by sending id_token , authorization set to client by default
// userSchema.statics.CreateGoogleUserDetails = async function (body) {
//     console.log(body.data);
//     let userObj = new this({
//         google_id:body.data.id,
//         email: body.data.email,
//         name: body.data.name,
//     });
//    return await userObj.save();
// }
// userSchema.statics.saveTKtoUser = async function (body) {
//     console.log(body);
//     let userObj = new this({
//         access_token: body.access_token
//     });
//    return await userObj.save();
// }

// const userModel = model('users', userSchema);

// module.exports = userModel;
