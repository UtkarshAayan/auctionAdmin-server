const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        contactNumber: {
            type: Number,
            required: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isSeller: {
            type:Boolean,
            default: false
        },
        isBuyer:{
            type: Boolean,
            default: false
        },
        isSubadmin:{
            type: Boolean,
            default: false
        },
        verifiedByAdmin:{
            type: Boolean,
            default: false
        },
        roles: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: "Role"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', UserSchema);