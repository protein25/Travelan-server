const express = require('express');
const kakaoToken = require('../middlewares/kakaoToken');

const Models = require('../models');

const { Comments, Members } = Models;

const router = express.Router();

//댓글 목록 불러오기
router.get('/:id([0-9]+)', (req, res, next) => {
  const newspeedId = req.params.id;

  Comments.findAll({
    include: [{
      model: Members,
    }],
    where: {
      newspeedId: newspeedId
    },
  })
  .then((result) => {
    if (!result) throw Error('NO COMMENT');
    res.send(result);
  })
  .catch(next);
});

//댓글 작성
router.post('/', kakaoToken, (req,res,next) => {
  const { member } = req;
  const {newspeedId, content} = req.body;

  Comments.create({
    memberId: member.id,
    newspeedId,
    content,
  })
  .then(() => {
    res.send({ result: 'success' });
  })
  .catch(next);
});

//댓글 삭제
router.post('/delete', kakaoToken, (req,res,next) => {
  const { member } = req;
  const id = req.body.id;

  Comments.findById(id)
    .then((result) => {
      if (result.memberId !== member.id) {
        throw new Error('댓글 작성자만 댓글을 삭제할 수 있습니다.');
      }

      return result.destroy();
    })
    .then(() => {
      res.send('success');
    })
    .catch(next);
});

//댓글 수정
router.post('/edit', kakaoToken, (req, res, next) => {
  const { member } = req;
  const id = req.body.id;
  const content = req.body.content;

  Comments.findById(id)
    .then((result) => {
      if (result.memberId !== member.id) {
        throw new Error('댓글 작성자만 수정할 수 있습니다.');
      }

      return result.update({
        content,
      });
    })
    .then(function(){
      res.send('success');
    })
    .catch(next);
});

module.exports = router;
