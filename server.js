/**
 * Created by Administrator on 2016-2-3.
 */
/*在表单中通过 GET 方法提交两个参数*/

var express = require('express');
var app = express();
var fs = require("fs");
var crud = require("./crud");


app.set('views', './views');
app.set('view engine', 'jade');


var bodyParser = require('body-parser');
var multer  = require('multer');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));

app.get('/index.html', function (req, res) {
    console.log("index.html1");
    res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/file_upload', function (req, res) {

    //console.log(req.files[0]);  // 上传的文件信息

    var des_file = __dirname + "/public/images/" + req.files[0].originalname;
    var classname="";
    if (req.body.classname.toString()==""){
        classname = "默认";
    } else {
        classname = req.body.classname;
    }
    console.log(classname);
    console.log(req.files[0].path);
    fs.readFile( req.files[0].path, function (err, data) {

        fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
            }else{
                response = {
                    message:'File uploaded successfully',
                    filename:req.files[0].originalname
                };
                crud.creatImg(req,res,data,classname);
            }
            console.log( response );
            managerpage(req, res);
        });
    });
})

app.get('/manager.html', function (req, res) {
    managerpage(req, res);
})
app.get('/classimage', function (req, res) {
    var classname={};
    if (req.query.classname.toString()==""){
        classname={};
    } else {
        classname={"class":req.query.classname};
    }
    crud.classImg(req,res,classname);
    //res.send(req.query.classname);
    /*db.collection('picture').find({req.query.}).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        res.render('manager',{result:result});
        //res.send(result);
    })*/
})


app.post('/image_del', urlencodedParser, function (req, res) {

    crud.removeImg(req, res);
    managerpage(req, res);
})

//跳转页面
var managerpage=function (req, res) {
    crud.showAllImg(req,res);
}


var server = app.listen(27017, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

