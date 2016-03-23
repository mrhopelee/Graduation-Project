/**
 * Created by Administrator on 2016-3-3.
 */
var str =  'mongodb://' + 'localhost' +':' + '27017'+ '/' + 'gp';
var db = require('mongoskin').db(str);
var imageinfo = require("./imageinfo");
var fs = require("fs");

/*插入图片*/
function creatImg(req,res,data,nameQuery) {
    var now= new Date();
    var info = imageinfo(data);
    db.collection('picture').insert({name: req.files[0].originalname,realname: nameQuery.realname, date: [now.getYear(), now.getMonth(), now.getDate()], height: info.height, width: info.width, size: data.length, class: nameQuery.classname, tag: []}, function(err, result) {
        if (err) throw err;
        if (!err) console.log('Added!');
        showAllImg(req, res);
    });
}
/*查询所有图片*/
function showAllImg(req, res) {

    db.collection('picture').find().toArray(function(err, result) {
        if (err) throw err;
        //console.log("picture");
        res.render('manager',{pi:result});
        //res.send(result);
    })
}
/*按分类查询图片*/
function classImg(req,res) {
    /*console.log(req.query.thisclassid);*/
    if(req.query.thisclassid==""){
        db.collection('picture').find().toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            res.send(result);
        });
    }else {
            db.collection('picture').find({class:req.query.thisclassid}).toArray(function(err, result) {
                if (err) throw err;
                //console.log(result);
                res.send(result);
            });
        /*db.collection('picture').findById(req.query.thisclassid, function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });*/
    }
    /*db.collection('picture').findById(req.body.id, function(err, result) {
        if (err) throw err;
        //console.log(result);
        res.send(result);
    });*/
}
/*删除图片*/
function removeImg(req, res) {
    db.collection('picture').findById(req.body.id, function(err, result) {
        var del_path = "public\\images\\" + result.realname;
        //if (!err) console.log(del_path);
        db.collection('picture').removeById(req.body.id, function(err, result) {
            if (!err) {
                //console.log(req.body.id + ' deleted!');
                if (fs.existsSync(del_path)) {
                    fs.unlink(del_path, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
            }
            showAllImg(req, res);
        });
    });
}

function findClassName(req, res) {
    db.collection('class').find().toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
    })
}
function creClass(req, res) {
    db.collection('class').insert({name: req.query.newclassname}, function(err, result) {
        if (err) throw err;
        if (!err) console.log('Class Added!');
        findClassName(req,res);
    });
}
function delClass(req, res) {

    console.log(req.query.classid);
    db.collection('class').removeById(req.query.classid, function(err, result) {
        if (err) throw err;
        if (!err) console.log('Class del!');
        findClassName(req,res);
    });
}
function updClass(req, res) {

    console.log(req.query.upd_classid);
    console.log(req.query.upd_classname);
    db.collection('class').updateById(req.query.upd_classid,  {$set:{name:req.query.upd_classname}}, function(err, result){
        if (err) throw err;
        if (!err) console.log('Class upd!');
        findClassName(req,res);
    });
}


exports.removeImg     = removeImg;
exports.showAllImg = showAllImg;
exports.classImg    = classImg;
exports.creatImg    = creatImg;

exports.creClass = creClass;
exports.delClass = delClass;
exports.updClass = updClass;
exports.findClassName = findClassName;