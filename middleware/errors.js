module.exports = (err, req, res, next) =>{
    
    let status = err.statusCode || 500
    if(err.value){
        status = 422
    }
    const message = err.message
    const data = err.data
    res.status(status).json({
        message: message,
        data: data
    })
}