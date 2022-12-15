const mongoose = require("mongoose");
const Joi = require("joi");

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: String,
            required: true,
            maxlength: 50
        },
        senderId: {
            type: String,
            required: true,
            maxlength: 50
        },
        postId: {
            type: String,
            required: true,
            maxlength: 50
        },

        text: {
            type: String,
            required: true,
            maxlength: 255,
            required: true,
        },

        checked: {
            type: Boolean,
            default: false
        }
    },

    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

function validateNotification(text) {
    const schema = {
        recipientId: Joi.objectId().required(),
        senderId: Joi.objectId().required(),
        postId: Joi.objectId().required(),
        text: Joi.string().required(),
        checked: Joi.boolean(),
    };
    return Joi.validate(text, schema);

}

module.exports.Notification = Notification;
module.exports.validate = validateNotification;
