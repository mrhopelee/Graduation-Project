/**
 * Created by Administrator on 2016-2-3.
 */
/*在表单中通过 GET 方法提交两个参数*/

var express = require('express');
var app = express();
var str =  'mongodb://' + 'localhost' +':' + '27017'+ '/' + 'gp';
var db = require('mongoskin').db(str);
app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'));

app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/picture_get_all', function (req, res) {

    // 输出 JSON 格式
    db.collection('picture').find().toArray(function(err, result) {
        if (err) throw err;
        console.log(result);

    });
    res.render('manager');
})



var server = app.listen(27017, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)


})

