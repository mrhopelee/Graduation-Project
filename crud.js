/**
 * Created by Administrator on 2016-3-3.
 */
var str =  'mongodb://' + 'localhost' +':' + '27017'+ '/' + 'gp';
var db = require('mongoskin').db(str);
var imageinfo = require("./imageinfo");

function creatImg(req,res,data) {
    var now= new Date();
    var info = imageinfo(data);
    db.collection('picture').insert({name: req.files[0].originalname,realname: req.files[0].originalname, date: [now.getYear(), now.getMonth(), now.getDate()], height: info.height, width: info.width, size: data.length, class: '默认', tag: []}, function(err, result) {
        if (err) throw err;
        if (result) console.log('Added!');
    });
}
function showAllImg(req, res) {
    db.collection('picture').find().toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        res.render('manager',{result:result});
        //res.send(result);
    })
}
function classImg(req,res,classname) {
    db.collection('picture').find(classname).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    })
}
function removeImg(req, res) {
    db.collection('picture').removeById(req.body.id, function(err, result) {
        if (!err) console.log(req.body.id+' deleted!');
    });
}


exports.removeImg     = removeImg;
exports.showAllImg = showAllImg;
exports.classImg    = classImg;
exports.creatImg    = creatImg;