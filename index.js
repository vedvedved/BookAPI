require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

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

OurApp.get("/", (request,response) =>{
  response.json({message: "Server working!"});
});


//Route    -/book
//des      - to get all books
//Access   -public 
//Method   -GET  
//params   -none
//body     -none

OurApp.get("/book", async (req, res) => {
  const getAllBooks = await Book.find();
  return res.json(getAllBooks);
});

//Route    -/book/:bookID
//des      - to get a book based on ISBN
//Access   -public 
//Method   -GET  
//params   -bookID
//body     -none

OurApp.get("/book/:bookID",async (req,res) =>{
  const getSpecificBook = await Book.findOne({ISBN:req.params.bookID})
  if(!getSpecificBook){
    return res.json({
      error: 'No book found for the ISBN of ${req.params.bookID',
    });
  }
    return res.json({book: getSpecificBook});
});

//Route    -/book/c/:category
//des      - to get a book based on category
//Access   -public 
//Method   -GET  
//params   -category
//body     -none

OurApp.get("/book/c/:category",(req , res) => {
  const getBook = Database.Book.filter((book) => 
    book.category.includes(req.params.category)
  );
  return res.json({ book: getBook});
});

//Route    -/book/a/u/:author
//des      - to get a book based on author
//Access   -public 
//Method   -GET  
//params   -author                           to be done 
//body     -none

OurApp.get("/book/a/u/:authors",(req , res) => {
  const getBook = Database.Book.filter((book) => 
    book.authors.includes(parseInt(req.params.author))
  );
  return res.json({ book: getBook});
});
   
//=========== AUTHOR GET ===============================================


//Route    -/author
//des      - to get all authors
//Access   -public 
//Method   -GET  
//params   -none
//body     -none

OurApp.get("/author", (req, res) => {
  return res.json({author: Database.Author });
});

//Route    -/author/:id
//des      - to get a author based on authorID
//Access   -public 
//Method   -GET  
//params   -authorID
//body     -none

OurApp.get("/author/:id",(req,res) =>{
  const getAuthor = Database.Author.filter(
    (author) => author.id === req.params.id
    );
    return res.json({author: getAuthor});
});


// ============== POST ==================
//Route      /book/new
//Des        add new book
//Access     PUBLIC
//Params     None 
//Method     POST
OurApp.post("/book/new", async (req,res) =>{
  try{
    const{newBook} = req.body;
    await Book.create(newBook);
    return res.json ({message: 'Book added to database'});
  }catch(error){
    return res.json({error : error.message})
  }  
});

//Route      /author/new
//Des        add new author
//Access     PUBLIC
//Params     None 
//Method     POST
OurApp.post("/author/new" , (req,res) =>{
  const {newAuthor} = req.body;

  console.log(newAuthor);
  return res.json({message: "Author added"});
});

//Route      /publication/new
//Des        add new publication
//Access     PUBLIC
//Params     None 
//Method     POST

OurApp.post("/publication/new" , (req,res) => {
  const {newPublication} = req.body;
  console.log(newPublication);
  return res.json({message: "Publication added"})
});



//Route            /book/update
//Descrption       update any details of the book
//Access           PUBLIC
//Params           ISBN 
//Method           PUT
OurApp.put("/book/update/:isbn" , (req,res) => {
  const {updatedBook} = req.body;
  const{isbn} = req.params;

  const book = Database.Book.map((book) => {
    if(book.ISBN === isbn){
      return {...book, ...updatedBook};
    }
    return book;
  });

  return res.json(book);
});

//Route     /book/updateTitle
//Descrip   update title of a book
//Access    PUBLIC
//params    isbn
//Method    PUT

OurApp.put ("/book/updateTitle/:isbn", (req, res) =>{
  const { updatedBook} = req.body;
  const {isbn} = req.params;

  Database.Book.forEach((book) => {
    if (book.ISBN === isbn) {
      book.title = updatedBook.title;
      return book;
    }
    return book ;
  });
  return res.json(Database.Book);
});


//route          /bookAuthor/update/:isbn
//description    update/add new author to a book
//access         public
//params         isbn
//method         PUT

