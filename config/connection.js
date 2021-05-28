const MongoClient=require('mongodb').MongoClient;
var state={
    db:null
}
module.exports.Connection=function(callback){
    const url='mongodb://localhost:27017';
    const database='shopping_cart';
    MongoClient.connect(url,(error,data)=>{
        if(error)
            return callback(error)
        state.db=data.db(database)
        callback()
            
    })
}
module.exports.get=function(){
    return state.db
}