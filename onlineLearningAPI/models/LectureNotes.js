const mongoose = require(`mongoose`);
const { Schema } = mongoose;

//creating template/class for storing lecture note data


const lectureNotesSchema = new Schema(
    {
        title: 
        {
            type: String,
            required: true
        },


        note:
        {
            type:String,
            required:true
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


        timestamp: {
            type: Date,
            default: Date.now
        }

    }
)

const LectureNotes = mongoose.model('lectureNotes', lectureNotesSchema);


module.exports = LectureNotes;