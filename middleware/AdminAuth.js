const jwt = require("jsonwebtoken");
const secret = "ftyhjsryjdtu74747r7ry8nkyunhj746,y90´0´0=98596";

module.exports = 

function(req, res, next){
    const authtoken = req.headers['authorization'];
    if(authtoken != undefined){
        const bearer = authtoken.split(' ');
        var token = bearer[1];
        try{
            var decoded = jwt.verify(token, secret);
            console.log(decoded.role_user);
            if(decoded.role_user === 1){
                next();
            }else{
                res.status(403);
                res.send("Você não tem permissão para isso");
                return;
            }
        }catch(err){
            res.status(403);
            res.send("Você não está autenticado");
            return;
        }

    }else{
        res.status(403);
        res.send("Você não está autenticado");
        return;
    }
}