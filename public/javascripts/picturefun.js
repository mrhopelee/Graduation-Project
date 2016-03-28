/**
 * Created by mrhop on 2016/3/26 0026.
 */
/*生成图片节点*/
function createshowitem(str) {
    var text = "<div class=\"showitem\" draggable=\"true\" ondragstart=\"drag(event)\">" +
        "<div class=\"showimg\">" +
        "<img draggable=\"false\">" +
        "</div>" +
        "<div class=\"showother\">" +
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
function getPicture() {
    $.ajax({
        url: "http://localhost:27017/showallpicture",
        async: false,
        data: {},
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
            }
        }
    });
}

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
                }
            });
        }
}
