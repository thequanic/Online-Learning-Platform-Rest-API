const mongoose = require(`mongoose`);
const { Schema } = mongoose;

//creating template/class for storing course data


const courseSchema = new Schema(
    {
        title: 
        {
            type: String,
            required: true,
            unique:true
        },


        description: 
        {
            type: String,
            required: true,
          
        },

        course_img:
        {
            type:String,
            default:null
        },

        instructor: 
        {   
            type: Schema.Types.ObjectId, 
            ref: "teacher" 
        },

        category: 
        {   
            type: Schema.Types.String, 
            ref: "category" 
        },

        timestamp: {
            type: Date,
            default: Date.now
        }

    }
)

const Course = mongoose.model('course', courseSchema);


module.exports = Course;