var waterFall = {
    wFmoudle: $(".showpicture"), /*容器*/
    itemWidth: 250, /*容器内单个元素单位宽度*/
    max: null, /*图片总数*/
    arr: null,
    getColumnHeight: function () {/*每列高度数组*/

        var c = Math.floor(this.wFmoudle.width() / this.itemWidth);

        /*（列数=容器宽度/单位宽度）*/
        if (this.arr == null) {
            this.arr = new Array(c);
            for (var i = 0; i < c; i++) {
                this.arr[i] = 0;
            }
        }
        return this.arr;
    },
    getMinSite: function (p) {/*获取高度最小的列*/
        return p.indexOf(Math.min.apply(null, p));
    },
    getMinHeight: function (p) {/*获取高度最小的列的高度*/
        return Math.min.apply(null, p);
    },
    getAllItem: function () {/*获取容器内所有元素*/
        return this.wFmoudle.children("div");
    },
    /*appdneListen: function () {
        var self = this;
        var getHeight = $(document).scrollTop() + (window.innerHeight || document.documentElement.clientHeight);
        /!*if (self.wFmoudle.offset().top + self.wFmoudle.height() < getHeight) {
            self.appendItem({m: self.wFmoudle});
        }*!/
        return this;
    },*/
    /*appendItem: function (parameters) {/!*添加元素*!/
        var str = null;
        var self = this;
        var allItem = this.getAllItem();
        if (allItem.length > this.max) {
        } else {
            str = "<div><a href=\"\"><img src=\"pblimg/" + pic.pnames[allItem.length] + ".jpg\" alt=\"\"/></a></div>";
            var m = parameters.m;
            m.append(str);
            self.wFlast(m, pic.pheights[allItem.length]);
        }
        return this;
    },*/
    /*wFlast: function (m, pheights) {/!*容器内最后添加的元素按瀑布流排列*!/
        var lastItem = m.children("div").last();
        var columnHeight = this.getColumnHeight();
        var self = this;
        var minSite = self.getMinSite(columnHeight);
        lastItem.css({
            "position": "absolute",
            "left": minSite * self.itemWidth + "px",
            "top": columnHeight[minSite] + "px"
        });
        columnHeight[minSite] = columnHeight[minSite] + pheights + 14;
        /!*console.log(columnHeight);*!/
        self.wFmoudle.height(self.getMinHeight(columnHeight));
        lastItem.find("img").load(function () {
            self.appdneListen();
        });
        return this;
    },*/
    wFall: function () {/*容器内所有元素按瀑布流排列*/
        var allItem = this.getAllItem();
        var columnHeight = this.getColumnHeight();
        var self = this;
        var minSite, nowItemTop, nowItemLeft;
        for (var i = 0; i < allItem.length; i++) {
            var nowItem = allItem.eq(i);
            minSite = self.getMinSite(columnHeight);
            nowItemLeft = minSite * self.itemWidth;
            nowItemTop = columnHeight[minSite];
            nowItem.css({
                "position": "absolute",
                "left": nowItemLeft + "px",
                "top": nowItemTop + "px"
            });
            columnHeight[minSite] = columnHeight[minSite] + nowItem.height() + 14;
        }
        self.wFmoudle.height(self.getMinHeight(columnHeight));
        //self.appdneListen();
        return this;
    },
    /*wFscroll: function () {/!*滚动监听，当导航条高度改变*!/
        var self = this;
        var timer = null;
        $(document).scroll(function () {
            if (self.stop) {
                return this;
            }
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                self.appdneListen();
            }, 300);
        });
        return this;
    },*/
    wFresize: function () {/*窗口监听，当容器宽高改变*/
        var self = this;
        var timer = null;
        $(window).resize(function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                self.wFmoudle.height(0);
                self.arr = null;
                self.wFall();
            }, 100);
        });
        return this;
    },
    init: function () {
        if (this.wFmoudle) {
            this.wFmoudle.height(0);
            this.arr = null;
            this.wFall().wFresize();
        }
    }
};
