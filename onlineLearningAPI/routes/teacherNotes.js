const express = require('express');
const fetchTeacher = require(`../middleware/fetchTeacher`);
const TeacherNotes = require(`../models/TeacherNotes`);
const router = express.Router();
const { body, validationResult } = require(`express-validator`);

router.get('/all', fetchTeacher, async function(req, res) {

    try 
    {
        const notes = await TeacherNotes.find({ teacher: req.teacher.id });
        res.json(notes);
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send("Some error occured")
    }

});

/************************************************************************************************ */


router.post('/add', fetchTeacher,

    [
        body('title', 'Title valid name').isLength({ min: 3 }),

        body('description', 'Enter description atleast 8 characters long').isLength({ min: 5 })
    ],

    async function(req, res) {


        try {
            const { title, description, tag } = req.body;

            const error = validationResult(req);


            if (!error.isEmpty()) {
                return res.status(400).json({ error: error.array() });
            }

            const note = new TeacherNotes({
                title,
                description,
                tag,
                teacher: req.teacher.id

            })

            const savedNote = await note.save();



            //  const notes = await TeacherNotes.find({ teacher: req.teacher.id });
            res.json(savedNote);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Some error occured")
        }

    }
);

/****************************************************************************************************** */

router.put('/update/:id', fetchTeacher,



    async function(req, res) 
    {


        try 
        {
            const { title, description, tag } = req.body;



            const newnote = {};

            if (title) { newnote.title = title; }
            if (description) { newnote.description = description; }
            if (tag) { newnote.tag = tag; }

            let note = await TeacherNotes.findById(req.params.id);

            if (!note) { return res.status(404).send("Not Found"); }
            if (note.teacher.toString() !== req.teacher.id) { return res.status(404).send("Not Allowed"); }

            note = await TeacherNotes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })

            res.json({ note });
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

            let note = await TeacherNotes.findById(req.params.id);

            if (!note) { return res.status(404).send("Not Found"); }
            if (note.teacher.toString() !== req.teacher.id) { return res.status(404).send("Not Allowed"); }

            note = await TeacherNotes.findByIdAndDelete(req.params.id)

            res.json({ Success: "Deleted" });
        } 
        catch (err) 
        {
            console.error(err.message);
            res.status(500).send("Some error occured")
        }

    });



module.exports = router;