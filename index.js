const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const User = require("./ models/User")
const app = express();
const  port = 5001;

app.use(express.json());

//connect to mongodb
mongoose.connect ("mongodb://127.0.0.1:27017/fuzri")

// {useNewUrlParser: true,
// useUnifiedTopology: true,}

.then((x)=>{
    console.log('Mongodb connected');
})
.catch((err)=>{
    console.log("Error while connencting to Mongo");
});

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {

        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            
        }
    });
}));

app.get("/", (req, res) => {
    res.send("Hello World!")
});
app.use("/auth", authRoutes);
app.use("/song", songRoutes);

app.listen(port, ()=>{
    console.log("Server is running on port" + port);
});