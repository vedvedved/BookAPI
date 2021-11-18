const Router = require("express").Router();

const BookModel = require("../schema/book");
const AuthorModel = require("../schema/author");


// Route            - /book  
// Des              - to get all books
// Access           - Public ie. publically accessible
// Method           - GET
// Parameter/params - none
// Body             - none
Router.get("/book", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});


// Route            - /book/:bookID
// Des              - to get a book based on ISBN
// Access           - Public 
// Method           - GET
// Parameter/params - bookID
// Body             - none
Router.get("/book/:bookID", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({
        ISBN: req.params.bookID,
    });
    if (!getSpecificBook) {
        return res.json({
            error: `No book found fot the ISBN of ${req.params.bookID}`,
        });
    }

    return res.json({ book : getSpecificBook });
});


// Route            - /book/c/:category
// Des              - to get a list of all books based on category
// Access           - Public 
// Method           - GET
// Parameter/params - category
// Body             - none
Router.get("/book/c/:category", async (req, res) => {
    const getSpecificBooks = await BookModel.findOne({
        category: req.params.category,
    });

    if (!getSpecificBooks) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }

    return res.json({ books: getSpecificBooks });
});


//Route           /book/author/:id
//Description      to get list of books based on author
//Access           PUBLIC
//Parameter        id
//Method           GET

Router.get("/author/:id", async (req, res) => {
  const getSpecificBook = await BookModel.find({ authors: req.params.id });
  //if  book not present
  if (!getSpecificBook) {
    return res.json({
      error: `Books of author(author id:${req.params.id}) not found`,
    });
  }

  return res.json(getSpecificBook);
});


// Route            - /book/new
// Des              - to add new book
// Access           - Public 
// Method           - POST
// Parameter/params - none
Router.post("/book/new", async (req, res) => {
    try {
        const { newBook } = req.body;

        await BookModel.create(newBook);
        return res.json({ message: "Book added to the database" });
    } catch (error) {
        return res.json({ error: error.message });
    }
});


//Route             - /book/updateTitle
// Des              - to update book title
// Access           - Public 
// Method           - PUT
// Parameter/params - ISBN
Router.put("/book/updateTitle/:isbn", async (req, res) => {
    const { title } = req.body.title;

    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            title: title,
        },
        {
            new: true,
        }
    );

    return res.json({ book: updateBook });
});

//Route             - /book/updateAuthor/:ISBN
// Des              - to update/add new author
// Access           - Public 
// Method           - PUT
// Parameter/params - ISBN
Router.put('/book/updateAuthor/:isbn', async (req,res) => { 
    const {newAuthor} = req.body;
    const {isbn} = req.params;

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn,
        },
        {
            $addToSet: {
                authors: newAuthor,
            },
        },
        {
            new: true,
        }
    );

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: newAuthor,
        },
        {
            $addToSet: {
                books: isbn,
            },
        },
        {
            new: true,
        }
    );

    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "New author was added into the database",
    });
});


//Route             - /book/delete/:ISBN
// Des              - to delete a book
// Access           - Public 
// Method           - DELETE
// Parameter/params - isbn
Router.delete("/book/delete/:isbn", async (req, res) => {
    const { isbn } = req.params;

    const updateBookDatabase = await BookModel.findOneAndDelete({
        ISBN: isbn,
    });

    return res.json({ books: updateBookDatabase });
});


//Route             - /book/deleter/author
// Des              - to delete an author from a book
// Access           - Public 
// Method           - DELETE
// Parameter/params - isbn , id
Router.delete('/book/delete/author/:isbn/:id', async (req, res) => {
    const {isbn , id} = req.params;

    //updating book database object
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn,
        },
        {
            $pull: {
                authors: parseInt(id),
            },
        },
        {
            new: true,
        }
    );

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(id),
        },
        {
            $pull: {
                books: isbn,
            },
        },
        {
            new: true,
        }
    );

    return res.json({
        message: "Author was deleted",
        book: updatedBook,
        author: updatedAuthor,
    });
});

module.exports = Router;