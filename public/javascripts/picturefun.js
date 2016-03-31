/**
 * Created by mrhop on 2016/3/26 0026.
 */
/*生成图片节点*/
function createshowitem(str) {
    var text = "<div class=\"showitem\" draggable=\"true\" ondragstart=\"drag(event)\">" +
        "<div class=\"showimg\">" +
        "<img draggable=\"false\">" +
        "</div>" +
        "<div class=\"showother abscenter\">" +
        "<div class=\"shownamediv\">" +
        "<span class=\"showname\"></span>" +
        "</div>" +
        "<div class=\"showbtns\">" +
        "<button class=\"updpicture\">upd</button>" +
        "<button class=\"delpicture\">del</button>" +
        "</div>" +
        "</div>" +
        "</div>";
    $(str).append(text);
};

/*查询分类，并在页面分类列表插入分类*/
function getPicture(query) {
    $.ajax({
        url: "http://localhost:27017/showallpicture",
        async: false,
        data: {"query":query},
        success: function (result) {
            $(".showpicture").empty();
            /*清空图片节点*/

            for (var i = 0; i < result.length; i++) {
                createshowitem(".showpicture");
                /*生成图片节点*/
                var j = i + 1;
                var nowshowitem = $(".showpicture>.showitem:nth-child(" + j + ")");
                /*console.log(nowshowitem);*/
                nowshowitem.attr({"data-id":result[i]._id});
                nowshowitem.find(".showimg>img").attr({
                    "src": "images/" + result[i].realname,
                    "alt": result[i].name
                });
                nowshowitem.find(".showname").html(result[i].name);
                if(i==result.length-1){
                    //console.log("load clickfun");
                    delpicturefun();
                    updpicturefun();
                }
            }
        }
    });
}
/*删除图片click事件*/
function delpicturefun(){
    $('.delpicture').click(function(e){
        e.preventDefault();
        var thisbtn = $(this);
        var thispicture = thisbtn.parents('.showitem');
        var thisclass = $('.this');
        //console.log(thispicture.attr('data-id'));
        $.ajax({
            url: "http://localhost:27017/delpicture",
            type: "POST",
            async: false,
            data: {
                "thisclass":  $('.this').attr('data-c'),
                "del_pictureid": thispicture.attr('data-id')
            },
            success: function (result) {
                $(".showpicture").empty();
                /*清空图片节点*/

                for (var i = 0; i < result.length; i++) {
                    createshowitem(".showpicture");
                    /*生成图片节点*/
                    var j = i + 1;
                    var nowshowitem = $(".showpicture>.showitem:nth-child(" + j + ")");
                    /*console.log(nowshowitem);*/
                    nowshowitem.attr({"data-id":result[i]._id});
                    nowshowitem.find(".showimg>img").attr({
                        "src": "images/" + result[i].realname,
                        "alt": result[i].name
                    });
                    nowshowitem.find(".showname").html(result[i].name);
                    if(i==result.length-1){
                        //console.log("load clickfun");
                        delpicturefun();
                        updpicturefun();
                    }
                }
            }
        });

    });
}

/*删除图片click事件*/
function updpicturefun(){}

/*修改图片分类*/
function pictureUpd(upd_pictureid,upd_classid) {
        startUpdClass(upd_pictureid,upd_classid);
        function startUpdClass(upd_pictureid,upd_classid) {
            $.ajax({
                url: "http://localhost:27017/updpicture",
                async: false,
                data: {
                    "upd_pictureid": upd_pictureid,
                    "upd_classid": upd_classid
                },
                success: function (result) {
                    getPicture({class:result});
                }
            });
        }
}
