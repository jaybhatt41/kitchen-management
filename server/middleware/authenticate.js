const jwt=require("jsonwebtoken")

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    if(!token)
    {
        return res.status(401).json({msg:"Access denied , no token provided"})
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user=decoded
        next()
    } catch (error) {
        res.status(403).json({msg:"Invalid or Expired token"})
    }

}
module.exports={authenticate}