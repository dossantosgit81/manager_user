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

}

module.exports = new PasswordTokens();