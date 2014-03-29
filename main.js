/**
 * Created with JetBrains WebStorm.
 * User: Max Xu
 * Date: 14-3-5
 * Time: 下午4:31
 */

var Widget = {
    getWidget: function () {
        /**
         * Widget对象
         * @type {{}}
         */
        var widget = {};

        /**
         * 父select对象
         * @type {{}}
         */
        widget.parent = {};
        /**
         * 存储父select元素option的value的数组
         * @type {Array}
         */
        widget.parent_option_values = [];
        /**
         * 存储父select元素option的数组
         * @type {Array}
         */
        widget.parent_options = [];
        /**
         * 存储子select元素option的数组
         * @type {Array}
         */
        widget.child_options = [];

        /**
         * 存储父select元素所有的value
         * @type {Array}
         */
        widget.parentValue = new Array();
        /**
         * 存储父select元素所有的text
         * @type {Array}
         */
        widget.parentText = new Array();
        widget.childValue = new Array();
        widget.childText = new Array();

        /**
         * 获得select的options数组
         * @param 元素的ID
         * @param isParent 是否为父select元素
         * @returns {{}}
         */
        widget.getOptions = function (id, isParent) {
            if (!isParent) {
                widget.child_options = document.getElementById(id).options;
            } else {
                widget.parent_options = document.getElementById(id).options;
            }
            return widget;
        }

        /**
         * 填充JSON格式的数据，即一个对象数组，可由PHP的json_encode()方法生成
         * @param d 数组对象性
         * @param isParent 是否为父select元素
         * @returns {{}}
         */
        widget.addJSONData = function (d, isParent){
            var v = new Array();
            var t = new Array();
            var len = d.length;
            for(var i=0; i < len; i++){
                var di = d[i];
                v[i] = new Array();
                t[i] = new Array();
                for(k in di){
                    v[i].push(k);
                    t[i].push(di[k]);
                }
            }
            widget.copyData(v, t, isParent);
            return widget;
        }

        /**
         * 填充已经打包的value和text数组，也作为添加数据的辅助类
         * @param value option的value数组
         * @param text option的text数组
         * @param isParent 是否为父select元素
         * @returns {{}}
         */
        widget.copyData = function (value, text, isParent){
            var len = value.length;
            if (!isParent) {
                widget.childValue = new Array(len);
                widget.childText = new Array(len);
                widget.childValue = value;
                widget.childText = text;
            } else {
                widget.parentValue = new Array(len);
                widget.parentText = new Array(len);
                widget.parentValue = value;
                widget.parentText = text;
            }

            return widget;
        }

        /**
         * 1.0版本的数据格式。一个二维数组，按照"value,text,value,text...“的格式填充
         * @param d 二维数组
         * @returns {{}}
         */
        widget.addData = function (d) {
            var len = d.length;
            for (var n = 0; n < len; n++) {
                widget.childValue[n] = new Array();
                widget.childText[n] = new Array();
                for (var i = 0; i < d[n].length; i++) {
                    if (i % 2 == 0) {
                        // push() is not ok
                        // push() can only used for array, not item
//                        widget.childValue[n][i] = d[n][i];
                        widget.childValue[n].push(d[n][i]);
                    } else {
//                        widget.childText[n][i] = d[n][i];
                        widget.childText[n].push(d[n][i]);
                    }
                }
            }

            return widget;
        }

        /**
         * 初始化父select元素
         */
        widget.initParent = function (){
            widget.parent_options.length = 0;
            for(var n= 0, size=widget.parentValue.length; n<size; n++){
                widget.parent_options[widget.parent_options.length] = new Option(
                    widget.parentText[n][0], widget.parentValue[n][0]);
            }
        }

        /**
         * 根据父option的value改变相应子option
         * @param op 父option的value值
         */
        widget.changeOption = function (op) {
            widget.child_options.length = 0;
            for(var n=0, size=widget.childValue.length; n<size; n++){
                if(op == widget.parent_option_values[n]){
                    for (var i = 0, len = widget.childValue[n].length; i < len; i++) {
                        widget.child_options[widget.child_options.length] = new Option(
                            widget.childText[n][i], widget.childValue[n][i]);
                    }
                }
            }
        }

        /**
         * addEventListener的事件响应函数
         */
        function onChangeListener() {
            widget.changeOption(widget.parent.options[widget.parent.options.selectedIndex].value);
        }

        /**
         * 为子select元素设置监听器，从而实现级联
         * @param id 父select元素的ID
         */
        widget.setOnChangeListener = function (id) {
            widget.parent = document.getElementById(id);
            for (var n = 0, len = widget.parent.options.length; n < len; n++) {
                widget.parent_option_values.push(widget.parent.options[n].value);
            }
            widget.parent.addEventListener("change", onChangeListener, false);
        }

        return widget;
    }
};