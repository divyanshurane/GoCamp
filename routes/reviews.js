const express = require('express');
const router = express.Router({mergeParams:true});
const path = require('path');
const Review = require('../models/review');
const CampGround = require('../models/campground');
const reviews = require('../controller/review');
const {isLoggedIn , isAuthor , isReviewAuthor} = require('../middleware');

const catchAsync = require('../utils/catchAsync');
// const appError = require('./appError');
// const ExpressErrors = require('./utils/ExpressErrors');


const ExpressErrors = require('../utils/ExpressErrors');
// const methodOverride = require('method-override');
// const ejsMate = require('ejs-mate');

router.post('/',isLoggedIn , catchAsync(reviews.createReview));

router.delete('/:reviewId', isReviewAuthor , catchAsync(reviews.deleteReview));

module.exports = router;