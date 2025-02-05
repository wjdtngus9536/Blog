// controller
var express = require('express');
const router = express.Router();
const postService = require('../service/post-service');

router.get('/', async function (req, res, next) {
    const db = req.app.locals.db;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    // console.log('체크 page', page);

    try {
        // 리스트 함수 호출
        const [posts, paginator] = await postService.list(db, page, search);
        // console.log('[log] posts in home', posts);
        res.render('home', { title: "s's blog", posts, paginator, search });
    } catch (error) {
        console.error(error);
        res.render('home', { title: 'test board' });
    }
});


router.post('/write', async (req, res, next) => {
    const db = req.app.locals.db;
    const post = req.body;

    const results = await postService.writePost(db, post);
    res.redirect(`/detail/${results.insertId}`);
});


router.get('/write', (req, res, next) => {
    res.render('write', { title: 'write' });
});

router.get('/detail/:id', async (req, res, next) => {
    const db = req.app.locals.db;
    const id = req.params.id;
    const post = await postService.getPost(db, id);
    console.log('[log] 게시글 조회 결과', post);

    const comments = await postService.getComments(db, id);
    console.log('[log] 댓글 조회 결과', comments);
    console.log(`count of comments: ${comments.length}`);
    res.render('detail', { post, comments });
});

router.post('/write-comment', async (req, res, next) => {
    const db = req.app.locals.db;
    const comment = req.body;
    const results = await postService.writeComment(db, comment);
    res.redirect(`/detail/${comment.postId}`);
});

router.post('/check-password', async (req, res, next) => {
    const db = req.app.locals.db;
    const id = req.body.id;
    const password = req.body.password;
    const check = await postService.checkPassword(db, id, password);

    if (check) {
        return res.json({ isExist: true });
    } else {
        return res.status(404).json({ isExist: false });
    }
});

router.get('/modify/:id', async (req, res, next) => {
    const db = req.app.locals.db;
    const id = req.params.id;
    const post = await postService.getPostById(db, id);
    res.render('write', { title: post[0].title, post: post[0] });
});

router.post('/modify/:id', async (req, res, next) => {
    const db = req.app.locals.db;
    const post = req.body;
    const results = await postService.modifyPost(db, post);
    res.redirect(`/detail/${post.id}`);
});

router.delete('/delete', async (req, res, next) => {
    const db = req.app.locals.db;
    const { id, password } = req.body;

    // 비밀번호 확인
    const check = await postService.checkPassword(db, id, password);
    if (!check) {
        return res.json({ isSuccess: false });
    }

    try {
        const result = await postService.deletePostById(db, id, password);
        if (result.affectedRows !== 1) {
            return res.json({ isSuccess: false });
        }
        return res.json({ isSuccess: true });
    }
    catch (error) {
        console.error(error);
        return res.json({ isSuccess: false });
    }
})

router.delete('/delete-comment', async (req, res, next) => {
    const db = req.app.locals.db;
    const { cid, password } = req.body;
    console.log('[log] 댓글 아이디 패스워드 확인', cid, password)
    const result = await postService.deleteComment(db, cid, password);

    if (result.affectedRow !== 1) {
        return res.json({ isSuccess: false });
    }
    else {
        return res.json({ isSuccess: true });
    }
})

module.exports = router;