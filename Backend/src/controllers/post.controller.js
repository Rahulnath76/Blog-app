import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import uploaadImageToCloudinary from "../lib/imageUploader.js";

export const createPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const img = req.files?.img;
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    let uploadedImg;
    if (img) {
        uploadedImg = await uploaadImageToCloudinary(
        img,
        process.env.FOLDER_NAME
      );
    }

    const post = await Post.create({
      writer: userId,
      title,
      body,
      img: uploadedImg?.secure_url || null,
    });

    return res.status(200).json({
      success: true,
      message: "Post created succesfully",
      post,
    });
  } catch (error) {
    console.log("Error in createpost controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) return res.status(401).json({ message: "post not found" });

    if (post.writer.toString() !== userId.toString()) {
      return res.status(400).json({
        message: "You are not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted succesfully",
    });
  } catch (error) {
    console.log("Error in deletepost controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const img = req.files?.img;
    const userId = req.user.userId;
    console.log(userId)

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(401).json({
        success: false,
        message: "post not found",
      });
    }

    if (post.writer.toString() !== userId.toString()) {
      return res.status(400).json({
        message: "You are not authorized to update this post",
      });
    }

    let uploadedImg = null;
    if (img) {
        uploadedImg = await uploaadImageToCloudinary(
        img,
        process.env.FOLDER_NAME
      );
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        body,
        img: uploadedImg?.secure_url,
        updatedAt: Date.now()
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Post updated succesfully",
      updatedPost,
    });
  } catch (error) {
    console.log("Error in updatepost controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "writer",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return res.status(200).json({
      success: true,
      message: "All posts fetched succesfully",
      posts,
    });
  } catch (error) {
    console.log("Error in getaLLpost controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const likeDislike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(401).json({
        success: false,
        message: "Post doesnot exist",
      });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      return res.status(200).json({
        success: true,
        message: "disliked the post",
        updatedLikes,
      });
    } else {
      post.likes.push(userId);
      await post.save();

      const updatedLikes = post.likes;

      return res.status(200).json({
        success: true,
        message: "liked the post",
        updatedLikes,
      });
    }
  } catch (error) {
    console.log("Error in like controller ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { body } = req.body;
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(401).json({
        message: "Post doesnot exist",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "User doesnot exist",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            body,
            user: userId,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Commented on post",
      updatedPost,
    });
  } catch (error) {
    console.log("Error in commentpost ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
