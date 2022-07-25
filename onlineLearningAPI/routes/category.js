const express = require('express');
const teacherORadmin = require(`../middleware/teacherORadmin`);
const Category = require(`../models/Category`);
const router = express.Router();
const { body, validationResult } = require(`express-validator`);

/********************************************************************************************* */
router.get("/all",async function(req,res)
{
    try
    {
        const category = await Category.find();
        res.json(category);
    }
    catch(error)
    {
        console.error(err.message);
        res.status(500).send("Some error occured");
    }
})

/*********************************************************************************************** */
router.post("/add",teacherORadmin,

[body('categoryName',"Enter Valid Category").isLength({min:2})],

async function(req,res)
{

    const {categoryName} =req.body;
    const error = validationResult(req);


    if (!error.isEmpty()) 
    {
        return res.status(400).json({ error: error.array() });
    }


    try
    {

        const category = await Category.findOne({categoryName:categoryName});
        if (category) 
        {
            console.log(category)
            return res.json({ error: "This category already exits" })
        }

        const newcat=new Category(
            {
                categoryName
            }
        )

        const savedcat= await newcat.save();

        res.json(savedcat);
    }
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send("Some error occured")
    }
})

/*********************************************************************************************** */

router.delete('/delete/:id', teacherORadmin,



    async function(req, res) {


        try {

            let cat = await Category.findByIdAndDelete(req.params.id);

            if (!cat) { return res.status(404).send("Not Found"); }
            

            res.json({ Success: "Deleted" });
        } 
        catch (err) 
        {
            console.error(err.message);
            res.status(500).send("Some error occured")
        }

    });


module.exports=router