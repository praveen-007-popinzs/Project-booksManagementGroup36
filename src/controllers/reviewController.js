const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const mongoose = require("mongoose")
const { send } = require("express/lib/response")


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidObjectId = function (collegeId) {
    return mongoose.Types.ObjectId.isValid(collegeId)
}


const reviewer = async function (req, res) {

    try {

        bookIdparam = req.params.bookId
        if (!isValid(bookIdparam)) {
            return res.status(400).send({ status: false, msg: "book Id is missing" })
        }

        if (!isValidObjectId(bookIdparam)) {
            return res.status(400).send({ status: false, msg: "Book Id is not valid" })
        }


        data = req.body


        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "body is missing" })
        }

        const { bookId, reviewedBy, rating, review } = data
        //console.log(bookId)

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "book Id is missing" })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Book Id is not valid" })
        }

        if (bookId != bookIdparam) {
            return res.status(400).send({ status: false, msg: "book id in params and book id in body both are different" })
        }

        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, msg: " reviewd by is missing" })
        }
        // if(!isValid(reviewedAt)){
        //     return res.status(400).send({status : false, msg : "reviewedAt is missing"})
        // }
        if (!isValid(rating)) {
            return res.status(400).send({ status: false, msg: "rating is missing" })
        }
        if (!isValid(review)) {
            return res.status(400).send({ status: false, msg: "rating is missing" })
        }


        const checkbookIdexist = await bookModel.findOne({ _id: bookId, isDeleted: false })
        console.log(checkbookIdexist)
        if (!checkbookIdexist) {
            return res.status(400).send({ status: false, msg: "no book record found with this id/book ypu are searching is alredy deleted" })

        }

        const reviewGenerated = await reviewModel.create(data)

        obj = await bookModel.findOneAndUpdate(
            { _id: bookId },
            { $inc: { reviews: 1 } },
        )


        return res.status(200).send({ status: true, msg: "reviewed", data: reviewGenerated })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


const updateReview = async function (req, res) {
    try {
        bookId = req.params.bookId
        reviewId = req.params.reviewId

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "book id is not valid" })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "book id is not in valid format" })
        }

        const checkbookIdExist = await bookModel.findById({ _id: bookId })
        if (!checkbookIdExist) {
            return res.status(400).send({ status: false, msg: "book you are searching does not exist" })
        }

        if (checkbookIdExist.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "book is already deleted" })
        }

        if (!isValid(reviewId)) {
            return res.status(400).send({ status: false, msg: " review id is not valid" })
        }

        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "review id is not in valid format" })
        }

        const checkReviewIdExist = await reviewModel.findById({ _id: reviewId })
        if (!checkReviewIdExist) {
            return rse.status(400).send({ status: false, msg: "review does not exist" })
        }

        if (checkReviewIdExist.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "review is already deleted" })
        }

        data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "data is missing from the body" })
        }

        const { reviewersName, rating, review } = data
        let obj = {}

        if (reviewersName) {
            if (!isValid) {
                return res.status(400).send({ status: false, msg: "name is not in valid format" })
            }

            obj.reviewedBy = reviewersName.trim()
        }

        if (rating) {
            if (!isValid(rating)) {
                return res.status(400).send({ status: false, msg: "rating is not in valid format" })
            }

            if(rating < 1 || rating >5){
                return res.status(400).send({status : false, msg : "rating should be in between 1 to 5"})
            }

            obj.rating = rating
        }

        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, msg: "review is not in valid format" })
            }

            obj.review = review.trim()
        }

        const updatedReview = await reviewModel.findOneAndUpdate(
            { _id: reviewId },
            { $set: { reviewedBy: obj.reviewedBy, rating: obj.rating, review: obj.review } },
        )

        const bookdetailsafterUpdate = await bookModel.findById({ _id: bookId })
        const allreviewrs = await reviewModel.find({ bookId: bookId })

        const data1 = bookdetailsafterUpdate
        data1._doc.reviewsData = allreviewrs

        return res.status(200).send({ status: false, msg: "updated", data: data1._doc })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}


const deleteReview = async function(req, res){
    try{

        bookId = req.params.bookId
        reviewId = req.params.reviewId

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "book id is not valid" })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "book id is not in valid format" })
        }

        const checkbookIdExist = await bookModel.findById({ _id: bookId })
        if (!checkbookIdExist) {
            return res.status(400).send({ status: false, msg: "book you are searching does not exist" })
        }

        if (checkbookIdExist.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "book is already deleted" })
        }

        if (!isValid(reviewId)) {
            return res.status(400).send({ status: false, msg: " review id is not valid" })
        }

        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "review id is not in valid format" })
        }

        const checkReviewIdExist = await reviewModel.findById({ _id: reviewId })
        if (!checkReviewIdExist) {
            return rse.status(400).send({ status: false, msg: "review does not exist" })
        }

        if (checkReviewIdExist.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "review is already deleted" })
        }



       const deletedReview = await reviewModel.findOneAndUpdate(
           {_id : reviewId},
           {$set : {isDeleted:true}}


       )

       const decreaseReviewValue = await bookModel.findOneAndUpdate(
           {_id : bookId},
           {$inc : {reviews : -1}},
           {new : true}
       )

       return res.status(200).send({status : true, msg : "Updated", data:decreaseReviewValue })

       
        

    }catch(err){
        return res.status(400).send({status :false, msg : err.message})
    }
}




module.exports.reviewer = reviewer
module.exports.updateReview=updateReview
module.exports.deleteReview=deleteReview