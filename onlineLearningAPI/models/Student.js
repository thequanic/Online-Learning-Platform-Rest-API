const mongoose = require(`mongoose`);
const { Schema } = mongoose;

//creating template/class for storing student data


const studentSchema = new Schema(
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

const Student = mongoose.model('student', studentSchema);


module.exports = Student;