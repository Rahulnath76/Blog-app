import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: [6, "At least 6 character is required"]
        },
        profileImg: {
            type: String,
        },
        bio: {
            type: String,
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            }
        ],
    },

    {
    timestamps: true
    }
)


const User = mongoose.model("User", userSchema);

export default User;
