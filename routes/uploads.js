const express = require('express');
const router = express.Router();
const { Post } = require('../models/post');
const { User } = require('../models/user');






router.post("/", async (req, res, next) => {
    const post = new Post({
        userId: req.body.userId,
        description: req.body.description,

        media: {
            name: req.body.name.endsWith(".mp4") ? "video" : "image",
            file: req.body.file
        }
    })


    await post.save();

    res.send(post)

});

router.put("/", async (req, res) => {

    const user = req.body.name === "profile" ? await User.findByIdAndUpdate(req.body.userId, {
        profilePicture: req.body.file, $push: { images: { image: req.body.file, type: "profile" } }
    }, { new: true }) : await User.findByIdAndUpdate(req.body.userId, {
        coverPicture: req.body.file, $push: { images: { image: req.body.file, type: "cover" } }
    }, { new: true });

    console.log(user)
    res.send(user)

});




module.exports = router;
