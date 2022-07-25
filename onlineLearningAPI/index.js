const connectToMongo = require("./db")
const express = require('express');

connectToMongo();
const app = express();

const port = 3000;

app.use(express.json())

app.get('/', 
    function(req, res) 
    {
        res.send("Hello world!");
    }
);

app.use('/admin', require(`./routes/authAdmin`));
app.use('/teacher', require(`./routes/authTeacher`));
app.use('/student', require(`./routes/authStudent`));
app.use('/category', require(`./routes/category`));
app.use('/course', require(`./routes/course`));
app.use('/lectureVideo', require(`./routes/lectureVideo`));
app.use('/lectureNotes', require(`./routes/lectureNotes`));
app.use('/chapter', require(`./routes/chapter`));
app.use('/studentNotes', require(`./routes/studentNotes`));
app.use('/teacherNotes', require(`./routes/teacherNotes`));
app.use('/enrollment', require(`./routes/enrollment`));

app.listen(port, () => {
    console.log("listening");
});

