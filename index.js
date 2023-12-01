const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/user');

// mongoose connect?
mongoose.connect('mongodb://127.0.0.1/auth_demo')
  .then((result) => {
    console.log("connected to MongoDB");
  }).catch((err) => {
    console.log(err);
  });


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({
  extended: true
}));
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
  }));


  const auth = (req, res, next)=>{
    if(!req.session.user_id){
      return res.redirect('/login');
    }
    next();
  };

  const ghost = (req, res, next) => {
    if(req.session.user_id){
      return res.redirect('/admin');
    }
    next();
  }
  
  
app.get('/', (req, res) => {
  res.send('homepage');
})

app.get('/register', ghost, (req, res) => {
  res.render('register');
});

app.post('/register', ghost, async(req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password});
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/');
});

app.get('/login', ghost, (req, res) => {
  res.render('login');
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user =await User.findByCredentials(username, password);
  if(user) {
      req.session.user_id = user._id;
      res.redirect('/admin');
  }else{
    res.redirect('/login');
  }
});

app.post('/logout', auth, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


app.get('/admin', auth, (req, res) => {
  if(!req.session.user_id){
    res.redirect('/login');
  }
  res.render('admin');
});
app.get('/profile/settings', auth, (req, res) => {
  res.send('Profile Setting' + req.session.user_id);
});

app.listen(8080, () => {
  console.log('Example app listen on http://localhost:8080');
})