var Product = require ('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hqa-products');


var products = [

  new Product ({
  title:'Kindergarten Supply Kit',
  description:' Everything your child needs to succeed in kindergarten at HQA',
  price:'50'
  }),
  new Product ({
  title:'1st Grade Supply Kit',
  description:' Everything your child needs to succeed in 1st grade at HQA',
  price:'50'
  }),
  new Product ({
  title:'2nd Grade Supply Kit',
  description:' Everything your child needs to succeed in 2nd grade at HQA',
  price:'50'
  }),
  new Product ({
  title:'4th Grade Supply Kit',
  description:' Everything your child needs to succeed in 3rd grade at HQA',
  price:'50'
  }),
  new Product ({
  title:'3rd Grade Supply Kit',
  description:' Everything your child needs to succeed in 4th grade at HQA',
  price:'50'
  }),
  new Product ({
  title:'5th Grade Supply Kit',
  description:' Everything your child needs to succeed in 5th grade at HQA',
  price:'50'
  })
];



var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
