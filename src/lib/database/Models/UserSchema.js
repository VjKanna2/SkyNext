import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    place: String,
    latitude: Number,
    longitude: Number
});

const UserSchema = new mongoose.Schema({
    uniqId: String,
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    mailId: {
        type: String,
        required: true,
        unique: true
    },
    home: LocationSchema,
    favs: [LocationSchema]
}, { timestamps: true });

const UserData = mongoose.models.User || mongoose.model('User', UserSchema, 'Users');

export default UserData;