const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        unique: true,
        required: true       
    }
})

module.exports = new mongoose.model("Post", postSchema)