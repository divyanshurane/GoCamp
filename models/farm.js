const mongoose = require('mongoose');
const {Schema} = mongoose;
const FarmSchema = new Schema({
    name:{
        type: String,
        required : [true,"We need a farm name."]
    },
    city:{
        type:String
    },
    email:{
        type:String,
        requied:[true,'Email required']
    },
    product:[
        {
            type: Schema.Types.ObjectId,
            ref:'Product'
        }
    ]

}
)
const Farm = mongoose.model('Farm',FarmSchema);
module.exports = Farm;