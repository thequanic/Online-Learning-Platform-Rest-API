const express = require('express');
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);
const Teacher = require(`../models/Teacher`)
const { body, validationResult } = require(`express-validator`);
const fetchTeacher = require(`../middleware/fetchTeacher`);

const router = express.Router();

const jwt_secret = "thequanic_DevanshGoel_teacher";

/********************************************************************************************** */
//creating teacher
router.post('/create',

    [
        body('name', 'Enter valid name').isLength({ min: 3 }),
        body('email', 'Enter valid email id').isEmail(),
        body('password', 'Enter password atleast 8 characters long').isLength({ min: 8 })
    ],

    async function(req, res) {

        const error = validationResult(req);


        if (!error.isEmpty()) 
        {
            return res.status(400).json({ error: error.array() });
        }

        try 
        {
            let teacher = await Teacher.findOne({ email: req.body.email });

            if (teacher) 
            {
                return res.json({ error: "Teacher with this email already exits" })
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);


            teacher = await Teacher.create(
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: secPass,
                    age:req.body.age,
                    phn_num:req.body.phn_num,
                    profession:req.body.profession,
                    highestEducation:req.body.highestEducation, 
                    profile_img:req.body.profile_img,
                    profile_bkgrnd:req.body.profile_bkgrnd
                }
            );

            const payload = {

                teacher: {
                    id: teacher.id
                }
            }

            const authToken = jwt.sign(payload, jwt_secret);

            res.json(authToken);


        } 
        catch (err) 
        {
            console.error(err.message);
            res.status(500).send("Some error occured");
        }


    }
    
);

/********************************************************************************************* */
//login
router.post('/login',

    [

        body('email', 'Enter valid email id').isEmail(),
        body('password', 'Empty Password').exists()
    ],

    async function(req, res) {

        const error = validationResult(req);


        if (!error.isEmpty()) 
        {
            return res.status(400).json({ error: error.array() });
        }

        try 
        {

            const {email,password} = req.body;
             
            let teacher = await Teacher.findOne({ email });

            if (!teacher) {
                return res.json({ error: "Please Enter Right Credentials" });
            }

            const comparePassword = await bcrypt.compare(password, teacher.password);

            if (!comparePassword) {
                return res.json({ error: "Please Enter Right Credentials" });
            }


            const payload = {

                teacher: {
                    id: teacher.id
                }
            }

            const authToken = jwt.sign(payload, jwt_secret);

            res.json(authToken);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Some error occured");
        }



    });


/***************************************************************************************************** */
//getting teacher from web token
router.post('/get', fetchTeacher,

    async function(req, res) {



        try {

            const userId = req.teacher.id;
            let user1 = await Teacher.findById(userId).select("-password");
            res.send(user1);





        } catch (err) {
            console.error(err.message);
            res.status(500).send("Some error occured");
        }



    });

/*************************************************************************************************** */
module.exports = router;