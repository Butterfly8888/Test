//制作一个工具对象，内部添加多种工具的方法
(function(){
    var Tools={
        getRandom: function(min,max) {
            min = Math.ceil(min);
            max = Math.ceil(max);
            return Math.floor(Math.random()*(max-min+1))+min;//含最大值，最小值
        },
        //获取随机颜色的方法
        gerColors:function(){
            var r=this.getRandom(0,255);
            var g=this.getRandom(0,255);
            var b=this.getRandom(0,255);
            //返回一个颜色值
            return "rgb("+r+","+g+","+b+")";
        }
    };
    window.Tools=Tools;
})();