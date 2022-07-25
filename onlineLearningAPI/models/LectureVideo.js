const mongoose = require(`mongoose`);
const { Schema } = mongoose;

//creating template/class for storing lecture video data


const lectureVideoSchema = new Schema(
    {
        title: 
        {
            type: String,
            required: true
        },


        description: 
        {
            type: String,
            required: true,
           
        },

        video:
        {
            type:String,
            //required:true
            default:null
        },


        course:
        {
            type: Schema.Types.String, 
            ref: "course"
        },

        chapter:
        {
            type: Schema.Types.String, 
            ref: "chapter"
        },

        instructor:
        {
            type: Schema.Types.ObjectId, 
            ref: "teacher" 
        },


        timestamp: {
            type: Date,
            default: Date.now
        }

    }
)

const LectureVideo = mongoose.model('lectureVideo', lectureVideoSchema);


module.exports = LectureVideo;