import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({
                error: "Unauthorized, no token provided"
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decodedToken)    {
            return res.status(401).json({
                error: "Unauthorized, Invalid token"
            })
        }
        
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}