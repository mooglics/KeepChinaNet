# electron-node-red

## 问题

- [ ] 不支持节点首尾相连
- [ ] 多个output出口在界面上无法标示进行区分，tulip中是**-1,0,1,100**等
- [ ] 连接线不支持标注，也不能手工调整连接线位置
- [ ]连接线最好有箭头显示
- [ ] 如何扩展Flow自身的配置属性,目前只有Name一个属性，需要扩展流程ID,备注，创建者等等；

## TaiHang节点实现

- [ ] 实现一个柔性参数和柔性pathCode的组件
- [ ] 实现开始节点和结束节点

## UP 节点实现



## 如何加载扩展出的node

修改文件`.node-red/setting.json`

```
nodesDir: '/home/moogle/betacat/electronapps/node-red/nodes/',
```




## red.js研究

核心js,位于`node-red/public/red`下。
通过`node-red/red/red.js`中引入`red.min.js`

#### node的svg生成实现

- Line `5296` 开始

```javascript 
node.each(function(d,i) {

output_group.append("rect").attr("class","port").attr("rx",3).attr("ry",3).attr("width",10).attr("height",10)
```

- Line 5363 增加

这里用到了一个d3的脚本库，可以动态绑定数据，enter,exit等
```javascript
output_group.append("text").attr("class","output_size").attr("x",15).attr("y",10).text(function(d) { return d;});
```



## 参考实现

### mqtt

/usr/local/lib/node_modules/node-red/nodes/core/io/10-mqtt.js
- 增加值的校验
```javascript
topic: {value:"",required:true,validate: RED.validators.regex(/^(#$|(\+|[^+#]*)(\/(\+|[^+#]*))*(\/(\+|#|[^+#]*))?$)/)},
```
- 节点配置模型中对tab的应用
- 嵌套node config 对象的配置模型

### switch

- 动态增减配置项的配置

### comment

- markdown文法

### function



