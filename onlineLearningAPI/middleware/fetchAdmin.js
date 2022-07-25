const jwt = require(`jsonwebtoken`);
const jwt_secret = "thequanic_DevanshGoel_admin";

const fetchAdmin = (req, res, next) => 
{
    const token = req.header(`auth-token`);
    //console.log(token);
    if (!token) 
    {
        res.status(401).send({ error: "Please authenticate " })
    }

    try 
    {
        const data = jwt.verify(token, jwt_secret);
        //console.log(data);
        req.admin = data.admin;
        //console.log(req.user);
        next();
    } 
    catch 
    {
        res.status(401).send({ error: "Please authenticate " })


    }
}

module.exports = fetchAdmin;