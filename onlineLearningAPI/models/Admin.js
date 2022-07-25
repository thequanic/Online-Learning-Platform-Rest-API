const mongoose = require(`mongoose`);
const { Schema } = mongoose;

//creating template/class for storing admin data


const adminSchema = new Schema(
    {
        name: 
        {
            type: String,
            required: true
        },


        email: 
        {
            type: String,
            required: true,
            unique: true
        },


        password: 
        {
            type: String,
            required: true
        },


        age:
        {
            type:String,
            required:true
        },

        phn_num:
        {
            type:String,
            default:"XXXX"
        },

        profession:
        {
            type:String,
            required:true
        },

        highestEducation:
        {
            type:String,
            required:true
        },

        profile_img:
        {
            type:String,
            default:null
        },

        profile_bkgrnd:
        {
            type:String,
            default:null
        },



        timestamp: {
            type: Date,
            default: Date.now
        }

    }
)

const Admin = mongoose.model('admin', adminSchema);


module.exports = Admin;