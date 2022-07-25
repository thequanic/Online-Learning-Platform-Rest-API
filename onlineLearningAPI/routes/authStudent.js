const express = require('express');
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);
const Student = require(`../models/Student`)
const { body, validationResult } = require(`express-validator`);
const fetchStudent = require(`../middleware/fetchStudent`);

const router = express.Router();

const jwt_secret = "thequanic_DevanshGoel_student";

/************************************************************************************************** */
//creating student
router.post('/createAccount',

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
            let student = await Student.findOne({ email: req.body.email });

            if (student) 
            {
                return res.json({ error: "Student with this email already exits" })
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);


            student = await Student.create(
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: secPass,
                    age:req.body.age,
                    phn_num:req.body.phn_num, 
                    profile_img:req.body.profile_img,
                    profile_bkgrnd:req.body.profile_bkgrnd
                }
            );

            const payload = {

                student: {
                    id: student.id
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

/******************************************************************************************** */
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
             
            let student = await Student.findOne({ email });

            if (!student) {
                return res.json({ error: "Please Enter Right Credentials" });
            }

            const comparePassword = await bcrypt.compare(password, student.password);

            if (!comparePassword) {
                return res.json({ error: "Please Enter Right Credentials" });
            }


            const payload = {

                student: {
                    id: student.id
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
//getting student from web token
router.post('/getStudent', fetchStudent,

    async function(req, res) {



        try 
        {

            const userId = req.student.id;
            let user1 = await Student.findById(userId).select("-password");
            res.send(user1);





        } 
        catch (err) {
            console.error(err.message);
            res.status(500).send("Some error occured");
        }



    });

/****************************************************************************************************** */
module.exports = router;