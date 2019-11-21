var express = require('express');
var router = express.Router();
var pg = require('pg'),
    session = require('express-session'),
    pgSession = require('connect-pg-simple')(session);

const axios = require('axios');


router.get('/', function(req, res, next) {
    var Forms = new Array();

    var status = 0
    var sort = "ascending";

    axios.get("https://devc-fe-backend.herokuapp.com/forms").then(resp => {

        var i;
        for (i = 0; i < resp.data.Forms.length; i++)
            if (resp.data.Forms[i].VerificationStatus == status)
                Forms.push(resp.data.Forms[i]);

        res.render('index', {
            Items: Forms,
            Status: status,
            Sort: sort,
            Length: resp.data.Forms.Length
        });
    }).catch(error => { console.log(error); });
});

router.get('/result-id=:id', function(req, res, next) {
    id = req.params["id"];
    url = "https://devc-fe-backend.herokuapp.com/form?id=" + id;
    axios.get(url).then(resp => {
        res.render('result', {
            Item: resp.data.Form
        });
    }).catch(error => { console.log(error); });

});

router.post('/result-id=:id-status=:status', function(req, res) {
    id = req.params["id"];
    status = req.params["status"];
    url = "https://devc-fe-backend.herokuapp.com/status?id=" + id + "&value=" + status;
    axios.put(url).then(resp => {
        res.redirect('back');
    }).catch(error => { console.log(error); });
});



router.get('/status=:status-sort=:sort', function(req, res, next) {

    var Forms = new Array();

    var status = req.params["status"];
    var sort = req.params["sort"];

    axios.get("https://devc-fe-backend.herokuapp.com/forms").then(resp => {

        var i;
        for (i = 0; i < resp.data.Forms.length; i++)
            if (resp.data.Forms[i].VerificationStatus == status)
                Forms.push(resp.data.Forms[i]);

        res.render('index', {
            Items: Forms,
            Status: status,
            Sort: sort,
            Length: resp.data.Forms.Length
        });
    }).catch(error => { console.log(error); });
});

module.exports = router;