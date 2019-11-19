var express = require('express');
var router = express.Router();
var pg = require('pg'),
    session = require('express-session'),
    pgSession = require('connect-pg-simple')(session);

const { Pool, Client } = require('pg')
const pool = new Pool({
    user: 'postgres',
    database: 'EcomDB',
    password: 'dat',
    host: 'localhost',
    port: 3001,
    max: 10,
    idleTimeoutMillis: 300000000,
})

router.get('/test', function(req, res, next) {
    res.render('test3');
});

/* GET home page. */
// router.get('/', function(req, res, next) {
//     var status = "pending";
//     var sort = "ascending";
//     var page = 1;

//     query = 'SELECT * FROM "Laptop"';
//     // query = 'SELECT * FROM "Laptop" LIMIT 5 OFFSET (' + page + ' - 1) * 5';
//     console.log(query);
//     pool.query(query, function(err, result) {
//         console.log(err, result);
//         res.render('index', { Items: result, Status: status, Sort: sort, Page: page, paginationHtml: paginationHtml });
//     });
// });

router.get('/', function(req, res, next) {
    var status = "pending";
    var sort = "ascending";
    var page = 1;
    query = 'SELECT * FROM "Laptop" LIMIT 5 OFFSET (' + page + ' - 1) * 5';
    pool.query(query, function(err, result) {
        console.log(err, result.rowCount);
        res.render('index', { Items: result, Status: status, Sort: sort, Page: page });
    });
});

router.get('/result', function(req, res, next) {
    res.render('result');
});

router.get('/:status-:sort-:page', function(req, res, next) {

    var status = req.params["status"];
    var sort = req.params["sort"];
    var page = req.params["page"];

    pool.query('SELECT * FROM "Laptop"', function(err, items) {
        var itemsPerPage = 5;
        var itemsCount = items.rowCount;
        var length;
        if (itemsCount % itemsPerPage > 0) {
            length = Math.floor(itemsCount / itemsPerPage) + 1;
        } else {
            length = itemsCount / itemsPerPage;
        }

        query = 'SELECT * FROM "Laptop" LIMIT ' + itemsPerPage + ' OFFSET (' + page + ' - 1) * ' + itemsPerPage;

        pool.query(query, function(err, result) {
            res.render('index', { Items: result, Status: status, Sort: sort, Page: page, Length: length });
        });
    });
    //res.render('index', { Status: status, Sort: sort, Page: page });
});

// router.get('/:status-:sort/?page=:page', function(req, res, next) {
//     var status = req.params["status"];
//     var sort = req.params["sort"];
//     var page = req.params["page"];

//     var paginate = require('paginate')();
//     var totalItems = 50,
//         itemsPerPage = 2,
//         pageNum = 1;
//     var pagination = paginate.page(totalItems, itemsPerPage, pageNum);
//     var paginationHtml = pagination.render({ baseUrl: '/' }); //t

//     query = 'SELECT * FROM "Laptop"';
//     // query = 'SELECT * FROM "Laptop" LIMIT 5 OFFSET (' + page + ' - 1) * 5';
//     console.log(query);
//     pool.query(query, function(err, result) {
//         console.log(err, result);
//         res.render('index', { Items: result, Status: status, Sort: sort, Page: page, paginationHtml: paginationHtml });
//     });
// });

module.exports = router;