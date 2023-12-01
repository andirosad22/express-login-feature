const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

app.get('/', (req, res) => {
  res.render('homepage');
})

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async(req, res) => {
  const { username, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    username,
    password: hashPassword
  });
  await user.save();
  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user =await User.findOne({username});
  if(user) {
    const isMatch = await bcrypt.compareSync(password, user.password);
    if(isMatch){
      res.redirect('/admin');
    }else{
      res.redirect('/login');
    };
  }else{
    res.redirect('/login');
  }
});



app.get('/admin', (req, res) => {
  res.send('Halaman admin hanya bisa di akses oleh admin');
})

app.listen(8080, () => {
  console.log('Example app listen on http://localhost:8080');
})