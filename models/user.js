const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoos = require("passport-local-mongoose");
const { schema } = require("./review");

const Userschema = new Schema ({

email :{
    type :String,
    required :true,
}
})

Userschema.plugin(PassportLocalMongoos);
module.exports = mongoose.model("User",Userschema);