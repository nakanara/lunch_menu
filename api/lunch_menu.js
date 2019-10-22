// api/lunch_menu.js
var express     = require('express');
var router      = express.Router();
var Store       = require('../models/store');
var mongoose    = require('mongoose');
2var $           = require('jquery');

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
  }
)

// Show
router.get('/store/:id',
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


router.get('/ramdom', 
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
  function(req, res, next) {
    var limit =5;
    // 삭제되었을 때를 위한 여분
    var idxs = getRamdon((limit*2), res.locals.lastId);
    var nCount = 0;
    Store.find({id:{$in:idxs}})
      .exec(function(err, stores){
        if(err) {
          res.status(500);
          res.json({success:false, message:err});
        } else {

          var result = [];
          idxs.every((num, idx) => {

            stores.every((sitem, si)  => {
              if(sitem['id'] == num) {
                result.push(sitem);
                nCount++;
                return false;
              }
              return true;
            })

            console.log('nCount=' + nCount +'/limit=' + limit);
            if(nCount == limit) return false;
            return true;
          });
          res.json({success:true, idx:idxs, data:result});
        }
      });
  }
)

/**
 * 중복되지 않는 난수 생성
 * @param {*} size 전체 수
 * @param {*} maxIdx 최대 값
 */
function getRamdon(size, maxIdx) {
  let result = [];
  let isRun = true;
  let nCount = 0;
  let returnResult = [];

  if(size > maxIdx) {
    size = maxIdx;
  }

  do{
    let v = Math.round(Math.random() * maxIdx);
    v += 1; 

    if(result[v] != 1) {
      result[v] = 1;
      nCount++;
      returnResult.push(v);

      if(nCount == size) isRun = false;
    }
  }while(isRun);

  return returnResult;
}
module.exports = router;