const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 5,
        maxlength: 200,
        required: true,
        unique: true
    },
    name: {
        type: String,
        minlength: 5,
        maxlength: 200,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 200,
        required: true
    },
    userImage: {
        type: String,
        required: true,
        default: getRandomImage()
    },
    location: {
        type: String,
        minlength: 5,
        maxlength: 200
    },
    bio: {
        type: String,
        minlength: 5,
        maxlength: 200
    },
    website: {
        type: String,
        minlength: 5,
        maxlength: 200
    },
    date: {
        type: Date,
        default: Date.now
    },
    screams: {
        type: Array
    },
    notifications: {
        type: Array
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, name: this.name, userImage: this.userImage },
        config.get("jwtPrivateKey")
    );
    return token;
};
const User = mongoose.model("User", userSchema);

function validateSchema(user) {
    const schema = {
        email: Joi.string().trim().email().min(5).max(200).required(),
        password: Joi.string().trim().min(5).max(200).required(),
        confirmPassword: Joi.string().trim().min(5).max(200).required(),
        name: Joi.string().trim().min(5).max(200).required()
    };
    return Joi.validate(user, schema);
}

function getRandomImage() {
    const images = [
        "https://cdn.pixabay.com/photo/2020/02/11/14/36/cat-4839775_960_720.png",
        "https://thumbs.dreamstime.com/b/vecteur-mignon-de-chat-griffonnage-le-petit-laisse-l-automne-feuilles-mignonnes-petites-148121640.jpg",
        "https://st3.depositphotos.com/8015362/12750/v/950/depositphotos_127501798-stock-illustration-illustration-on-white-background-sitting.jpg",
        "https://cdn.pixabay.com/photo/2018/03/14/05/42/monkey-3224416_960_720.png",
        "https://pixnio.com/free-images/2018/06/09/2018-06-09-11-57-10.png",
        "https://cdn.greenice.com/44198/vagglampa-giraffe-batteri-0-6w-3xaaa-plastika-mlp-114.jpg"
    ];

    return _.sample(images);
}

exports.User = User;
exports.validate = validateSchema;
