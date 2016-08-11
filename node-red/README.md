# electron-node-red



## 实际问题

交易类还需要研究需要实现的几个效果

- 不支持节点首尾相连
- 多个output出口在界面上无法标示进行区分，tulip中是**-1,0,1,100**等
- 连接线不支持标注


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

