const jwt = require(`jsonwebtoken`);
const jwt_secret1 = "thequanic_DevanshGoel_teacher";
const jwt_secret2 = "thequanic_DevanshGoel_admin";

const teacherORadmin=(req,res,next)=>
{
    const token = req.header(`auth-token`);
    //console.log(token);
    if (!token) 
    {
        res.status(401).send({ error: "Please authenticate " })
    }

    try
    {
        const data1 = jwt.verify(token, jwt_secret1);
        


        next()
       
    }
    catch 
    {
        try
        {
            const data2 = jwt.verify(token, jwt_secret2);
        


            next()
       
        }
        catch 
        {
            console.log("error")
            res.status(401).send({ error: "Please authenticate " })


        }



    }


}

module.exports=teacherORadmin;