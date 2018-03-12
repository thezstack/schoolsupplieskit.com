const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')('keys.stripeSecretKey');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();
const csrf = require('csurf');
const csrfProtection = csrf();
const port = process.env.PORT || 5000;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hqa-products');

// Model
const product = require('./models/product');
const Cart = require('./models/cart');
//Handlebars Middleware

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Body Parse Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  secret:'mysupersecret',
  resave:false,
  saveUninitialized:false,
  store:new MongoStore({mongooseConnection:mongoose.connection}),
  cookie:{maxAge:180 * 60 * 1000}
  }));
  app.use(function(req, res, next) {
      res.locals.session = req.session;
      next();
  });
//Set Static Folder
app.use(express.static(`${__dirname}/public`));


// Index Route
app.get('/', (req, res) => {
  res.render('index')
});

// Store
app.get('/add-to-cart/:id', (req,res) => {
    const productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items:{}});

    product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/');
       }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
         res.redirect('/hqa');
    });
});

app.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

app.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});


app.get('/shopping-cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('shopping-cart', {products: null});
   }
    var cart = new Cart(req.session.cart);
    res.render('shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});


//HQA view


app.get('/hqa', (req, res) => {

  product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('hqa', { title: 'Shopping Cart', products: productChunks });
    });
  });

//Contact
app.get ('/contact', (req,res) => {
  res.render('contact');
})

//Charge Route
app.post('/charge', (req, res) => {
  const amount = 5000;
  res.send('TEST')

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'HQA School Supply Kit',
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});

app.listen(port, () => {

  console.log(`Server started on ${port}`);
});
