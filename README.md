## 安装
1. 创建您的个人项目
2. 在你的项目中下载核心组件：
```
git clone https://github.com/stevewooo/keke_stage
```
3. 按照本项目的目录架构，依次创建以下目录
```
conf 配置文件
services
	-- http 接口文件（具体写法请参考本项目demo
	-- mysql 数据库模型定义（具体写法参考本项目demo
models 一些数据对象、模型
controllers 程序入口
middlewares 中间件，如用户鉴权逻辑
public 静态文件存放点
```
4. 启动
```
node startup.js
	-m 服务环境（默认dev。prod的区别就是回去conf目录拿conf.prod.json文件作为配置文件
	-d 是否同步初始化数据库（默认0，输入1则会同步mysql模型到数据库中
	--initAdmin 是否初始化管理员数据（默认0，输入1则进入初始化，需要输入账号密码：
	--adminName 管理员登陆账号
	--adminPassword 管理员登陆密码
```
ps. 一般启动服务流程(生产环境)：
	1、 node startup.js -m prod -d 1
	2、 node startup.js -m prod --initAdmin 1 --adminName name --adminPassword password
	3、 node startup.js -m prod

## http模块
```
module.exports = {
	config : {
		path : '/api/m/origin_sicker/add', //路由路径，实际上在前面会多加一个"/bussiness_name"（config中配置）
		method : 'post', //请求方式
		middlewares : ['authAdmin'], //中间件，按顺序添加
		model : { //respons的数据模型
			code : 2000,
			data : ''
		}
	},
	//这里就是具体的业务逻辑编写的地方了。写完next走就行。
	//最终会把req.response返回给请求方
	service : async (req, res, next)=>{
		var query = req.body;
		var swc = req.swc;

		req.response.data = 'hello world';

		next();
	}
}
```

## controller编写
1. 注册mysql模块
@param servicePath 代表定义mysql数据模型文件的文件位置
```
swc = await swc.registerMysqlDao(swc, {
	servicePath : `${path.resolve()}/services/mysql/defineModel`
});
```

2. 注册静态文件
@param.items path 路由
@param.items staticFilePath 静态文件的目录。swc会把整个目录部署出去。
```
	swc = await swc.registerStatic(swc, {
		items : [{
			path : `/${swc.config.server.bussiness_name}/public`,
			staticFilePath : `${path.resolve()}/public`
		}]
	});
```

3. 中间件注册
@param middlewareFilePath 中间件文件存放目录
```
	swc = await swc.registerMiddleware(swc, {
		middlewareFilePath : `${path.resolve()}/middlewares`,
	})
```

4. http服务注册（这个服务注册时必须在注册静态文件之后注册，不然会出现冲突）
@param httpServiceFilePath 业务文件存放目录
```
	swc = await swc.registerHttpService(swc, {
		httpServiceFilePath : `${path.resolve()}/services/http`
	})
```

5. 业务模块注册
@param modelFilePath 业务模块文件存放目录
```
	swc = await swc.registerModel(swc, {
		modelFilePath : `${path.resolve()}/models`,
	})
```