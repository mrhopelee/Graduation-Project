/**
 * Created by Administrator on 2016-2-3.
 */
/*在表单中通过 GET 方法提交两个参数*/

var express = require('express');
var app = express();
var fs = require("fs");

var str =  'mongodb://' + 'localhost' +':' + '27017'+ '/' + 'gp';
var db = require('mongoskin').db(str);
app.set('views', './views');
app.set('view engine', 'jade');


var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));

app.get('/index.html', function (req, res) {
    console.log("index.html");
    res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/file_upload', function (req, res) {

    console.log(req.files[0]);  // 上传的文件信息

    var des_file = __dirname + "/public/upload/" + req.files[0].originalname;
    fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
            }else{
                response = {
                    message:'File uploaded successfully',
                    filename:req.files[0].originalname
                };
            }
            console.log( response );
            managerpage(req, res);
        });
    });
})

app.get('/picture_get_all', function (req, res) {
    managerpage(req, res);

})

//跳转页面
var managerpage=function (req, res) {
    db.collection('picture').find().toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        res.render('manager',{picture:'1.jpg',result:result});
        //res.send(result);
    })
}



var server = app.listen(27017, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)


})

