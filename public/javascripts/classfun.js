/**
 * Created by Administrator on 2016-3-16.
 */
/*检查完成*/
/*取得数据操作返回的result，在页面重新生成分类*/
function classPage(result) {
    $(".classlist>li:not(:first-child)").remove();//清空分类li
    var lasttclass = null;
    var classText = "";
    for (var i = 0; i < result.length; i++) {
        lasttclass = $(".classlist>li:last-child");
        classText = "<li data-c='" + result[i]._id + "' data-n='" + result[i].name + "' class='classitem'  ondrop='picturedrop(event)'  ondragleave='pictureDragLeave(event)' ondragenter='pictureonDragEnter(event)' ondragover='pictureallowDrop(event)'>" + result[i].name + "</li>";
        lasttclass.after(classText);
    }
    classClick();//点击分类列表事件
}
/*新增分类事件*/
function classCre() {
    $(".creclassbtn").click(function (e) {
        e.preventDefault();
        var newclassname = $(".creclassname").val();//获取创建输入框中的分类名
        if (newclassname) {//如果输入框中的分类名为空
            var oldcs = $('.classitem');
            var temp = 1;//1代表不重复，0代表重复
            for (var i = 0; i < oldcs.length; i++) {
                if (newclassname === oldcs[i].innerHTML) {
                    temp = 0;
                }
            }
            if (temp) {//如果不重复
                startCreClass(newclassname);//新增分类名，newclassname为新增分类的名字
                $(".creclassname").val("");//重置新增分类输入框
                $('.hidnewclass').css({
                    "display": "none"
                });
            } else {
                alert("已存在此分类");
            }
        } else {
            alert("不能为空");
        }
        //新增分类名，newclassname为新增分类的名字
        function startCreClass(newclassname) {
            $.ajax({
                url: "http://localhost:27017/creclass",
                async: false,
                data: {"newclassname": newclassname},
                success: function (result) {
                    classPage(result);//取得result之后，在页面重新生成分类
                }
            });
        }

    })
}
/*新增分类的页面交互*/
function newClassClick() {
    $('.newclassbtn').click(function (e) {
        e.preventDefault();
        $('.hidnewclass').css({
            "display": "block"
        });
    });
    $('.hidcreclassbtn').click(function (e) {
        e.preventDefault();
        $('.hidnewclass').css({
            "display": "none"
        });
    });
}
/*删除分类事件*/
function classDel() {
    $('.delclass').click(function (e) {
        e.preventDefault();
        var r = confirm("删除分类后，被删分类的所有图片将归为\"默认\"分类\n确定删除？");
        if (r == true) {
            var thisclass = $(this).parent();//获取当前准备删除的分类li
            $.ajax({
                url: "http://localhost:27017/delclass",
                async: false,
                data: {
                    "classid": thisclass.attr("data-c"),
                    "query": {}
                },
                success: function (result) {
                    classPage(result);//取得result之后，在页面重新生成分类\
                    getPicture({class: "56dab2879a78ca71f18afdb6"});
                    $('li[data-c="56dab2879a78ca71f18afdb6"]').addClass("this");

                }
            });
        } else {
        }
    });
}
/*修改分类的页面交互*/
function updateClassClick() {
    $('.updclass').click(function (e) {//更新分类按钮点击事件
        e.preventDefault();
        $('.hiduc').css({//修改分类事件框出现
            "display": "inline-block"
        });
    });
    $('.hidudpclassbtn').click(function (e) {//取消修改分类按钮点击事件
        e.preventDefault();
        $('.hiduc').css({//修改分类事件框消失
            "display": "none"
        });
    });
    classUpd();//修改分类事件
}
/*修改分类事件*/
function classUpd() {
    $('.udpclassbtn').click(function (e) {//当点击修改分类按钮时
        e.preventDefault();
        var upd_classname = $('.udpclassname').val();//获取修改分类输入框中的值
        if (upd_classname) {/*判断输入值是否为空*/
            if (upd_classname === $('.this').attr("data-n")) {//判断输入值是否和原分类名是否一样
                $('.hiduc').css({
                    "display": "none"
                });
            } else {
                /*判断输入值和其他原有的分类名是否一样*/
                var oldcs = $('.classitem:not(.this)');
                var temp = 1;//1代表不重复，0代表重复
                for (var i = 0; i < oldcs.length; i++) {
                    if (upd_classname === oldcs[i].innerHTML) {
                        temp = 0;
                    }
                }
                if (temp) {
                    startUpdClass(upd_classname);//修改分类名，upd_classname为修改后的名字
                    $(".udpclassname").val("");//清空输入框
                    $('.hiduc').css({
                        "display": "none"
                    });
                } else {
                    alert("已存在此分类");
                }
            }
        } else {
            alert("不能为空");
        }
        /*修改分类名，upd_classname为修改后的名字*/
        function startUpdClass(upd_classname) {
            var thisclass = $('.classitem.this');//获取当前准备修改的分类li
            var this_classid = thisclass.attr("data-c");//获取当前分类的id
            var this_classname = thisclass.attr("data-n");//获取当前分类的名字
            $.ajax({
                url: "http://localhost:27017/updclass",
                async: false,
                data: {
                    "this_classid": this_classid,
                    "this_classname": this_classname,
                    "upd_classname": upd_classname,
                    "query": {}
                },
                success: function (result) {
                    classPage(result);//取得result之后，在页面重新生成分类
                }
            });
        }

    });
}
/*获取所有分类*/
function getClassName() {
    $.ajax({
        url: "http://localhost:27017/findclassname",
        async: false,
        data: {"query": {}},
        success: function (result) {
            classPage(result);//取得result之后，在页面重新生成分类
        }
    });
}


