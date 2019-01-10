const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        about: 'about',
        dynamic: 'dynamic',
        images: 'images',
        form: 'form',
        personform: 'personform'
    });
});

router.get('/dynamic', (req, res) => {
    res.render('dynamic', {
        title: 'Dynamic',
        user: {name: 'John Doe', age: 30}
    });
});

router.get('/about', (req, res) => {
    res.send('About: from router');
});

router.get('/images', (req, res) => {
    res.render('images');
});

router.get('/form', (req, res) => {
    res.render('form');
});

router.get('/personform', (req, res) => {
    res.render('personform');
});

router.get('/check/:text/:id([0-9]{5})', (req, res) => {
    res.send(`Id number: ${req.params.id}. Text: ${req.params.text}`);
});

router.use(express.static(path.join(__dirname, 'public')));
router.use('/static', express.static(path.join(__dirname, 'public')));

/* router.get('*', (req, res) => {
    res.send('No page');
}); */

module.exports = router;