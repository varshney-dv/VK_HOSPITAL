import jwt from "jsonwebtoken"

//user authentication middleware

const authUser= async (req,res,next) => {
    try {

        const {token}=req.headers
        if(!token){
            return res.json({success:"false",message:"Not Authirized Login Again"})
        }
        // console.log("in auth User token is ",token)
        const token_decode=jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId=token_decode.id
        // console.log("User id in authUser is ",token_decode.id)
        next();

    } catch (error) {
        console.log("Error in Auth User middleware ",error);
        res.json({success:"false",message:error.message})
    }
}

export default authUser