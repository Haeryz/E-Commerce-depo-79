import mongoose from "mongoose";
import User from "./user.model";

const profileSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    nomorhp: {
        type: String,
        required: true
    },
    alamat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alamat",
        required: true
    },
    jeniskelamin: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);
export default Profile