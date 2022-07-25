const mongoose = require(`mongoose`);
const { Schema } = mongoose;

//creating template/class for storing student notes data


const studentNotesSchema = new Schema(
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


        tag: 
        {
            type: String,
            default:"General"
        },

        student: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student'
    
        },

        timestamp: {
            type: Date,
            default: Date.now
        }

    }
)

const StudentNotes = mongoose.model('studentNotes', studentNotesSchema);


module.exports = StudentNotes;