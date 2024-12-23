import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    commentPost, 
    createPost,
    updatePost, 
    deletePost,  
    getAllPosts, 
    likeDislike 
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createpost", protectRoute, createPost);
router.put("/updatepost/:id", protectRoute, updatePost);
router.delete("/deletepost/:id", protectRoute, deletePost);
router.get("/getallpost", getAllPosts);

router.post("/comment/:id", protectRoute, commentPost);
router.post("/like/:id", protectRoute, likeDislike);


export default router;
