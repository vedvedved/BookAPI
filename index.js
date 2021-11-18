require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");


//Importing schemas
const Book = require('./schema/book');
const Author =require('./schema/author');
const Publication = require('./schema/publication');


//database
const Database = require("./database");
const BookModel = require("./schema/book");

 mongoose
   .connect(process.env.MONGO_URI,
       )
    .then(() => console.log("connection established!"))
    .catch((err) => {
      console.log(err);
    });


//initialization of express
const OurApp = express();

OurApp.use(express.json());

// Microservices
OurAPP.use("/book", Book);
OurAPP.use("/author", Author);
OurAPP.use("/publication", Publication);

OurApp.get("/", (request,response) =>{
  response.json({message: "Server working!"});
});

//root Route- localhost:4000/

OurApp.listen(4000,() => console.log("server is running!"));

