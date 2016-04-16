/**
 * Created by mrhop on 2016/3/5 0005.
 */



    /*
     *返回顶部
     */



    /*
     *l,t都可以设为“0,1,2”三个数
     *一共可指定9个方向，分别是：上、下、左、右、中和四个角落
     *顺序是从左到右从上到下：如右图所示		 0	  1	   2
     *									0	0,0  1,0  2,0
     *									1	0,1	 1,1  2,1
     *									2	0,2	 1,2  2,2
     */
function appendTC() {	// 以 jQuery 创建按钮、元素
    //var btn=$("<button></button>").text("Click me.").addClass('TCBtn');
    var div = $("<div><span class='pfend\'></span><canvas id='canvas' class='TCimg abscenter' data-id data-rn data-f></canvas></div>").addClass('TCDiv TChid');
    var div2 = $("<div>" +
        "<button class='filter'id='reset'>原图</button>" +
        "<hr>" +
        "<p class='filters'>" +
        "<button class='filter'id='grayscale'>灰化</button>" +
        "<button class='filter'id='sepia'>复古(怀旧)</button>" +
        "</p>" +
        "<p class='filters'>" +
        "<button class='filter'id='relief'>浮雕</button>" +
        "<button class='filter'id='invert'>反相(负片)</button>" +
        "</p>" +
        "<hr>" +
        "<p class='filters'>" +
        "<button class='filter'id='brightness'>亮度</button>" +
        "<button class='filter'id='threshold'>阈值</button>" +
        "<button class='filter'id='blur'>模糊</button>" +
        "</p>" +
        "<p class='scrollbar'>" +
        "<div class='bigvalue'>" +
        "<div class='smallvalue' data-f></div>" +
        "</div>" +
        "<span class='filtername'></span>" +
        "<span class='filtervalue'>--%</span>" +
        "</p>" +
        "<hr>" +
        "<button class='filter'id='save'>save 本地</button>" +
        "<button class='filter savegallery'id='savegallery'>保存到默认相册</button>" +
        //"<button class='filter'id='savetemp'>save 临时</button>" +
        //"<div class='temppic'id='temppic'>" +
        //"<span>临时图片</span>" +
        //"<ul class='temppiclist'id='temppiclist'></ul>" +
        "</div>" +
        "</div>").addClass('bgDiv TChid');
    $("body").append(div, div2);        // 追加新元素
}
function removeTC() {	// 以 jQuery 创建按钮、元素
    $('.TCDiv').remove();
    $('.bgDiv').remove();
}

function showTC() {
    //console.log('show TC');
    $('.TCDiv').addClass("TCshow");
    $('.bgDiv').addClass("TCshow");
    var PFend = $('.pfend');
    PFend.unbind("click");
    PFend.click(function(e){
        e.preventDefault();
        var r=confirm("退出后所有操作将丢失！\n确定退出？");
        if (r==true)
        {
            $(".TCDiv,.bgDiv").removeClass("TCshow");
            $('.smallvalue').css({"left" : 0}).attr({"data-f":""}).text("");
            $('.filtervalue').text('--%');
            $.ajax({
                url: "http://localhost:27017/deltempfilterpicture",
                type: "get",
                async: false,
                data: {},
                success: function (result) {
                    if(result){
                        $("#temppiclist").empty();
                    }else {
                        console.log("失败");
                    }
                }
            });
            getPicture({});
        }else{
        }
        /*加入清空图片处理文件夹的操作*/
    });
}

function tanchu(l,t){


    var TCBtn=$("button.editbtn");
    var TCDiv=$('div.TCDiv');
    var TCimg=$('img.TCimg');
    var tcdw=TCDiv.width(),tcdh=TCDiv.height();


    //alert(employees[1].first);
    var bgDiv=$('div.bgDiv');
    var TCbgDiv=$(".TCDiv,.bgDiv");
    /*bgDiv.click(function(){
        TCbgDiv.removeClass("TCshow");
    });*/


    function move(){
        //alert("可视区以上的滚动距离"+scrollTop);	var scrollTop=($(document).scrollTop()||$("body").scrollTop());

        var winw=$(window).width();//alert("浏览器可视区域的宽"+w);
        var winh=$(window).height();//alert("浏览器可视区域的高"+h);

        var employees = [
            { "first":0 , "last":0 },
            { "first":(winw - tcdw)/2 , "last":(winh - tcdh)/2},
            { "first":winw - tcdw , "last": winh - tcdh}
        ];
        /*TCBtn.css({
         "position":"fixed",
         "left": winw-100,
         "top": 10
         });*/
        TCDiv.css({
            "margin-left":winw*-0.7,
            "width":winw*0.7,
            "height":winh
            /*"position":"fixed",
            "left": employees[l].first,	//left: 0,//"left": "(winw - tcdw)/2",//left: winw - tcdw,
            "top": employees[t].last	//top: 0//"top": "(winh - tcdh)/2"//top: winh - tcdh*/
        });
        bgDiv.css({
            "width":winw*0.3,
            "height":winh
        });
        //alert(parseInt(employees[1].first));
    }
    move();
    $(window).scroll(function() {move();});
    $(window).resize(function(){move();  /*getfilterpicture();      获取被点击的picture进入滤镜模式*/});	//初始化$(window).resize();
}
