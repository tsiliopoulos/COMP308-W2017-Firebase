// firebase requirements
let firebase = require('firebase');
let admin = require('firebase-admin');
let serviceAccount = require('./firebase.json');

// initialize firebase admin for datbase access
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mynodeproject-975fb.firebaseio.com/"
})

// initialize firebase web
// Initialize Firebase
let config = {
  apiKey: "AIzaSyCy6Hn1z_3hfTi45J7XRxLDqpn2n6MkR6E",
  authDomain: "mynodeproject-975fb.firebaseapp.com",
  databaseURL: "https://mynodeproject-975fb.firebaseio.com",
  storageBucket: "mynodeproject-975fb.appspot.com",
  messagingSenderId: "965391815414"
};
firebase.initializeApp(config);

let firebaseDB = admin.database();

module.exports.games = firebaseDB.ref("games");

module.exports.admin = admin;

module.exports.auth = firebase.auth();

