const express = require('express');
const fetchAdmin = require(`../middleware/fetchAdmin`);
const fetchTeacher = require(`../middleware/fetchTeacher`);
const Course = require(`../models/Course`);
const router = express.Router();
const { body, validationResult } = require(`express-validator`);


/********************************************************************************************* */
router.get("/all",async function(req,res)
{
    try
    {
        const course = await Course.find();
        res.json(course);
    }
    catch(error)
    {
        console.error(err.message);
        res.status(500).send("Some error occured");
    }
})

/********************************************************************************************* */
router.get("/allbyteacher",fetchTeacher,async function(req,res)
{
    try
    {
        const course = await Course.find({instructor:req.teacher.id});
        res.json(course);
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

        body('category', 'ADD valid category').isLength({ min: 3 }),
    ],

    async function(req, res) 
    {


        try 
        {
            const { title, description, course_img, category } = req.body;

            const error = validationResult(req);


            if (!error.isEmpty()) {
                return res.status(400).json({ error: error.array() });
            }

            const course = new Course({
                title,
                description,
                course_img,
                category,
                instructor: req.teacher.id

            })

            const savedcourse = await course.save();

       
            res.json(savedcourse);
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
            const { title, description, course_img,category } = req.body;

            const newcourse = {};

            if (title) { newcourse.title = title; }
            if (description) { newcourse.description = description; }
            if (course_img) { newcourse.course_img = course_img; }
            if (category) { newcourse.category = category; }

            let course = await Course.findById(req.params.id);

            if (!course) { return res.status(404).send("Not Found"); }
            if (course.instructor.toString() !== req.teacher.id) { return res.status(404).send("Not Allowed"); }

            course = await Course.findByIdAndUpdate(req.params.id, { $set: newcourse }, { new: true })

            res.json({ course });
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

            let course = await Course.findById(req.params.id);

            if (!course) { return res.status(404).send("Not Found"); }
            if (course.instructor.toString() !== req.teacher.id) { return res.status(404).send("Not Allowed"); }

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


module.exports = router;

