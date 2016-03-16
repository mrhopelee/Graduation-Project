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
    var div = $("<div><img class=\"TCimg\" src=\"\" alt=\"\" /></div>").addClass('TCDiv');
    var div2 = $("<div></div>").addClass('bgDiv');
    $("body").append(div, div2);        // 追加新元素
}
function tanchu(l,t){


    var TCBtn=$("button.editbtn");
    var TCDiv=$('div.TCDiv');
    var TCimg=$('img.TCimg');
    var tcdw=TCDiv.width(),tcdh=TCDiv.height();


    //alert(employees[1].first);
    var bgDiv=$('div.bgDiv');
    var TCbgDiv=$(".TCDiv,.bgDiv");
    TCBtn.click(function(){
        TCbgDiv.fadeIn("slow");
        var thisbtn = $(this);
        var thisshowitem = thisbtn.parents(".showitem");
        var thisid = thisshowitem.find("input[type=\"hidden\"]").attr("value");
        var thisimg = thisshowitem.find(".showimg>img");
        TCimg.attr({
            "src":thisimg.attr("src"),
            "alt":thisimg.attr("alt")
        });
    });
    bgDiv.click(function(){
        TCbgDiv.fadeOut("slow");
    });

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

            "position":"fixed",
            "left": employees[l].first,	//left: 0,//"left": "(winw - tcdw)/2",//left: winw - tcdw,
            "top": employees[t].last	//top: 0//"top": "(winh - tcdh)/2"//top: winh - tcdh
        });
        //alert(parseInt(employees[1].first));
    }
    move();
    $(window).scroll(function() {move();});
    $(window).resize(function(){move();});	//初始化$(window).resize();
}
