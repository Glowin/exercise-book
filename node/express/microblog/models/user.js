var mongodb = require('./db')

function User (user) {
  this.name = user.name
  this.password = user.password
}
module.exports = User

User.prototype.save = function save(callback) {
  //push the date to the mongodb
  var user = {
    name: this.name,
    password: this.password,
  }
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err)
    }
  //load users
  db.collection('users', function(err, collection) {
    if(err) {
      mongodb.close()
      return callback(err)
    }
    //add index for name property
    collection.ensureIndex('name', {unique: true})
    //add to user document
    collection.insert(user, {safe: true}, function(err, user) {
      mongodb.close()
      callback(err, user)
    })
  })//db.collection
  })//mongodb.open
};//User.prototype.save

User.get = function get(username, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    //load users
    db.collection('users', function(err, collection) {
      if(err) {
        mongodb.close()
        return callback(err)
      }
    //search the document if name's property is username
    collection.findOne({name: username}, function(err, doc) {
      mongodb.close()
      if(doc) {
        //封装文档为 User 对象
        var user = new User(doc)
        callback(err, user)        
      } else {
        callback(err, null)
      }
    })
  })//db.collection
})//mongodb.open
}//User.get
