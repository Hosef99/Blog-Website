//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const Post = require('./Post');

const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




app.get("/", async function (req, res) {
    let posts = []
    try {
        posts = await Post.find()        
    } catch (error) {
        console.log(error)
    }
    res.render('home', {homeParagraph: homeStartingContent, posts: posts});
}); 

app.get("/about", function(req, res) {
    res.render('about', {aboutParagraph: aboutContent});
});

app.get('/contact', function(req, res) {
res.render('contact', {contactParagraph: contactContent});
});

app.get('/compose', function(req, res) {
    res.render('compose');
})

app.get('/posts/:postName', async function (req, res) {
    let posts = []
    try {
        posts = await Post.find() 
        // console.log(posts.length)
    } catch (error) {
        console.log(error)
    }

    try {
        const searchIndex = posts.findIndex((post) => post.title.toLowerCase() === req.params.postName.toLowerCase()); 
        if (searchIndex === -1) {
            throw new Error('No Posts')
        }
        posts[searchIndex].content = posts[searchIndex].content.replaceAll("\r\n", "<br>") 
        res.render('post', {post: posts[searchIndex]});
    } catch (error) {
        res.render('error')
    }
})

app.get('/delete', async function (req, res) {
    let posts = []
    try {
        posts = await Post.find()
    } catch (error) {
        console.log(error)
    }

    res.render("delete", {posts: posts})


})

app.post('/delete', async function (req, res) {
    const queryTitle = req.body.title;
    try {
        const post = await Post.deleteOne({title: queryTitle})
        console.log(queryTitle)
    } catch (error) {
        console.log(error)
    }
    res.redirect("/delete")
})

app.post('/', async function (req, res) {
    const post = new Post({
        content: req.body.content,
        title: req.body.title
    })
    try {
        await post.save()
    } catch (error) {
        console.log(error)
    }
    
    res.redirect('/');
});








app.listen(3000, function () {
    console.log("Server started on port 3000");
});
