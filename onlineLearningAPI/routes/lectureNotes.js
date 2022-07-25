const express = require('express');
const teacherORadmin = require(`../middleware/teacherORadmin`);
const fetchTeacher = require(`../middleware/fetchTeacher`);
const fetchAdmin = require(`../middleware/fetchAdmin`);
const Chapter = require(`../models/Chapter`);
const Course = require(`../models/Course`);
const LectureNotes =require(`../models/LectureNotes`)
const router = express.Router();
const { body, validationResult } = require(`express-validator`);

/********************************************************************************************* */
router.get("/all/:chapter",async function(req,res)
{
    try
    {
        const lectNotes = await LectureNotes.find({chapter:req.params.chapter});
        res.json(lectNotes);
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

       
        body('course', 'ADD valid course').isLength({ min: 3 }),

        body('chapter', 'ADD valid chapter').isLength({ min: 3 }),
    ],

    async function(req, res) 
    {


        try 
        {
            const { title,course , chapter, note } = req.body;

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

            const lectNotes = new LectureNotes({
                title,
               
                course,
                chapter,
                note,
                instructor: req.teacher.id

            })

            const savednote = await lectNotes.save();

       
            res.json(savednote);
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
            const { title,  course,chapter,note } = req.body;

            const newnote = {};

            if (title) { newnote.title = title; }
           
            if (course) { newnote.course = course; }
            if (chapter) { newnote.chapter = chapter; }
            if (note) { newnote.note = note; }

            let lectNotes = await LectureNotes.findById(req.params.id);

            if (!lectNotes) { return res.status(404).send("Not Found"); }
            if (lectNotes.instructor.toString() !== req.teacher.id) { return res.status(404).send("Not Allowed"); }

            lectNotes = await LectureNotes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })

            res.json({ lectNotes });
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

            let lectNotes = await LectureNotes.findById(req.params.id);

            if (!lectNotes) { return res.status(404).send("Not Found"); }
            if (lectNotes.instructor.toString() !== req.teacher.id) { return res.status(404).send("Not Allowed"); }

            lectNotes = await LectureNotes.findByIdAndDelete(req.params.id)

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

            let lectNotes = await LectureNotes.findById(req.params.id);

            if (!lectNotes) { return res.status(404).send("Not Found"); }
            
            lectNotes = await LectureNotes.findByIdAndDelete(req.params.id)

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

