
const mongoose  = require('mongoose');
const CampGround = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl,{
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
    for(let i=0 ;i<19;i++){
        // const random1000 = Math.floor(Math.random()*19);
        const camp = new CampGround({
            // title : `${sample(descriptors)} ${sample(places)}`,
            title : `${cities[i].camp_title}`,
            author : '67c770680fe9686a22ca790a',
            location : `${cities[i].city}, ${cities[i].state}`,
            description: `${cities[i].description}`,
            price : 25,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[i].longitude,
                    cities[i].latitude
                ]
            },
            images:[{
                url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                filename: 'GoCamp/ahfnenvca4tha00h2ubt'
            },
            {
                url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                filename: 'GoCamp/ruyoaxgf72nzpi4y6cdi'
            }]
            
        })
        await camp.save();
    }
} 

seedDB().then(() => {
    mongoose.connection.close();
})