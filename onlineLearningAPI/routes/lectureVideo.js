const express = require('express');
const teacherORadmin = require(`../middleware/teacherORadmin`);
const fetchTeacher = require(`../middleware/fetchTeacher`);
const fetchAdmin = require(`../middleware/fetchAdmin`);
const Chapter = require(`../models/Chapter`);
const Course = require(`../models/Course`);
const LectureVideo =require(`../models/LectureVideo`)
const router = express.Router();
const { body, validationResult } = require(`express-validator`);

/********************************************************************************************* */
router.get("/all/:chapter",async function(req,res)
{
    try
    {
        const lectVideo = await LectureVideo.find({chapter:req.params.chapter});
        res.json(lectVideo);
    }
    catch(error)
    {
        console.error(err.message);
        res.status(500).send("Some error occured");
    }
})

/*********************************************************************************************** */


router.post('/add', fetchTeacher,

    [
        body('title', 'Title valid name').isLength({ min: 3 }),

        body('description', 'Enter description atleast 8 characters long').isLength({ min: 5 }),

        body('course', 'ADD valid course').isLength({ min: 3 }),

        body('chapter', 'ADD valid chapter').isLength({ min: 3 }),
    ],

    async function(req, res) 
    {


        try 
        {
            const { title, description,course , chapter, video } = req.body;

            const error = validationResult(req);


            if (!error.isEmpty()) {
                return res.status(400).json({ error: error.array() });
            }

            const course_= await Course.findOne({title:course});

            if(!course_)
            {
                return res.status(400).send("Course not exist");
            }

            if(course_.instructor!=req.teacher.id)
            {
                return res.status(404).send("Not authorized");
            }

            const chapter_= await Chapter.findOne({title:chapter});

            if(!chapter_)
            {
                return res.status(400).send("Chapter not exist");
            }

            if(chapter_.instructor!=req.teacher.id)
            {
                return res.status(404).send("Not authorized");
            }

            const lectVideo = new LectureVideo({
                title,
                description,
                course,
                chapter,
                video,
                instructor: req.teacher.id

            })

            const savedvideo = await lectVideo.save();

       
            res.json(savedvideo);
        }
        catch (err) 
        {
            console.error(err.message);
            res.status(500).send("Some error occured")
        }

    }
);

/*********************************************************************************************** */


router.put('/update/:id', fetchTeacher,



    async function(req, res) 
    {


        try 
        {
            const { title, description, course,chapter,video } = req.body;

            const newvideo = {};

            if (title) { newvideo.title = title; }
            if (description) { newvideo.description = description; }
            if (course) { newvideo.course = course; }
            if (chapter) { newvideo.chapter = chapter; }
            if (video) { newvideo.video = video; }

            let lectVideo = await LectureVideo.findById(req.params.id);

            if (!lectVideo) { return res.status(404).send("Not Found"); }
            if (lectVideo.instructor.toString() !== req.teacher.id) { return res.status(404).send("Not Allowed"); }

            lectVideo = await LectureVideo.findByIdAndUpdate(req.params.id, { $set: newvideo }, { new: true })

            res.json({ lectVideo });
        } 
        catch (err) 
        {
            console.error(err.message);
            res.status(500).send("Some error occured")
        }

    }
);

/************************************************************************************************** */

router.delete('/delete/:id', fetchTeacher,



    async function(req, res) 
    {


        try 
        {

            let lectVideo = await LectureVideo.findById(req.params.id);

            if (!lectVideo) { return res.status(404).send("Not Found"); }
            if (lectVideo.instructor.toString() !== req.teacher.id) { return res.status(404).send("Not Allowed"); }

            lectVideo = await LectureVideo.findByIdAndDelete(req.params.id)

            res.json({ Success: "Deleted" });
        } 
        catch (err) 
        {
            console.error(err.message);
            res.status(500).send("Some error occured")
        }

    }
);


/************************************************************************************************** */

router.delete('/deletebyadmin/:id', fetchAdmin,



    async function(req, res) 
    {


        try 
        {

            let lectVideo = await LectureVideo.findById(req.params.id);

            if (!lectVideo) { return res.status(404).send("Not Found"); }
            
            lectVideo = await LectureVideo.findByIdAndDelete(req.params.id)

            res.json({ Success: "Deleted" });
        } 
        catch (err) 
        {
            console.error(err.message);
            res.status(500).send("Some error occured")
        }

    }
);

/************************************************************************************************ */



module.exports = router;

