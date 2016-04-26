/**
 * Created by Administrator on 2016-4-25.
 */
var timer = null;
var classbtntimer = null;
function classTop(ev) {
    if (timer) {
        clearTimeout(timer);
    }
    var topEnd = $(".classlist>li:first-child").offset().top - $(window).height() + 300;
    for (var i = 0; i < 10000; i++) {
        var h = $("body").scrollTop() - 150 * i
        if (h > topEnd) {
            console.log("top");
            $("html,body").animate({scrollTop: h}, 500, 'swing');

        }
    }
}
function classBottom(ev) {
    if (timer) {
        clearTimeout(timer);
    }
    var bottomEnd = $(".classlist>li:last-child").offset().top - $(window).height() + 300;
    for (var i = 0; i < 10000; i++) {
        var h = $("body").scrollTop() + 150 * i
        if (h < bottomEnd) {
            console.log("bottom");
            $("html,body").animate({scrollTop: h}, 500, 'swing');

        }
    }
}
function classdragover(ev) {
    if (timer) {
        clearTimeout(timer);
    }
}
function classDragLeave(ev) {
    $("html,body").stop(true);
    timer = setTimeout(function () {
        if ($(".classTop").length > 0 && $(".classBottom").length > 0) {
            //scrollHanlder.enableScroll();//恢复滚动
            $(".classBottom").remove();
            $(".classTop").remove();
        }
    }, 1000);
}
/*function classmove(){
 console.log("123");
 $("html,body").stop(true,true).animate({scrollTop: $("body").scrollTop()+15}, 100, 'swing',classmove);
 }*/

function pictureallowDrop(ev) {
    ev.preventDefault();
    if (timer) {
        clearTimeout(timer);
    }
}
function pictureonDragEnter(ev) {
    if ($(".classTop").length == 0 && $(".clssBottom").length == 0) {
        //scrollHanlder.disableScroll();//禁用滚动
        $('.left').append("<div class='classTop' ondragover='classdragover(event)' ondragenter='classTop(event)' ondragleave='classDragLeave(event)'></div>" +
            "<div class='classBottom' ondragover='classdragover(event)' ondragenter ='classBottom(event)' ondragleave='classDragLeave(event)'></div>");
    }
}
function pictureDragLeave(ev) {
    timer = setTimeout(function () {
        if ($(".classTop").length > 0 && $(".classBottom").length > 0) {
            //scrollHanlder.enableScroll();//恢复滚动
            $(".classBottom").remove();
            $(".classTop").remove();
        }
    }, 1000);
}




function picturedrop(ev) {
    ev.preventDefault();
    if ($(".classTop").length > 0 && $(".classBottom").length > 0) {
        $(".classBottom").remove();
        $(".classTop").remove();
    }
    if ($(event.target).attr("class") === $('.this').attr("class")) {

    } else {
        var thisItem = $(event.target);

        var newclassid = thisItem.attr("data-c");
        var pictureid = ev.dataTransfer.getData("pictureid");

        /*console.log(classid);
         console.log(pictureid);*/
        //pictureUpd({'oldclassid':oldclassid,'newclassid':newclassid,'pictureid':pictureid});//修改图片
        pictureUpd({'newclassid': newclassid, 'pictureid': pictureid});//修改图片
        var oldclassid = $('.this').attr("data-c");
        var ggquery;
        if (oldclassid == "") {
            ggquery = {};
        } else {
            ggquery = {class: oldclassid};
        }
        console.log(ggquery);
        getPicture(ggquery);
        /*cleanClassUD();//清空列表项中的前一个.this的样式与点击控件
         thisItem.addClass("this");
         $(".crepicture input[type=\"hidden\"]").attr("value", classid);
         if (classid !== "56dab2879a78ca71f18afdb6") {
         var classnamestr = thisItem.text();
         thisItem
         .append("<button class=\"updclass\">u</button><button class=\"delclass\">d</button>")
         .append("<div class=\"hiduc abscenter\"><input class=\"udpclassname\" type=\"text\" autofocus /><button class=\"udpclassbtn\">修改</button><button class=\"hidudpclassbtn\">取消</button></div>");
         $('.udpclassname').val(classnamestr);
         classDel();//删除分类事件
         updateClassClick();//修改分类的页面交互
         }*/
        //ev.target.appendChild(document.getElementById(data));
    }
}




function picturedrag(ev) {
    var thispic = $('.showitem:hover');
    ev.dataTransfer.setData("pictureid", thispic.attr("data-id"));
    creatclassTC();
}
function picturedragend(ev) {
   $(".classtc").css({
       "display":"none"
   });
    $(".classlist").append($(".classitem[data-c]"));
    $(".classitem>button").css({
        "display":"block"
    });
}

function creatclassTC() {
    if($(".classtc").length==0){
        var classtc = $("<div><span>分类如下：</span><p><ul class='classtclist'></ul></p></div>").addClass('classtc');
        var classlist = $(".classitem[data-c]");
        console.log(classlist);
        $("body").append(classtc);
        $(".classtclist").append(classlist);
        //$(".classtclist li").removeClass("classitem this");
    }else{
        $(".classtc").css({
            "display":"block"
        });
        $(".classtclist").append($(".classitem[data-c]"));
    }
    $(".classitem>button").css({
        "display":"none"
    });
}
