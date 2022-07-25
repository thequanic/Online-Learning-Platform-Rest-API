const mongoose = require(`mongoose`);
const { Schema } = mongoose;


//creating template/class for storing teacher notes data


const teacherNotesSchema = new Schema(
    {
        title: 
        {
            type: String,
            required: true
        },


        description: 
        {
            type: String,
            required: true
        },


        tag: 
        {
            type: String,
            default:"General"
        },

        teacher: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teacher'
    
        },

        timestamp: {
            type: Date,
            default: Date.now
        }

    }
)

const TeacherNotes = mongoose.model('teacherNotes', teacherNotesSchema);


module.exports = TeacherNotes;