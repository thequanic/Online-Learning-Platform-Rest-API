const mongoose = require(`mongoose`);
const { Schema } = mongoose;

//creating template/class for storing chapter data


const chapterSchema = new Schema(
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


        course:
        {
            type: Schema.Types.String, 
            ref: "course"
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

const Chapter= mongoose.model('chapter', chapterSchema);


module.exports = Chapter;