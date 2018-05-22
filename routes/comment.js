var members = require('../models/members');
var express = require('express');
var router = express.Router();

//댓글 목록 불러오기
router.get('/:id([0-9])', (req, res, next) => {
  var newspeedId = req.params.id;

  comment.findAll({
    where:{
      newspeedId:newspeedId
    }
  })
    .then((result) => {
      if (!result) throw Error('NO COMMENT');
      res.send(result);
    })
    .catch(next);
});

//댓글 작성
router.post('/addComment',function(req,res,next){
  var memberId = req.body.memberId;
  var newspeedId = req.body.newspeedId;
  var content = req.body.content;

  comment.create({
    memberId:memberId;
    newspeedId:newspeedId;
    content:content;
  }).then(function(result){
    if(!result) throw Error('error insert into comment table');
  });
});

//댓글 삭제
router.post('/deleteComment'function(req,res,next){
  var id = req.body.id;

  comment.destroy({
    where:{
      id = id
    }
  })
    .then(function(){
      res.send('success');
    }).catch(nxt);
});

//댓글 수정
router.post('/editComment',function(){
  var id = req.body.id;
  var content = req.body.content;

  comment.update({
    content,
  },{
    where:{
      id:id
    }
  }).then(function(){
    res.send('success');
  }).catch(next);
});

module.exports = router;
