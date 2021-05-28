var db = require('../config/connection');
var Collection = require('../config/collection');
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    addProduct: (product, callback) => {
        db.get().collection(Collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
            return callback(data.ops[0]._id)
        })
    },
    getProducts: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(Collection.PRODUCT_COLLECTION).find({}).toArray((error, result) => {
                if (!error)
                    resolve(result)
            })
        });

        //return callback(db.get().collection('products').find({_id:0}))
    },
    updateProductImageUrl: (productId, productImageUrl) => {
        db.get().collection(Collection.PRODUCT_COLLECTION).updateOne({ _id: productId }, { $set: { imageUrl: productImageUrl } });
    },
    deleteProduct: (proId) => {
        return new Promise((resolve,reject)=>{
            db.get().collection(Collection.PRODUCT_COLLECTION).deleteOne({ _id: ObjectId(proId)}).then((response)=> {
                resolve(response)
                
            });
        })
        
    },
    getSingleProduct: (productId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(Collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(productId)}).then((result) => {
               resolve(result)
            })
        });
    },
    updateProduct:(productId,productDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(Collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(productId)},
            {$set:{name:productDetails.name,category:productDetails.category,description:productDetails.description,price:productDetails.price}})
            .then(data=>{
                resolve(data)
            })
        })
    }

}