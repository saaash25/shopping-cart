var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helper')

var fs = require('fs');



/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelper.getProducts().then(function (products) {
    //console.log(products)
    res.render('admin/view-products', { title: 'Shopping Cart', products: products, admin: true })
  });


});
router.get('/add-product', function (req, res, next) {
  res.render("admin/add-product")
});
router.post('/add-product', function (req, res, next) {
  product = { data: req.body, image: req.files.image };
  var productImgae = req.files.image;
  productHelper.addProduct(req.body, function (productId) {
    var dir = './public/product-images';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    productImgae.mv('./public/product-images/' + productId + '.jpg', (error, done) => {
      if (!error) {
        var productImageUrl = productId + '.jpg'
        productHelper.updateProductImageUrl(productId, productImageUrl);
        res.render('admin/add-product');
      }

    })

  });
});

//CAN PASS PARAMETERS IN TWO WAYS IN GET METHOD
//DEFFERENT WAYS ARE USED IN EDIT AND DELETE

/*DELETE PRODUCT */
router.get('/delete-product', function (req, res) {
  let productId = req.query.productId

  productHelper.deleteProduct(productId).then((response) => {
    fs.unlink('./public/product-images/' + productId + '.jpg', function (err) {
      if (err) return console.log(err);
      res.redirect('/admin')
    });

  })

})
/*GET EDIT PRODUCT DETAILS */
router.get('/edit-product/:productId', function (req, res) {
  let productId = req.params.productId
  productHelper.getSingleProduct(productId).then(function (products) {
    res.render("admin/edit-product", { title: 'Shopping Cart', products: products, admin: true })
  });

})
/*UPDATE PRODUCT DETAILS*/
router.post('/edit-product/:productId', function (req, res) {
  var productData = req.body
  var productId = req.params.productId
  productHelper.updateProduct(productId, productData).then(function (data) {
    if (req.files) {
      var productImgae = req.files.image;
      fs.unlink('./public/product-images/' + productId + '.jpg', function (err) {
        if (err) {
          return console.log(err);
        }
        else {
          productImgae.mv('./public/product-images/' + productId + '.jpg', (error, done) => {
            if (!error) {
              res.redirect('/admin')
            }
          })
        }

      })
    }else{
      res.redirect('/admin')
    }
  });





})
module.exports = router;
