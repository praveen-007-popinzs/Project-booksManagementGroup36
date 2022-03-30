const { decode } = require("jsonwebtoken")
const jwt = require("jsonwebtoken")

const bookModel = require("../models/bookModel")

let authenticate = async function (req, res, next) {
    try {
        let token = req.headers["x-api-token"]
        if (!token) {
            return res.status(404).send({ status: false, msg: "token is not present in header" })
        }

        let decodeToken = jwt.verify(token, "Popinzs007")
        if (!decodeToken) {
            return res.status(401).send({ status: false, msg: "invalid token" })

        }
        req.decodeToken = decodeToken
        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.messge })
    }
}


const authoriseUpdateAndDelete = async function (req, res, next) {
    try {
        bookId = req.params.bookId

        if (bookId) {
            let check = await bookModel.findById(bookId)
            if (!check) {
                return res.status(404).send({ status: false, msg: "book you want to access does not exist in our system" })
            }

            if (check.isDeleted == true) {
                return res.status(404).send({ status: false, msg: "the book you are accessing is already deleted" })
            }

            console.log(req.decodeToken)
            console.log(check.userId)

            if (check.userId.toString() !== req.decodeToken.userId.toString()) {
                return res.status(404).send({ status: false, msg: "you are trying to change someone else profile" })

            }

            req.bookId = bookId
            next()
        } else {
            return res.status(400).send({ status: false, msg: "booKid is not present" })
        }

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

const authoriseCreate = async function (req, res,next) {
    // try{

        userId=req.body.userId
        if(userId){
            if(userId !==req.decodeToken.userId){
                return res.status(400).send({status : false, msg : "user id does not matches with user credentials"})
                
            }
            next()
        }

    // }catch(err){
    //     return res.status(500).send({status : false, msg : err.message})
    // }

}

module.exports.authenticate = authenticate
module.exports.authoriseUpdateAndDelete = authoriseUpdateAndDelete
module.exports.authoriseCreate=authoriseCreate