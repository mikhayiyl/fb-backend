const router = require("express").Router();
const { validate, Notification } = require("../models/notification");
const validator = require("../middleware/validate");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");




//get notification 

router.get("/:id", [auth], async (req, res) => {
    const notification = await Notification.find({ recipientId: req.params.id }).sort("-createdAt").select("-__v");
    res.send(notification);
});



//new notification 
router.post("/", [auth, validator(validate)], async (req, res) => {
    const notification = new Notification(req.body)

    await notification.save();

    res.send(notification);
});

//uncheck notification 
router.put("/:id", [auth, objId], async (req, res) => {
    const notifications = await Notification.updateMany({ recipientId: req.params.id }, { checked: true });
    res.send(notifications);
});


//delete all notifications 
router.delete("/deleteall/:id", [auth, objId], async (req, res) => {
    const notification = await Notification.deleteMany({ recipientId: req.params.id })
    if (!notification) return res.status(404).send("notification not found");

    res.send(notification);
});


//delete notification 
router.delete("/:id", [auth, objId], async (req, res) => {
    const notification = await Notification.findByIdAndRemove(req.params.id);
    if (!notification) return res.status(404).send("notification not found");

    res.send(notification);
});




module.exports = router;