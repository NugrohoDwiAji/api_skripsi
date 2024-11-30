export const response = (statusCode, data, message, res) =>{
    res.status(statusCode).json({
        datas:data,
        message:message
    })
}