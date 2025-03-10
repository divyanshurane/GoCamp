const express = require('express');
const mongoose = require('mongoose');
// const { descriptors } = require('../seeds/seedHelpers');
const Review = require('./review');
// const User = require('./user');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const CampGroundSchema = new mongoose.Schema({
    title:String,
    images:[ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price:Number,
    location:String,
    description:String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }]
});


CampGroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports =  mongoose.model('CampGround',CampGroundSchema);