//将所有的模块代码按照一定的顺序引入
// ========================Tools=============================
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
// =========================Food部分=========================
(function(){
    //全局的变量
        var ps="absolute";
        //创建食物的构造函数
    function Food(option){
        //避免传入的参数数据类型不对，或者没有传参
        option=option instanceof Object ? option : {};
        //传入的数据可能是类似数组等对象，所有需要进一步判断
        this.width=option.width || 20;
        this.height=option.height || 20;
        this.x=option.x || 0;
        this.y=option.y || 0;
        this.color=option.color || "green";
        //增加一个属性，存储将来这个对象渲染出来的所有div元素
        this.elements=[];
    }
    
    //渲染一个元素到页面之上，需要添加到原型对象的方法中
    
    Food.prototype.render=function (map){
        //创建一个新的div元素
        var ele=document.createElement("div");
        //每次设置样式之前，都随机获取一个x和y的值
        this.x=Tools.getRandom(0,map.clientWidth / this.width-1)*this.width;
        this.y=Tools.getRandom(0,map.clientHeight / this.height-1)*this.height;
        //添加对应的样式
        ele.style.width=this.width+"px";
        ele.style.height=this.height+"px";
        ele.style.left=this.x+"px";
        ele.style.top=this.y+"px";
        ele.style.backgroundColor=this.color;
        ele.style.position=ps;
        //让新元素添加到指定的父级中
        map.appendChild(ele);
        //将新元素添加到数组中，方便后期调用删除
        this.elements.push(ele);
    };
    //删除一个食物div元素
    Food.prototype.remove=function(map,i){
        //可以通过一些方法获取要被删除的食物的下标
        //将元素 从 html 结构中删除
        map.removeChild(this.elements[i]);
        //将元素从数组中删除
        this.elements.splice(i,1);
    };
    
    //利用window对象暴露Food函数，可以给外部使用
    window.Food=Food;
    })();
    // ============================snake============================
    (function(){
        //全局变量
        var ps="absolute";
        //创建蛇的构造函数
        function Snake(option){
            option=option instanceof Object ? option : {};
            //给对象添加属性
            //设置蛇节的宽度和高度属性
            this.width=option.width || 20;
            this.height=option.height || 20;
            //设置蛇身的数据
            this.body=[
                {x:3,y:2,color:"red"},
                {x:2,y:2,color:"blue"},
                {x:1,y:2,color:"blue"}
            ];
            //设置蛇移动的方向,还可以设置为left top bottom
            this.direction="right";
            // 添加一个元素的数组，存储所有渲染的 div
            this.elements = [];
        }
        //添加一个将元素渲染到页面上的方法
        Snake.prototype.render = function(map){
            //生成对应个数的div元素，遍历数组
            for(var i=0,len=this.body.length ; i<len ; i++){
                //根据数组的每一项的数据生成一个新的div元素
                var piece = this.body[i];
                //创建新元素
                var ele=document.createElement("div");
                ele.style.width=this.width + "px";
                ele.style.height=this.height + "px";
                ele.style.left=piece.x * this.width + "px";
                ele.style.top=piece.y * this.height+ "px";
                ele.style.position=ps;
                ele.style.backgroundColor=piece.color;
                //渲染到指定的父级内部
                map.appendChild(ele);
                // 将添加的新元素存在数组里
                 this.elements.push(ele);
            } 
        };
        //添加 蛇 运动的方法
        Snake.prototype.move = function(){
            //蛇身的每一节都要变成上一节的位置
            //循环需要从最后一项开始，避免前面的数据发生变化
            for(var i=this.body.length-1;i>0;i--){
                this.body[i].x=this.body[i-1].x;
                this.body[i].y=this.body[i-1].y;
            }
            //存储一下蛇头的数据
            var head=this.body[0];
            //蛇头要根据方向发生位置变化
            switch(this.direction){
                case "right":
                    head.x+=1;
                    break;
                case "left":
                    head.x-=1;
                    break;
                case "top":
                    head.y-=1;
                    break;
                case "bottom":
                    head.y+=1;
                    break;
            }
        };
        //删除上一次渲染的蛇的所有div元素
      Snake.prototype.remove = function (map) {
        // 遍历数组删除所有元素
        // 将元素从html结构中删掉
        for (var i = this.elements.length - 1; i >= 0; i--) {
          map.removeChild(this.elements[i]);
        }
        // 数组也需要进行清空
        this.elements = [];
      }
        window.Snake=Snake;
    })();
    //=========================Game============================
    (function(){
        //创建一个游戏的构造函数
        //定义全局变量
        var that;
        function Game(map){
            //设置三个属性，存储 食物、蛇、地图
            this.food=new Food();
            this.snake=new Snake();
            this.map=map;
            that=this;
        }
        //添加一个游戏开始的方法，方法内初始化蛇和食物
        Game.prototype.start=function(){
            //1.添加蛇和食物到地图上
            this.food.render(this.map);
            this.food.render(this.map);
            this.food.render(this.map);
            this.snake.render(this.map);
            //2.让游戏逻辑开始
            //2.1 让蛇自动运动起来
            runSnake();
            bindKey();
            //2.2通过上下左右箭头控制蛇的运动方向
           
            //2.4判断是否超出地图范围，结束游戏
    
        };
    
        //封装一个私有函数控制上下左右按键更改的方向
        function bindKey(){
            //给整个文档绑定按下事件
            document.onkeydown=function(e){
                // console.log(e.keyCode);
                //键盘的编码
                //37=left 38=top 39=right 40=bottom 
                switch(e.keyCode){
                    case 37:
                        that.snake.direction="left";
                        break;
                    case 38:
                        that.snake.direction="top";
                        break;
                    case 39:
                        that.snake.direction="right";
                        break;
                    case 40:
                        that.snake.direction="bottom";
                        break;
                }
            };
        }
        //封装一个私有函数，这个函数只能在模块内部进行调用
        function runSnake(){
            //开启一个定时器，让蛇连续运动起来
            var timer=setInterval(function(){
                //定时器内部的this指向的是window
                //让蛇运动起来
                that.snake.move();
                //删除上一次的蛇
                that.snake.remove(that.map);
                //渲染新位置的蛇
                that.snake.render(that.map);
                  //记录一下最大的位置
                var maxX=that.map.offsetWidth / that.snake.width;
                var maxY=that.map.offsetHeight / that.snake.height;
                //找到当前蛇头的位置
                var headX=that.snake.body[0].x;
                var headY=that.snake.body[0].y;
                //每一次蛇走到新的位置，都要判断一下是否吃到食物了
                //2.3判断蛇头与食物是否碰撞，吃掉食物，让自己增加一节
                //记录一下食物的坐标
                // var foodX=that.food.x;
                // var foodY=that.food.y;
                //获取蛇头的具体坐标位置，px值
                var hX=headX*that.snake.width;
                var hY=headY*that.snake.height;
                //判断
                //将食物的数组中每一个都进行对比
                for(var i=0; i<that.food.elements.length ; i++){
                    if(that.food.elements[i].offsetLeft === hX && that.food.elements[i].offsetTop === hY){
                        //吃到了食物
                        //让食物删除，然后渲染一个新的食物
                        that.food.remove(that.map,i);
                        that.food.render(that.map);
                        //添加一个新的蛇节
                        var last=that.snake.body[that.snake.body.length-1];
                        that.snake.body.push({
                            x:last.x,
                            y:last.y,
                            color:last.color
                        });
                    }
                }
    
                //每移动一次，都要判断是否出了地图，游戏是否结束
              
                //进行判断
                if (headX<0 ||headX >= maxX || headY<0 || headY >= maxY){
                    //停止定时器
                    clearInterval(timer);
                    //弹出提醒
                    alert("Game over");
                }
            },300);
        }
        //将构造函数通过window暴露
        window.Game=Game;
    })();

    //=========================main==================================
    (function(){
        var map=document.getElementById("map");
        var game=new Game(map);
        game.start();
    })(); 