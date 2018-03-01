const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')('keys.stripeSecretKey');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();

const port = process.env.PORT || 5000;

// Mongo
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hqa-products');

// Model
const product = require('./models/product');

//Handlebars Middleware

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Body Parse Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set Static Folder

app.use(express.static(`${__dirname}/public`));


// Index Route
app.get('/', (req, res) => {
  res.render('index'), {

    stripePublishableKey: keys.stripePublishableKey
  }


})
//Success Route
app.get('/success', (req, res) => {
  res.render('success'), {
  }


})
// Contact Route
app.get('/contact', (req, res) => {
  res.render('contact'), {
  }

//HQA Store Front
})


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
