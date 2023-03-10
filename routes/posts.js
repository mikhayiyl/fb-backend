const router = require("express").Router();
const fs = require("fs");
const { validate, Post } = require("../models/post");
const validator = require("../middleware/validate");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const { Comment } = require("../models/comment");
const { sharedPost } = require("../models/sharedPost");
const { savePost } = require("../models/savedPost");
const winston = require("winston");
const { Notification } = require("../models/notification");

// get a post
router.get('/:id', [auth, objId], async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("The post with the given Id was not found")
  res.send(post)
})


//get all posts

router.get('/', [auth], async (req, res) => {
  const posts = await Post.find().sort('-createdAt').select('-__v');
  res.send(posts)
})


//create a post 

router.post("/", [auth, validator(validate)], async (req, res) => {

  if (!req.body.description) return res.status(400).send('No description text');
  const post = new Post(req.body
  );
  await post.save();
  res.send(post);
});


//delete post

router.delete('/:id', [auth, objId], async (req, res) => {
  const post = await Post.findByIdAndRemove(req.params.id);
  if (!post) return res.status(404).send('The post with given Id was not found');

  //clear post comments
  const comments = await Comment.deleteMany({ postId: post._id });

  //delete if the post  is shared
  await sharedPost.deleteOne({ postId: post._id });
  //delete if the post  is saved
  await savePost.deleteOne({ postId: post._id });

  res.send({ post, comments });
});



//like a post

router.put("/likes/:id", [auth, validator(validate), objId], async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send('Post already deleted');


  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).send("Invalid user");




  const notification = new Notification({
    recipientId: post.userId,
    postId: post._id,
    senderId: user._id,
    text: user.username + " liked your post ",
  })





  if (!post.likes.includes(req.body.userId))
    await post.updateOne({ $push: { likes: req.body.userId } })


  if (post.userId !== req.body.userId) await notification.save();

  res.send(post);

});


//unlike a post


router.put("/unlikes/:id", [auth, validator(validate), objId], async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send('Post already deleted');

  if (post.likes.includes(req.body.userId))
    await post.updateOne({ $pull: { likes: req.body.userId } })

  await Notification.findOneAndDelete({ senderId: req.body.userId, recipientId: post.userId, postId: post._id })


  res.send(post);

});



//profile timeline posts
router.get('/:id/timeline', [auth], async (req, res) => {
  const currentUser = await User.findById(req.params.id);

  //current user posts
  if (!currentUser) res.status(404).send('Invalid User')
  const userPosts = await Post.find({ userId: currentUser._id }).sort('-createdAt');

  //followers posts
  const followersPosts = await Promise.all(
    currentUser.friends.map(friendId => {
      return Post.find({ userId: friendId }).sort('-createdAt');
    })
  );

  //shared posts
  const sharedPosts = await sharedPost.find({ userId: req.params.id });
  const posts = await Promise.all(
    sharedPosts.map(post => {
      return Post.findById(post.postId).sort('-createdAt');
    })
  );


  res.send(userPosts.concat(...posts));

})

//report post
router.put("/report/:id", [auth, objId], async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { spam: true }, { new: true });
  if (!post) return res.status(404).send('The post with id ' + req.params.id + ' does not exist');

  res.send(post);

});



module.exports = router;
