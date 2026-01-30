const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/welcome_page.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/navbar.html'));
});

router.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/welcome_page.html'));
});

router.get('/item-details', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/display_info.html'));
});

router.get('/register-item', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/registration.html'));
});

router.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Account.html'));
});

router.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/notifications', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notifications.html'));
});

router.get('/profile-view', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile_view.html'));
});

module.exports = router;
