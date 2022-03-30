const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const createReview = new mongoose.Schema({
    bookId : {
        type : objectId,
        required:true,
        ref: "book"
    },
    reviewedBy :{
        type : String,
    
        default : "Guest",

    },
    reviewedAt : {
        type : Date,
        default: Date.now()
    
        
    },

    rating : {
        type : Number,
        min:[1, "minimum rating should be 1"],
        max : [5, "maximum rating should not be greater than 5"],
        required: true,
      

    },
    review: {
        type: String
    },
    isDeleted : {
        type : Boolean,
        default:false
    }

}, {timestamps : true} )


module.exports= mongoose.model('review', createReview)