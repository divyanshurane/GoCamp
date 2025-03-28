const CampGround = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview=async (req,res)=>{
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully added a review');
    res.redirect(`/campgrounds/${campground._id}`)
}   

module.exports.deleteReview = async (req,res)=>{
    const {id,reviewId} =req.params;
    console.log(reviewId);
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews : reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`)
}