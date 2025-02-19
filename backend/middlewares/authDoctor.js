import jwt from "jsonwebtoken"

//doctor authentication middleware

const authDoctor= async (req,res,next) => {

    try {

        const {dtoken}=req.headers
        if(!dtoken){
            return res.json({success:"false",message:"Not Authirized !! Login Again"})
        }
        console.log("in auth Doctor token is ",dtoken)
        const token_decode=jwt.verify(dtoken,process.env.JWT_SECRET);
        req.body.docId=token_decode.id
        console.log("docId id in authDoctor is ",token_decode.id)
        next();

    } catch (error) {
        console.log("Error in Auth User middleware ",error);
        res.json({success:"false",message:error.message})
    }
}

export default authDoctor