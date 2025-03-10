
const mongoose  = require('mongoose');
const CampGround = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/myCampGround',{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async ()=> {
    await CampGround.deleteMany({});
    for(let i=0 ;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new CampGround({
            title : `${sample(descriptors)} ${sample(places)}`,
            author : '67c770680fe9686a22ca790a',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias commodi blanditiis provident, sint modi quos magni, neque ea omnis accusantium, aut dolore ut maiores nobis laboriosam ipsum quam? Architecto, quasi.",
            price : 25,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images:[{
                url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
            },
            {
                url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
            }]
            
        })
        await camp.save();
    }
} 

seedDB().then(() => {
    mongoose.connection.close();
})