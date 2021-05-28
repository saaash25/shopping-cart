var db = require('../config/connection');
var Collection = require('../config/collection')
var bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');
const { CART_COLLECTION } = require('../config/collection');
module.exports = {
    doSignUp: (userData) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(userData.password, 10).then(hash => {
                userData.password = hash
                db.get().collection(Collection.USER_COLLECTION).insertOne(userData)
                    .then((data) => {
                        resolve(data.ops[0])
                    }).catch(error => {
                        reject(false)
                    })
            });

        });
    },
    doLogin: (userData) => {
        return new Promise((resolve, reject) => {

            db.get().collection(Collection.USER_COLLECTION).findOne({ username: userData.username })
                .then((user) => {
                    if (user) {
                        user.loginStatus = false;
                        bcrypt.compare(userData.password, user.password)
                            .then((result) => {
                                if (result) {
                                    user.loginStatus = true;
                                    resolve(user)
                                }
                                else
                                    reject("Incorrect Credential")
                            })
                    } else
                        reject("No Users Found")
                })
        });
    },
    addToCart: (userId, productId) => {
        let productObj={
            item:ObjectID(productId),
            qty:1
        }
        return new Promise(async (resolve, reject) => {
            var cartData = await db.get().collection(Collection.CART_COLLECTION).findOne({ user: ObjectID(userId) })
            if (cartData) {
                let productExist=cartData.products.findIndex(product=>product.item==productId)
                if(productExist!=-1){
                    db.get().collection(Collection.CART_COLLECTION).updateOne({user: ObjectID(userId),'products.item':ObjectID(productId) },
                    {
                         $inc:{'products.$.qty':1}
                    })
                    .then((response) => {
                        resolve(response)
                    })
                }else{
                    db.get().collection(Collection.CART_COLLECTION).updateOne({user: ObjectID(userId)},
                    {
                         $push:{products:productObj}
                    })
                    .then((response) => {
                        resolve(response)
                    })
                }
               
            } else {
                cartObject = {
                    user: ObjectID(userId),
                    products: [productObj]
                }
                db.get().collection(Collection.CART_COLLECTION).insertOne(cartObject).then((response) => {
                    resolve(response)
                })
            }

        })
    },
    getCartDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(Collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: ObjectID(userId) }
                },
                {
                    $lookup: {
                        from: Collection.PRODUCT_COLLECTION,
                        let: { productList: '$products'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$productList']
                                    }
                                }
                            }
                        ],
                        as: 'cartItems'
                    }
                }
            ]).toArray((error, result) => {
                if (error)
                    reject(error)
                else
                    resolve(result[0].cartItems)
            })
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            cartCount=0
            let Cart =await db.get().collection(Collection.CART_COLLECTION).findOne({user:ObjectID(userId)});
            if(Cart){
                cartCount=Cart.products.length
            }
            resolve(cartCount);
        })
        

    }
}