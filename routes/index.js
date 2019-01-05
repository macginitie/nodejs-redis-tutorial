var express = require('express');
var router = express.Router();
const redis = require('redis');
/* Redis Client */
let redisClient = redis.createClient();

redisClient.on('connect', function(){
  console.log('Redis Connection Successfull');
});
/* GET home page. */
router.get('/', function(req, res, next) {
  let flag = '';
  flag = req.query.flag
  res.render('index', { title: 'NodeJS Redis Tutorial', flag: flag });
});

/* Search book. */
router.get('/book/search', function(req, res, next) {
  let isbn = req.query.isbn;
  redisClient.HGETALL(isbn, function(err, objBook){
    if(!objBook){
      console.log(err);
      res.render('index', {error: 'No record found'});
    }else{
      res.render('index', {isbn: isbn, book: objBook});
    }
  });
});

/* Search book. */
router.get('/book/delete', function(req, res, next) {
  let isbn = req.query.isbn;
  redisClient.del(isbn, function(err, response) {
    if (response) {
       console.log("Deleted Successfully!");
       res.redirect('/?flag=2');
    } else{
     console.log("Cannot delete"+ error);
    }
 })
});

  router.post('/book/add', function(req, res, next) {
    let isbn = req.body.isbn;
    let name = req.body.name;
    let price = req.body.price;
    let author = req.body.author;

    redisClient.hmset(isbn, [
      'name', name,
      'price', price,
      'author', author
    ], function(err, result){
      if(err){
        console.log(err);
      }
      console.log(result);
      res.redirect('/?flag=1');
  });
  // res.render('index', { title: 'NodeJs Redis Tutorial' });
});

module.exports = router;
