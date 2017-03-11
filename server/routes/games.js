// modules required for routing
let express = require('express');
let router = express.Router();

let firebase = require('../config/firebase.js');
let firebaseDB = firebase.games;
let firebaseAdmin = firebase.admin;
let firebaseAuth = firebase.auth;


// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!firebaseAuth.currentUser) {
    return res.redirect('/login');
  }
  next();
}

/* GET games List page. READ */
router.get('/', requireAuth, (req, res, next) => {
  // find all games in the games collection
  firebaseDB.orderByKey().once("value", (snapshot)=>{
    res.render('games/index', {
        title: 'Games',
        games: snapshot.val(),
        displayName: firebaseAuth.currentUser.displayName
      });
  });

});

//  GET the Game Details page in order to add a new Game
router.get('/add', requireAuth, (req, res, next) => {
  res.render('games/details', {
    title: "Add a new Game",
    games: '',
    displayName: firebaseAuth.currentUser.displayName
  });
});

// POST process the Game Details page and create a new Game - CREATE
router.post('/add', requireAuth, (req, res, next) => {

    let newchild = null;

    firebaseDB.once("value", (snapshot) => {
      // read number of children of the games list
      newchild = snapshot.numChildren();

      // set the value of the new child
      firebaseDB.child(newchild).set({
      "name": req.body.name,
      "cost": req.body.cost,
      "rating": req.body.rating
      },
      (err)=>{
        if(err) {
          console.log(err);
          res.end(err);
        } else {
          res.redirect('/games');
        }
      });
    });
});

// GET the Game Details page in order to edit a new Game
router.get('/:id', requireAuth, (req, res, next) => {

    try {
      // get a reference to the id from the url
      let id = req.params.id;

      firebaseDB.child(id).once("value", (snapshot) => {
        res.render('games/details', {
            title: 'Game Details',
              games: snapshot.val(),
              displayName: firebaseAuth.currentUser.displayName
          });
      }, (err) => {
        if(err) {
          console.log(err);
          res.end(err);
        }
      });
    } catch (err) {
      console.log(err);
      res.redirect('/errors/404');
    }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {
  // get a reference to the id from the url
    let id = req.params.id;

     let updatedGame = {
      "name": req.body.name,
      "cost": req.body.cost,
      "rating": req.body.rating
    };

    firebaseDB.child(id).update(updatedGame, (err)=>{
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        // refresh the game List
        res.redirect('/games');
      }
    });
});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
  // get a reference to the id from the url
    let id = req.params.id;

    firebaseDB.child(id).remove((err) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        // refresh the games list
        res.redirect('/games');
      }
    });
});

module.exports = router;
