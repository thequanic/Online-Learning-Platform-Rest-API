const express = require('express');
const teacherORadmin = require(`../middleware/teacherORadmin`);
const fetchTeacher = require(`../middleware/fetchTeacher`);
const fetchAdmin = require(`../middleware/fetchAdmin`);
const Chapter = require(`../models/Chapter`);
const Course = require(`../models/Course`);
const router = express.Router();
const { body, validationResult } = require(`express-validator`);

/********************************************************************************************* */
router.get("/all/:course",async function(req,res)
{
    try
    {
        const chapter = await Chapter.find({course:req.params.course});
        res.json(chapter);
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
    ],

    async function(req, res) 
    {


        try 
        {
            const { title, description,course } = req.body;

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

            const chapter = new Chapter({
                title,
                description,
                course,
                instructor: req.teacher.id

            })

            const savedchapter = await chapter.save();

       
            res.json(savedchapter);
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
            const { title, description, course } = req.body;

            const newchapter = {};

            if (title) { newchapter.title = title; }
            if (description) { newchapter.description = description; }
            
            if (course) { newchapter.course = course; }

            let chapter = await Chapter.findById(req.params.id);

            if (!chapter) { return res.status(404).send("Not Found"); }
            if (chapter.instructor.toString() !== req.teacher.id) { return res.status(404).send("Not Allowed"); }

            chapter = await Chapter.findByIdAndUpdate(req.params.id, { $set: newchapter }, { new: true })

            res.json({ chapter });
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

            let chapter = await Chapter.findById(req.params.id);

            if (!chapter) { return res.status(404).send("Not Found"); }
            if (chapter.instructor.toString() !== req.teacher.id) { return res.status(404).send("Not Allowed"); }

            chapter = await Chapter.findByIdAndDelete(req.params.id)

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

            let course = await Course.findById(req.params.id);

            if (!course) { return res.status(404).send("Not Found"); }
            
            course = await Course.findByIdAndDelete(req.params.id)

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

