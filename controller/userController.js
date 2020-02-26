const model = require('../DB/googleSchema');

// check if user exists in our system by google id_token, if yes send in the data the authorization of the user
async function checkUser(req, res) {
    try {
        const data = await model.findUser(req.body.google_id);
        if (data.length == 0) {
            res.status(200).json({
                status: 200,
                message: "No user was found for this google id",
                action: "Read",
                data: null
            });
        } else {
            res.status(200).json({
                status: 200,
                message: "success",
                action: "Read",
                data: data[0].authorization
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            action: "Read",
            data: null
        })
    }
}

async function createUserInfo(req, res) {
    try {
        console.log(req.body);
        // let user = await model.find({ "email":req.body.data[0]},
        //     err => {if (err) throw err;}
        //     );
        // //let objID = console.log(user[0]);
        // let update = {
        //     music_pref: body.music_pref
        // };
        // console.log(update);
        // model.updateOne(objID, update,
        // err => { if (err) throw err;}
        // );
        //const obj = await model.CreateUserDetails(req.body.data);
    } catch (err) {
        console.log(err);
        
    }
}


module.exports = {
    checkUser,
    createUserInfo,
};