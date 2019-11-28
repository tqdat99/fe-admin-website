var express = require('express');
var router = express.Router();
var pg = require('pg'),
    session = require('express-session'),
    pgSession = require('connect-pg-simple')(session);

const axios = require('axios');


router.get('/', function(req, res, next) {
    var Forms = new Array();

    var status = 0
    var pending = 0;

    axios.get("https://devc-fe-backend.herokuapp.com/forms").then(resp => {

        var i;
        for (i = 0; i < resp.data.Forms.length; i++) {
            if (resp.data.Forms[i].VerificationStatus == status)
                Forms.push(resp.data.Forms[i]);
            if (resp.data.Forms[i].VerificationStatus == 0)
                pending++;
            //console.log(Date(resp.data.Forms[i].CreatedAt));
        }
        res.render('index', {
            Items: Forms,
            Status: 0,
            Pending: pending,
            Length: resp.data.Forms.Length
        });
    }).catch(error => { console.log(error); });
});

router.get('/status=:key&id=:id', function(req, res, next) {
    id = req.params["id"];
    status = req.params["key"];
    url = "https://devc-fe-backend.herokuapp.com/form?id=" + id;
    axios.get(url).then(resp => {
        res.render('result', {
            Item: resp.data.Form,
            Status: status
        });
    }).catch(error => { console.log(error); });

});

router.post('/id=:id&status=:status', function(req, res) {
    id = req.params["id"];
    status = req.params["status"];
    url = "https://devc-fe-backend.herokuapp.com/status?id=" + id + "&value=" + status;
    axios.put(url).then(resp => {
        res.redirect('back');
    }).catch(error => { console.log(error); });
});



router.get('/status=:status', function(req, res, next) {

    var Forms = new Array();

    var status = req.params["status"];
    var pending = 0;

    axios.get("https://devc-fe-backend.herokuapp.com/forms").then(resp => {

        var i;
        for (i = 0; i < resp.data.Forms.length; i++) {
            if (resp.data.Forms[i].VerificationStatus == status)
                Forms.push(resp.data.Forms[i]);
            if (resp.data.Forms[i].VerificationStatus == 0)
                pending++;
        }

        res.render('index', {
            Items: Forms,
            Status: status,
            Length: resp.data.Forms.Length,
            Pending: pending
        });
    }).catch(error => { console.log(error); });
});

module.exports = router;