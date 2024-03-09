const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let uservalid = users.filter((user)=>{
    return user.username === username
  });
  if(uservalid.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validarusers = users.filter((user)=>{
        return(user.username === username && user.password === password)
    });
    if(validarusers.length > 0){
        return true
    }else{
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(404).json({message: "Error logging in"})
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data: password
    },'access',{expiresIn: 60*60});
    req.session.authorization ={
        accessToken,username
    }
    return res.status(200).send(`${username} successfully logged in`)
  }else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const reseña = books[isbn]['reviews']
        
    if(!books[isbn]){
        return res.status(404).send("isbn not exist")
    }
    const validReview = reseña.findIndex(review => review.user === username )
    

    if(validReview !== -1){
        reseña[validReview].review = req.body.review;
        return res.status(200).json({message: `The user ${username} has updated their review form ISBN ${isbn}`})
    }else{
        
        const newReview = {
            user: username,
            review: req.body.review
        };
        reseña.push(newReview);
        
        res.send(`The user ${username} added a new review`)
    }
    
    
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if(!books[isbn]){
    return res.status(404).send("isbn not exist")
}

 
  books[isbn]['reviews'] = books[isbn]['reviews'].filter(review => review.user !== username);

 
  return res.status(200).json({ message: `Reviews for ISBN ${isbn} by user ${username} have been deleted` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
