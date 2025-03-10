if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose  = require('mongoose');
const ExpressErrors = require('./utils/ExpressErrors');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStragtegy = require('passport-local');
const User = require('./models/user');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const dbUrl = process.env.DB_URL;
const MongoDBStore = require("connect-mongo")(session);



// mongoose.connect('mongodb://127.0.0.1:27017/myCampGround',{
// mongoose.connect('mongodb+srv://User1010:test1212@cluster0.mongodb.net/test?retryWrites=true&w=majority',{
mongoose.connect(dbUrl,{
  useNewUrlParser: true,
  useUnifiedTopology: true
//   ssl: true,
//   sslValidate: true,
//   tls: true,
//   tlsMaxVersion: 'TLSv1.2'
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method')); 

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStragtegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{   
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/',(req,res)=>{
    res.render('home');
})

app.use('/',users);
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);


const verifyPass =(req,res,next)=>{
    const {pass} = req.query;
    if(pass === "Hello"){
        return next();
    }
        throw new appError ('Please enter a valid password',404)
}

app.get('/secret',verifyPass,(req,res)=>{
    res.send("Authorized User")
});

app.all('*', (req, res, next)=>{
    next( new ExpressErrors('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    // res.send('Oh Boy something went wrong!');
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error',{err});
})


app.listen(3000,()=>{
 console.log('Hola');
});