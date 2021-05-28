var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helper');
var userHelper = require('../helpers/user-helper');

const checkUserLoggin = (req, res, next) => {

  if (req.session.userData) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  let loginUser = req.session.userData;
  let cartCount = null
  if (loginUser) {
    userHelper.getCartCount(loginUser._id).then(resoponse => {
      cartCount = resoponse
    });
  }
  productHelper.getProducts().then(function (products) {
    res.render('user', { title: 'Shopping Cart', products: products, admin: false, loginUser, cartCount: cartCount });
  });


});
/* GET login page. */
router.get('/login', function (req, res, next) {
  var loginError = req.session.logInErrorMessage
  if (!req.session.userData)
    res.render('user/login', { title: 'Shopping Cart', admin: false, loginError });
  else
    res.redirect('/')
});
/* GET signup page. */
router.get('/signup', function (req, res, next) {
  if (!req.session.userData)
    res.render('user/signup', { title: 'Shopping Cart', admin: false });
  else
    res.redirect('/')
});
/* post signup data. */
router.post('/signup', function (req, res) {
  userHelper.doSignUp(req.body)
    .then((data) => {
      req.session.loggedIn = true;
      req.session.userData = data;
      res.redirect('/')
    }).catch(error => {
      res.send("Not successfull---<a href='/signup' >Go back to sign Up Page</a>")
    })
});
/* POST login data. */
router.post('/login', function (req, res) {
  userHelper.doLogin(req.body)
    .then((data) => {
      req.session.loggedIn = true;
      req.session.userData = data;

      req.session.logInErrorMessage = "";
      res.redirect('/')
    }).catch(error => {
      req.session.logInErrorMessage = error;
      res.redirect('/login')
    })
})
/* LOGOUT  */
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/')
})
/*CART LOAD*/
router.get('/cart', checkUserLoggin, function (req, res) {
  let loginUser = req.session.userData;
  let cartCount = null
  if (loginUser) {
    userHelper.getCartCount(loginUser._id).then(resoponse => {
      cartCount = resoponse
    });
  }
  userHelper.getCartDetails(loginUser._id).then((response) => {
    res.render('user/cart', { title: 'Shopping Cart', admin: false, loginUser: loginUser, cartDetails: response, cartCount: cartCount })
  })
});
/* ADDING TO CART */
router.get('/add-to-cart/:productId', checkUserLoggin, function (req, res) {
  var productId = req.params.productId;
  var userId = req.session.userData._id;
  userHelper.addToCart(userId, productId).then((response) => {
    if (response.result.ok == 1)
    res.json({status:true})
    else
    res.json({status:false})
  })
});

module.exports = router;
