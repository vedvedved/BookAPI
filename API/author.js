const Router = require("express").Router();
const AuthorModel = require("../schema/author");

// Route            - /author
// Des              - to get all authors 
// Access           - Public 
// Method           - GET
// Parameter/params - none
// Body             - none
Router.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});


//Route           /author/:ID
//Description      to get specific author based on id
//Access           PUBLIC
//Parameter        ID
//Method           GET

Router.get("/:ID", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({ id: req.params.ID });
  //if  author not present
  if (!getSpecificAuthor) {
    return res.json({ error: "Author not found" });
  }

  return res.json(getSpecificAuthor);
});


//Route           /author/book/:isbn
//Description      to get list of authors based on a book
//Access           PUBLIC
//Parameter        isbn
//Method           GET

Router.get("/book/:isbn", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.find({ books: req.params.isbn });
  //if  author not present
  if (!getSpecificAuthor) {
    return res.json({
      error: `Authors of book(${req.params.isbn}) not found`,
    });
  }

  return res.json(getSpecificAuthor);
});


// Route            - /author/new
// Des              - to add new author
// Access           - Public 
// Method           - POST
// Parameter/params - none
Router.post("/author/new", (req,res) => {
    const {newAuthor} = req.body;

    AuthorModel.create(newAuthor);

    return res.json({ message: "Author added to the database" });
});


// TODO Student task
//Route             - /author/update/:id
// Des              - update any details of the author
// Access           - Public 
// Method           - PUT
// Parameter/params - id
//params in the req.body are always in string format
Router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { authorName } = req.body;
    const UpdateAuthor = await AuthorModel.findOneAndUpdate(
      {
        id: parseInt(id),
      },
      {
        name: authorName,
      },
      {
        new: true,
      }
    );
    return res.json({ author: UpdateAuthor, message: "Author name updated" });
  });



//Route             - /author/delete
// Des              - to delete an author 
// Access           - Public 
// Method           - DELETE
// Parameter/params - id
Router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const updatedAuthorDatabase = AuthorModel.findOneAndDelete({
    id: parseInt(id),
  });
  return res.json({
    authors: updatedAuthorDatabase,
    message: `author (id:${id}) successfully deleted`,
  });
});


module.exports = Router;