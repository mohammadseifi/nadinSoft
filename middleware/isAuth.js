const jwt = require('jsonwebtoken');

exports.isAuth = async(req, res, next)=>{
    try {
        const authHeader = req.get("Authorization")
        if(!authHeader){
            const error = new Error("مجوز کافی را ندارید!")
            error.statusCode = 422
            throw error
        }
        const token = authHeader.split(" ")[1]
        const decodedToken = await jwt.verify(token, "SECRET")
        if(!decodedToken){
            const error = new Error("مجوز کافی را ندارید!")
            error.statusCode = 422
            throw error 
        }
        req.userName = decodedToken.userName
        req.role = decodedToken.role
        next()
    } catch (err) {
        next(err)
    }
}