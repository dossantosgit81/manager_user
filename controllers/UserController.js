const User = require("../models/User");
const PasswordToken = require("../models/PasswordTokens");

class UserController{
    
    async index(req, res){
        const users = await User.findAll();

        res.json(users);
    }

    async findUser(req, res){
        const id = req.params.id;
        const user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({err: "Usuario não encontrado"});
        }else{
            res.status(200);
            res.json(user);
        }
    }

    async create(req, res){
        const {name_user, email_user, password_user} = req.body;
        
        if(email_user == undefined){
            await this.validation("O email é invalido");
        }else if(name_user == undefined){
            await this.validation("O nome de usuario é invalido");
        } else if(password_user == undefined){
            await this.validation("Senha invalida");
        }

        const emailExists = await User.findEmail(email_user);

        if(emailExists){
           res.status(406);
           res.json({err: "O e-mail já está cadastrado!"});
           return;
        }

        await User.new(name_user, email_user, password_user);
        
        res.status(200);
        res.send("Tudo ok");
    }

   async validation(message){
        res.status(403);
        res.json({err: message});
        return;
    }

    async edit(req, res){
        let {id_user, name_user, email_user, role_user} = req.body;
        let result = await User.update(id_user, name_user, email_user, role_user);
        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo OK!");
            }else{
                res.status(406);
                res.send(result.err);
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req, res){
        const id = req.params.id;

        const result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send("Tudo OK");
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    async recoverPassword(req, res){
        const email = req.body.email_user;

        const result = await PasswordToken.create(email);

        if(result.status){
            res.status(200);
            res.send("" + result.token);
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

}

 module.exports = new UserController();