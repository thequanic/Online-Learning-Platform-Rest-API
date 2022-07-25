const express = require('express');
const fetchStudent = require(`../middleware/fetchStudent`);
const Student = require(`../models/Student`);
const Course = require(`../models/Course`);
const Enrollment = require(`../models/Enrollment`);
const router = express.Router();
const { body, validationResult } = require(`express-validator`);

/************************************************************************************************ */

router.get("/all", async function(req,res)
{
    try
    {
        const results= await Enrollment.find().populate({ path: "student", model: "student" }).populate({ path: "course", model: "course", select: "title" });

        res.json(results)
    }
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send("Some error occured")
    }
}
)

/************************************************************************************************ */

router.get("/allbystudent",fetchStudent, async function(req,res)
{
    try
    {
        const results= await Enrollment.find({student:req.student.id}).populate({ path: "course", model: "course" });

        res.json(results)
    }
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send("Some error occured")
    }
}
)



/************************************************************************************************ */

router.get("/check/:id",fetchStudent, async function(req,res)
{
    try
    {
        const results= await Enrollment.find({student:req.student.id, course:req.params.id}).populate({ path: "course", model: "course" });

        res.json(results)
    }
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send("Some error occured")
    }
}
)
/************************************************************************************************ */

router.post("/add",fetchStudent,async function(req,res)
{
    try
    {
            let result = await Enrollment.findById(req.params.id);

            if (!result) { return res.status(404).send("Not Found"); }
            if (result.student.toString() !== req.student.id) { return res.status(404).send("Not Allowed"); }

            result = await Enrollment.findByIdAndDelete(req.params.id)

            res.json({ Success: "Deleted" });
    }
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send("Some error occured")
    }
}
)

/************************************************************************************************ */

router.delete("/delete/:id",fetchStudent,async function(req,res)
{
    try
    {
            let result = await Enrollment.findById(req.params.id);

            if (!result) { return res.status(404).send("Not Found"); }
            if (result.student.toString() !== req.student.id) { return res.status(404).send("Not Allowed"); }

            result = await Enrollment.findByIdAndDelete(req.params.id)

            res.json({ Success: "Deleted" });
    }
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send("Some error occured")
    }
}
)

module.exports = router;