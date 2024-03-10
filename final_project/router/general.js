const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username === "" && password === ""){
    return res.status(404).json({message: "User and password not provided!"})
  }else if(username === ""){
    return res.status(404).json({message: "User not provided!"})
  }else if(password === ""){
    return res.status(404).json({message: "Password not provided!"})
  }else{
    if(username && password){
        if(!isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message:"User successfully registred. Now you can login"})
        }else{
            return res.status(404).json({message: `${username} already exists!`}); 
        }
      }
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

function getBookList(){
   let myPromise = new Promise((resolve, reject) =>{
      setTimeout(()=>{
        resolve(books);
      }, 10000)
   })
   return myPromise
}


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const bookList = await getBookList();
    return res.status(200).send(JSON.stringify(bookList,null,4))
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    if(!books[isbn]){
      return res.status(400).json({message: "ibsn not exist"})
    }
    return res.status(200).send(books[isbn])
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
 

 /* if(books[isbn]){
    return res.status(200).send(books[isbn])
  }
    return res.status(400).json({message: "ibsn not exist"});*/
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author
    const booksArray = Object.values(books);
    let filter_author = booksArray.filter((books => books.author === author));
    if(filter_author.length >0){
        return res.status(200).send(filter_author)
    }
    
  return res.status(404).json({message: `the Author ${author} not found`});
    
  } catch (error) {
    
    return res.status(500).json({ message: "Internal Server Error" });
  }
   
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title
  const booksArray = Object.values(books);
  let filterTitle = booksArray.filter((books)=> books.title === title)
  if(filterTitle.length > 0){
    return res.status(200).send(filterTitle)
  }
  
  return res.status(404).json({message: `the title ${title} not found`});
    
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    const reseña = books[isbn]
   
    if(reseña && reseña.reviews){
        const views = reseña.reviews
        return res.status(200).send(views)
    }else{
        return res.status(404).json({message: "ibsn not exist"});
    }    

    
  
});




module.exports.general = public_users;