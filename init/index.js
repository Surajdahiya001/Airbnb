const mongoose = require('mongoose');
const initdata = require('./data.js');
const listing = require('../models/listing.js');

main()
.then(() => {
    console.log("database connected")})
.catch((err) => {
    console.log(err)});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');}


  const initdb = async ()=>{

  await  listing.deleteMany({});
  initdata.data = initdata.data.map((obj)=>( { ...obj, owner : "67c218f555a95cda4608ee60"}));
  await listing.insertMany(initdata.data); 
  console.log("data saved");
  }

  initdb();