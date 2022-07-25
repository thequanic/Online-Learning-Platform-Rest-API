const express = require('express');
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);
const Admin = require(`../models/Admin`)
const { body, validationResult } = require(`express-validator`);
const fetchAdmin = require(`../middleware/fetchAdmin`);

const router = express.Router();

const jwt_secret = "thequanic_DevanshGoel_admin";

/********************************************************************************************* */
//creating admin
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
            let admin = await Admin.findOne({ email: req.body.email });

            if (admin) 
            {
                return res.json({ error: "Admin with this email already exits" })
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);


            admin = await Admin.create(
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

                admin: {
                    id: admin.id
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

/************************************************************************************************* */
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
             
            let admin = await Admin.findOne({ email });

            if (!admin) {
                return res.json({ error: "Please Enter Right Credentials" });
            }

            const comparePassword = await bcrypt.compare(password, admin.password);

            if (!comparePassword) {
                return res.json({ error: "Please Enter Right Credentials" });
            }


            const payload = {

                admin: {
                    id: admin.id
                }
            }

            const authToken = jwt.sign(payload, jwt_secret);

            res.json(authToken);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Some error occured");
        }



    });


 /************************************************************************************************* */   
  

//getting admin from web token
router.get('/getAdmin', fetchAdmin,

    async function(req, res) {



        try {

            const userId = req.admin.id;
            let user1 = await Admin.findById(userId).select("-password");
            res.send(user1);





        } catch (err) {
            console.error(err.message);
            res.status(500).send("Some error occured");
        }



    });

/************************************************************************************************* */

module.exports = router;