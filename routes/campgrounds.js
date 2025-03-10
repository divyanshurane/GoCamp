const express = require('express');
const router = express.Router();
const CampGround = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controller/campground');
const {isLoggedIn , isAuthor} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(campgrounds.createNew));

router.get('/new',isLoggedIn,campgrounds.renderNew);

router.route('/:id')
    //showing details of campgrounds
    .get(catchAsync(campgrounds.show))
    //Editing details of campgrounds
    .put(isLoggedIn, isAuthor ,upload.array('image'),catchAsync(campgrounds.edit))
    //deleting campground 
    .delete(isLoggedIn, isAuthor , catchAsync(campgrounds.delete));

//Editing details of campgrounds
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit));

module.exports = router;
