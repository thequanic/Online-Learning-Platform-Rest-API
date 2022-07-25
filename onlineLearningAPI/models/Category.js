const mongoose = require(`mongoose`);
const { Schema } = mongoose;

//creating template/class for storing courses category data


const categorySchema = new Schema(
    {
        categoryName: 
        {
            type: String,
            required: true,
            unique:true
        },

        timestamp: {
            type: Date,
            default: Date.now
        }

    }
)

const Category = mongoose.model('category', categorySchema);


module.exports = Category;