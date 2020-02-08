const model = require('../DB/userSchema');

// check if user exists in our system by google id_token, if yes send in the data the authorization of the user
async function checkUser(req, res) {
    try {
        const data = await model.findUser(req.body.google_id);
        if (data.length == 0) {
            res.status(200).json({
                status: 200,
                message: "No user was found for this id_token",
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

async function createClientUser(req, res) {
    try {
        //console.log(req.body);
        const data = await model.createNewClientUser(req);
    } catch (err) {
        console.log(err);
        
    }
}

module.exports = {
    checkUser,
    createClientUser
};