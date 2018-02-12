const express = require('express');
const stripe = require('stripe')('sk_test_HF8skRtQCqBX1AotyCfJQNKA');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

const port = process.env.PORT || 5000;


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
  res.render('index');


})

app.listen(port, () => {

  console.log(`Server started on ${port}`);
});