/*分类事件初始化*/
function ClassInitFun() {
    getClassName();//获取所有分类
    newClassClick();//新增分类的页面交互事件
    classCre();//新增分类事件
}


/*清空列表项中的前一个.this的样式与点击控件*/
function cleanClassUD() {
    $(".hiduc").remove();
    $(".delclass").remove();
    $(".updclass").remove();
    $('.this').removeClass("this");
}
/*点击分类列表*/
function classClick() {
    $('.classitem').click(function (e) {
        e.preventDefault();
        /*被选中的class改变样式*/
        /*通过比较.this和被点击的this列表项的"data-c",判断是否点击重复*/
        if ($('.this').attr("data-c") == $(this).attr("data-c")) {
            /*console.log($('.this').attr("data-c"));
             console.log($(this).attr("data-c"));*/
        } else if (($(this).attr("data-c") == "56dab2879a78ca71f18afdb6") || ($(this).attr("data-c") == "")) {
            cleanClassUD();//清空列表项中的前一个.this的样式与点击控件
            $(this).addClass("this");
        } else {
            /*console.log($('.this').attr("data-c"));
             console.log($(this).attr("data-c"));*/
            cleanClassUD();//清空列表项中的前一个.this的样式与点击控件
            var classnamestr = $(this).text();
            $(this)
                .addClass("this")
                .append("<button class='updclass iconfont'>&#xe761;</button><button class='delclass iconfont'>&#xe6b4;</button>")
                .append("<div class='hiduc abscenter'><input class=\"udpclassname\" type=\"text\" autofocus /><button class=\"udpclassbtn iconfont\">&#xe645;</button><button class=\"hidudpclassbtn iconfont\">&#xe646;</button></div>");
            $('.udpclassname').val(classnamestr);
            classDel();//删除分类事件
            updateClassClick();//修改分类的页面交互
        }
        /*点击class后触发分类查询*/
        var thisc = $(this).attr("data-c");
        $(".crepicture input[type=\"hidden\"]").attr("value", thisc);
        var query;
        if (thisc == "") {
            query = {};
        } else {
            query = {class: thisc};
        }
        //console.log(query);
        getPicture(query);
        /*$.ajax({
         url: "http://localhost:27017/classimage",
         async: false,
         data: {"thisclassid": thisc},
         success: function (result) {
         $(".showpicture").empty();//清空图片节点
         for (var i = 0; i < result.length; i++) {
         createshowitem(".showpicture"); //生成图片节点
         var j = i + 1;
         var nowshowitem = $(".showpicture>.showitem:nth-child(" + j + ")");
         /!*console.log(nowshowitem);*!/
         nowshowitem.attr({"data-id": result[i]._id});
         nowshowitem.find(".showimg>img").attr({
         "src": "images/" + result[i].realname,
         "alt": result[i].name
         });
         nowshowitem.find(".showname").html(result[i].name);
         if (i == result.length - 1) {
         //console.log("load clickfun");
         delpicturefun();//删除图片click事件
         updpicturefun();//修改图片click事件
         }
         }
         }
         });*/
        btninit();//图片按钮事件，不能去掉
        tanchu(1, 1);//弹出层事件，不能去掉
    });
}



