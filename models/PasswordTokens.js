const knex = require("../database/connection");
const User = require("./User");

class PasswordTokens {

    async create(email){
        const user = await User.findByEmail(email);
        console.log(user);

        if(user != undefined){

            try{
                const token = Date.now();

                await knex.insert({
                    id_user: user.result[0].id_user,
                    used: 0,
                    token: token
                }).table("password_tokens");
                return {status : true, token}
            }catch(err){
                console.log(err);
                return {status: false, err: err};
            }

        }else{
            return {status: false, err: "O e-mail passado não existe no banco de dados"};
        }
    }

   


    async validate(token){
        try{
            const result = await 
            knex
            .select()
            .where({token: token})
            .table("password_tokens");
            if(result.length > 0){
                const tk = result[0];
                console.log(tk);
                if(tk.used){
                    return {status: false};
                }else{
                    return {status: true, token: tk};
                }
            }else{
                return {status: false};
            }

        }catch(err){
            console.log(err);
            return {status: false};
        }

    }

    async setUsed(token){
        await 
        knex
        .update({used: 1})
        .where({token: token})
        .table("password_tokens");
    }

}

module.exports = new PasswordTokens();