const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordTokens = require("../models/PasswordTokens");

class User{

    async findAll(){
        try{
            var result = await knex.select(["id_user", "email_user", "name_user", "role_user"])
            .table("users");
            return result;
        }catch(err){
            console.log(err);
            return[];
        }
    }

    async findById(id){
        try{
            var result = await knex.select(["id_user", "email_user", "name_user", "role_user"])
            .where({id_user: id})
            .table("users");
            
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }

        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    async new(name_user, email_user, password_user){
        try{

            const hash = await bcrypt.hash(password_user, 10);

            await knex
            .insert({name_user, email_user, password_user:hash, role_user: 0})
            .table("users");
        }catch(err){
            console.log(err);
        }

    }

    async findEmail(email){
        try{
           const result = await knex
            .select("*")
            .from("users").where({email_user: email});
           if(result.length > 0){
                return true;
           }else{
               return false;
           }
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async findByEmail(email){
        try{
           const result = await knex
            .select("*")
            .from("users").where({email_user: email});
           if(result.length > 0){
                return {status: true, result};
           }else{
               return false;
           }
        }catch(err){
            console.log(err);
            return false;
        }
    }


    async update(id, name, email, role){

        const user = await this.findById(id);

        console.log(" Deu o que? "+ user);

        if(user != undefined){

            var editUser = {};

            if(email != undefined){
                if(email != user.email){
                    const result = await this.findEmail(email);
                    if(result == false){
                        editUser.email_user = email;
                    }else{
                        return {status: false, err: "O e-mail já está cadastrado"};
                    }
                }
            }

            if(name != undefined){
                editUser.name_user = name;
            }

            if(role != undefined){
                editUser.role_user = role;
            }
            try{ 
                await 
                knex
                .update(editUser)
                .where({id_user: id})
                .table("users");
                return {status: true};
            }catch(err){
                console.log(err);
            }

        }else{
            return {status: false, err: "O usuario não existe"};
        }

    }

    async delete(id){
        const user = await this.findById(id);
        if(user != undefined){
            try{
                await
                knex.delete()
                .where({id_user: id})
                .table("users");
                return {status: true};
            }catch(err){
                console.log(err);
                return {status: false, err: err};
            }
        }else{
            return {status: false, err: "O usuario não existe, portanto não pode ser deletado."};
        }
    }

    
    async changePassword(newPassword, id, token){
        const hash = await bcrypt.hash(newPassword, 10);
        await 
        knex
        .update({password_user: hash})
        .where({id_user: id})
        .table("users");
        await PasswordTokens.setUsed(token);
    }

}

module.exports = new User();