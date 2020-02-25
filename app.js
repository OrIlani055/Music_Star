const express = require('express')
const app = express()
const port = process.env.PORT || 5000;


const userApi = require('./routes/userRoute');
const googleApi = require('./routes/googleRoute');
const youtubeApi = require('./routes/youtubeRoute');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(
 (req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers',
     'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE')
   res.set('Content-Type', 'application/json');
   next();
 });

// routes for all api services

app.use('/user', userApi);
app.use('/login', googleApi);
app.use('/youtube', youtubeApi);

app.listen(port, () => {
  console.log("running on port: " + port);
});


module.exports = app;