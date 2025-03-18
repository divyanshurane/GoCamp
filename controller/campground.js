const CampGround = require('../models/campground');
const maptilerClient = require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const Review = require('../models/review');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req,res)=>{
    const campground = await CampGround.find({});
    res.render('campground/index',{campground})
};

module.exports.renderNew = (req,res)=>{
    res.render('campground/new');
}

module.exports.createNew = async (req,res)=>{
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new CampGround(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    console.log(geoData.features[0].geometry);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    // console.log(campground);
    req.flash('success','Successfully added a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.show = async (req,res)=>{
    const campground = await CampGround.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    
    if(!campground){
        req.error("error","Campground dosen't exist");
        return res.redirect('/campgrounds');
    }
    res.render('campground/show',{campground})
}

module.exports.renderEdit= async (req,res)=>{
    const campground = await CampGround.findById(req.params.id);
    if(!campground){
        req.error("error","Campground dosen't exist");
        return res.redirect('/campgrounds');
    }
    res.render('campground/edit',{campground})
}

module.exports.edit = async (req,res)=>{
    const {id} = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {...req.body.campground});
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    console.log(campground.images);
    req.flash('success','Successfully edited a campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req,res)=>{
    const {id} = req.params;
    const campground = await CampGround.findByIdAndDelete({_id:id});
    req.flash('success','Successfully deleted a campground');
    res.redirect('/campgrounds');
}