OurApp.put("/book/updateAuthor/:isbn" , (req,res) => {
const {newAuthor} = req.body;
const {isbn} = req.params;

//updating book database object
Database.Book.forEach((book) => {
  //check if ISBN match 
  if (book.ISBN === isbn){
    // check if author already exist
    if(!book.authors.includes(newAuthor)){
      //if not, then push new author
      book.authors.push(newAuthor);
      return book;
    }


    // else return 
    return book;
  }
  return book;
});

//updating author Database object
Database.Author.forEach((author) => {
  // check if author id match
  if (author.id === newAuthor){
    //check if book already exists
    if(!author.books.includes(isbn)){
      //if not, then push new book
      author,books.push(isbn);
      return author;
    }

    //else return
    return author;
  }
  return author;
});
return res.json({book : book , author : author});

});



// ======= TASK : author update  ===========

//route   /author/update/:id
//descrp  update any details of the author
//access  public
//params  id
//method  PUT

OurApp.put ("/author/update/:id" , (req,res) =>{
  const {updateAthor} = req.body;
  const{id} = req.params;
   
  const author = Database.Author.map((author) => {
    if(author.id === parseInt (id)){
      return {...author, ...updateAthor}
    }
    return author;
  });

  return res.json(author);

});


//========= Task : update author name=============
//route    /author/updateName
//decrip   update name of the author
//access   public
//params   id
//Method   PUT
//params in req.body are always in string format



//=============  DELETE REQUESTS ========================== 

//route        /book/delete/:isbn
//descrip     deleet a book
//access       public
//params       isbn
//Method       DELETE
OurApp.delete("/book/delete/:isbn" ,  (req , res) =>{
  const {isbn} = req.params;
  const filteredBooks = Database.Book.filter((book) => book.ISBN !== isbn);
  Database.Book = filteredBooks;
  return res.json(Database.Book);
});


//route         /book/delete/author/:isbn/:id
//descrip       to delete an author from a book
//access        public
//params        id, isbn
//Method        DELETE

OurApp.delete("/book/delete/author/:isbn/:id" , (req,res) =>{
  const{isbn ,id} = req.params;

  //updating book database objct
  Database.Book.forEach((book) =>{
    if (book.ISBN === isbn) {
      if(!book.authors.includes(parseInt(id))){
        return ;
        
      }
      book.authors = book.authors.filter((DatabaseID) => DatabaseID !== parseInt(id));
      return book;
    }
    return book;
  });
  Database.Author.forEach((author) =>{
    if (author.id === parseInt(id)){
      if(!author.books.includes(isbn)){
        return ;
      }
      author.books.filter((book) =>book !== isbn);
      return author;
    }
    return author;
  });
  return res.json ({book: Database.Book , author: Database.Author});

});

//route        /author/delete/:id
//descrip      delete an author
//access       public
//params       id
//method       DELETE

 OurApp.delete("/author/delete/:id" , (req, res) =>{
   const {id}  = req.params;
   const filteredAuthors = Database.Author.filter((author) => author.id !==  parseInt(id));
  Database.Author = filteredAuthors;
  return res.json(Database.Author);
 });

 //route        /publication/delete/:id
//descrip      delete a publication
//access       public
//params       id
//method       DELETE
OurApp.delete("/publication/delete/:id" , (req, res) =>{
  const {id} = req.params;
  const filteredPub = Database.Publication.filter((pub) => pub.id !== parseInt(id));
  Database.Publication = filteredPub;
  return res.json(Database.Publication);
});

//route        /publication/delete/book/:isbn/:id
//descrip      delete a book from a publication
//access       public
//params       id, isbn
//method       DELETE
OurApp.delete("/publication/delete/book/:isbn/:id" , (req,res) =>{
  const {isbn,id} = req.params;
  Database.Book.forEach((book) =>{
    if(book.ISBN === isbn){
      book.publication = 0;
      return book;
    }
    return book;
  });

  Database.Publication.forEach((publication) =>{
    if (publication.id === parseInt(id)){      
      const filteredBooks = publication.books.filter(
        (book) => book !== isbn);
      publication.books = filteredBooks;
      return publication;
    }
    return publication;
  });
  return res.json({book : Database.Book , publication: Database.publication});
});






OurApp.listen(4000,() => console.log("server is running!"));

