/**
 * Created by Administrator on 2016-3-3.
 */
var str =  'mongodb://' + 'localhost' +':' + '27017'+ '/' + 'gp';
var db = require('mongoskin').db(str);
var imageinfo = require("./imageinfo");

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
    var classinfo = null;
    db.collection('class').find().toArray(function(err, result) {
            if (err) throw err;
            classinfo = result;
            console.log("class");
        })
    db.collection('picture').find().toArray(function(err, result) {
        if (err) throw err;
        console.log("picture");
        res.render('manager',{pi:result,ci:classinfo});
        //res.send(result);
    })
}
/*按分类查询图片*/
function classImg(req,res,classname) {
    db.collection('picture').find(classname).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        res.send(result);
    })
}
/*删除图片*/
function removeImg(req, res) {
    db.collection('picture').removeById(req.body.id, function(err, result) {
        if (!err) console.log(req.body.id+' deleted!');
        showAllImg(req, res);
    });

}


exports.removeImg     = removeImg;
exports.showAllImg = showAllImg;
exports.classImg    = classImg;
exports.creatImg    = creatImg;