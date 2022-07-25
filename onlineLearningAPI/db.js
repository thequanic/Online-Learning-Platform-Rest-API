const mongoose = require(`mongoose`);
const mongoUri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const connectToMongo = () => {
    mongoose.connect(mongoUri, () => {
        console.log("connected to mongo");
    })
}


module.exports = connectToMongo;

/*For connecting server to database MongoDB which will be used to store
data about courses, categories, students, teachers, admins etc.*/