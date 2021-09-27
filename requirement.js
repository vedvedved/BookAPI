/*

Requirements
Book
 - ISBN             - String
 - Title            - String
 - Author           - [Number]
 - Language         - String
 - Publications     - Number
 - NumOfPages       - Number
 - Categories       - [String]
Author
 - id               - Number
 - name             - String
 - books            - [String]
Publications
 - id               - Number
 - name             - String
 - books            - [String]


--------APIs--------

Books

- GET 
-to get all books [DONE]
-to get specific books [DONE]
-to get a list of books based on category [DONE]
-to get a list of books based on author [task]

-POST
-to add new book  [DONE]

-PUT
-to update book details [DONE]
-to update/add new author [DONE]

-DELETE
-to delete a book   [DONE]
-to delete an author from the book [DONE]

Authors

-GET
  -to get all authors  [DONE]
  -to get specific author   [task]
  -to get list of author based on a book

-POST
  -to add new author [DONE]
  -to update/add new book

-PUT
   - update author details [DONE]

-DELETE
  -delete an author [DONE]


Publication 
-GET  [task]
  -to get all publications
  -to get specific publication
  -to get a list of publication based on a book

-POST
  -add new publication [DONE]

-PUT
  -update publication
  -to update/add new book

-DELETE 
  -delete a book from publication [DONE]
  -delete a publication 

*/