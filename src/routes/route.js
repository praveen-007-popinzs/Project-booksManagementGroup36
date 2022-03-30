const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
const authMiddleware = require("../middlewares/authMiddleware")


router.get("/test-me", function(req, res){
    res.send({status : true, msg : "working"})
})


router.post("/register", userController.createUser)

router.post("/login", userController.userLogin)



router.post("/books", authMiddleware.authenticate,           authMiddleware.authoriseCreate,   bookController.createBook)

router.get("/get/books", authMiddleware.authenticate,        bookController.getBooks)

router.get("/books/:bookId",authMiddleware.authenticate,     bookController.getBookDetailsById)

router.put("/books/:bookId" , authMiddleware.authenticate,   authMiddleware.authoriseUpdateAndDelete,   bookController.updateBooks)

router.delete("/books/:bookId", authMiddleware.authenticate, authMiddleware.authoriseUpdateAndDelete,   bookController.deleteBooks)



router.post("/books/:bookId/review", reviewController.reviewer)

router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)


module.exports = router;