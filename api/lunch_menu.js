// api/lunch_menu.js
var express     = require('express');
var router      = express.Router();
var Store       = require('../models/store');
var mongoose    = require('mongoose');

// Index
router.get('/',
  function(req, res, next){
    var query = {};
    if(req.query.name) query.name = {$regex:req.query.name, $options:'i'};

    Store.find(query)
      .sort({id:1})
      .exec(function(err, stores){
        if(err) {
          res.status(500);
          res.json({success:false, message:err});
        } else {
          res.json({success:true, data:stores});
        }
      })
  })

// Show
router.get('/:id',
function(req, res, next){
  Store.findOne({id:req.params.id})
  .exec(function(err, store){
    if(err) {
      res.status(500);
      res.json({success:false, message:err});
    }
    else if(!store){
      res.json({success:false, message:"Store not found"});
    }
    else {
      res.json({success:true, data:store});
    }
  });
}
);

// Create
router.post('/',
  function(req, res, next){
    Store.findOne({})
    .sort({id: -1})
    .exec(function(err, store){
      if(err) {
        res.status(500);
        return res.json({success:false, message:err});
      }
      else {

        res.locals.lastId = store?store.id:0;
        next();
      }
    });
  },
  function(req, res, next){
    var newStore = new Store(req.body);
    newStore.id = res.locals.lastId + 1;
    newStore.save(function(err, store){
      if(err) {
        res.status(500);
        res.json({success:false, message:err});
      }
      else {
        res.json({success:true, data:store});
      }
    });
  }
);

// Update
router.put('/:id',
function(req, res, next){
  Store.findOneAndUpdate({id:req.params.id}, req.body)
  .exec(function(err, store){
    if(err) {
      res.status(500);
      res.json({success:false, message:err});
    }
    else if(!store){
      res.json({success:false, message:"store not found"});
    }
    else {
      res.json({success:true});
    }
  });
}
);

// Destroy
router.delete('/:id',
function(req, res, next){
  Store.findOneAndRemove({id:req.params.id})
  .exec(function(err, store){
    if(err) {
      res.status(500);
      res.json({success:false, message:err});
    }
    else if(!store){
      res.json({success:false, message:"store not found"});
    }
    else {
      res.json({success:true});
    }
  });
}
);

module.exports = router;