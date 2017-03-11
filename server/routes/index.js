// modules required for routing
let express = require('express');
let router = express.Router();

let firebase = require('../config/firebase.js');
let firebaseDB = firebase.games;
let firebaseAdmin = firebase.admin;
let firebaseAuth = firebase.auth;

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    games: '',
    displayName: firebaseAuth.currentUser ? firebaseAuth.currentUser.displayName : ''
   });
});

/* GET contact page. */
router.get('/contact', (req, res, next) => {
  res.render('content/contact', {
    title: 'Contact',
    games: '',
    displayName: firebaseAuth.currentUser ? firebaseAuth.currentUser.displayName : ''
   });
});

// GET /login - render the login view
router.get('/login', (req, res, next)=>{
  // check to see if the user is not already logged in
  if(!req.user) {
    // render the login page
    res.render('auth/login', {
      title: "Login",
      games: '',
      messages: req.flash('loginMessage'),
      displayName: firebaseAuth.currentUser ? firebaseAuth.currentUser.displayName : ''
    });
    return;
  } else {
    return res.redirect('/games'); // redirect to games list
  }
});

// POST /login - process the login attempt
router.post('/login', (req, res, next) => {

  firebaseAuth.signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(()=>{
      return res.redirect('/games');
    })
    .catch((err) => {
      let errorCode = err.code;
      let errorMessage = err.message;
      if(errorCode == 'auth/wrong-password') {
        req.flash('loginMessage', 'Incorrect Password');
      }
      if(errorCode == 'auth/user-not-found') {
        req.flash('loginMessage', 'Incorrect Username');
      }

      return res.render('auth/login', {
          title: "Login",
          games: '',
          messages: req.flash('loginMessage'),
          displayName: firebaseAuth.currentUser ? firebaseAuth.currentUser.displayName : ''
        });
    });
});

// GET /register - render the registration view
router.get('/register', (req, res, next)=>{
   // check to see if the user is not already logged in
  if(!firebaseAuth.currentUser) {
    // render the registration page
      res.render('auth/register', {
      title: "Register",
      games: '',
      messages: req.flash('registerMessage'),
      displayName: firebaseAuth.currentUser ? firebaseAuth.currentUser.displayName : ''
    });
    return;
  } else {
    return res.redirect('/games'); // redirect to games list
  }
});

// POST / register - process the registration submission
router.post('/register', (req, res, next)=>{

  firebaseAdmin.auth().createUser({
    email: req.body.email,
    emailVerified: true,
    password: req.body.password,
    displayName: req.body.displayName,
    disabled: false
  })
  .then((userRecord)=>{

      // sign user in after registration
      firebaseAuth.signInWithEmailAndPassword(req.body.email, req.body.password)
        .then(()=>{
          return res.redirect('/games');
        })
        .catch((err) => {
          console.log(err);
          return res. redirect('/login');
        });
    })
    .catch((err)=> {
      let errorCode = err.code;
      let errorMessage = err.message;
      if(errorCode == 'auth/weak-password') {
        req.flash('registerMessage', 'The password is too weak');
      }
      if(errorCode =='auth/email-already-in-use') {
        req.flash('registerMessage', 'The email is already in use');
      }
      if(errorCode == 'auth/invalid-email') {
        req.flash('registerMessage', 'The email address is not valid');
      }

      return res.render('auth/register', {
          title: "Register",
          games: '',
          messages: req.flash('registerMessage'),
          displayName: firebaseAuth.currentUser ? firebaseAuth.currentUser.displayName : ''
        });
    });
});

// GET /logout - process the logout request
router.get('/logout', (req, res, next)=>{
  firebaseAuth.signOut()
  .then(() => {
    res.redirect('/'); // redirect to the home page
  });
});

module.exports = router;
