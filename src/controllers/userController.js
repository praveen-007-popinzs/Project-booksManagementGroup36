const userModel = require("../models/userModel")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const typeString = function(value){
    if(typeof value !== "string") return false
    return true
}

const createUser = async function (req, res) {
    try {
        data = req.body
        if (Object.keys(data).length > 0) {

            const { title, name, phone, email, password, address: { street, city, pincode } } = data

            if (!isValid(title)) {
                return res.status(400).send({ status: false, msg: "title is not valid/title is missing" })
            }


            if (!isValid(name)) {
                return res.status(400).send({ status: false, msg: "name is not valid/name is missing" })
            }

            if (!isValid(phone)) {
                return res.status(400).send({ status: false, msg: "phone is not valid/phone is missing" })
            }

            if (!isValid(email)) {
                return res.status(400).send({ status: false, msg: "email is not valid/email is missing" })
            }
            if (!isValid(password)) {
                return res.status(400).send({ status: false, msg: "password is not valid/password is missing" })
            }
            if (!isValid(street)) {
                return res.status(400).send({ status: false, msg: "street is not valid" })
            }
            if (!isValid(city)) {
                return res.status(400).send({ status: false, msg: "city is not valid" })
            }

            if (!isValid(pincode)) {
                return res.status(400).send({ status: false, msg: "pincode is not valid" })
            }
            
            //console.log(data)
            const userCreated = await userModel.create(data)
            return res.status(201).send({ status: true, msg: "user Created", data: userCreated })



        }else{
            return res.status(400).send({status : false , msg : "Body is missing"})
        }


    } catch (err) {

        return res.status(500).send({ status: false, msg: err.message })
    }
}


const userLogin = async function (req, res) {
    try {
        let data = req.body


        if (Object.keys(data).length > 0) {
            let email = req.body.email
            let password = req.body.password
            if(!email){
                return res.status(400).send({status : false, msg : "email is missing"})
            }

            if(!password){
                return res.status(400).send({status : false, msg : "password is missing"})
            }

            if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
                res.status(400).send({status:false, msg : "Email should be valid email address"})
                return
            }


            const credentialCheck = await userModel.findOne({email, password})
            if (!credentialCheck) return res.status(401).send({ status: false, msg: "username or password is incorrect" })

            let token = jwt.sign(
                { 
                    userId : credentialCheck._id,
                    iat : Math.floor(Date.now() / 1000),
                    exp : Math.floor(Date.now() / 1000) + 10*60*60
                
                },
                "Popinzs007"
            )

            res.setHeader("x-api-token", token)
            res.status(200).send({ status: true, msg:"Author login successful",data: token })
        }
        else res.status(400).send({ status: false, msg: "username or password is missing" })

    } catch (err) {
        res.status(500).send({ msg: "error", error: err.message })

    }


};

module.exports.createUser = createUser
module.exports.userLogin=userLogin
