import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.routes.js"
import postRoute from "./routes/post.routes.js"
import cookieParser from "cookie-parser";
import cloudinaryConnect from "./config/cloudinaryConfig.js";
import fileUpload from "express-fileupload"
import connectDB from "./config/connectDB.js"

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}));


const port = process.env.PORT || 9000;

connectDB();
cloudinaryConnect();

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


app.listen(port, () => {
    console.log("App is listening at port ", port);
});