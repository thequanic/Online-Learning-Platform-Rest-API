const mongoose = require(`mongoose`);
const { Schema } = mongoose;


//creating template/class for storing course enrollment data


const enrollmentSchema = new Schema(
    {


            student:
            { 
                type: Schema.Types.ObjectId, 
                ref: "User" 
            },


            course: 
            { 
                type: Schema.Types.ObjectId, 
                ref: "Course" 
            },


            approved: 
            {
                type: Boolean,
                default: true,
                required: false
            }
    }
)

const Enrollment = mongoose.model('enrollment', enrollmentSchema);


module.exports = Enrollment;