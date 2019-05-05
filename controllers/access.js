/**
* 控制器入口
* ）必须注意:先定义好静态路由，再定义api接口
*/
const path = require('path')
module.exports = async (swc, options)=>{
	swc = await swc.registerMysqlDao(swc, {
		servicePath : `${path.resolve()}/services/mysql/defineModel`
	});
	swc = await swc.registerStatic(swc, {
		items : [{
			path : `/${swc.config.server.bussiness_name}/public`,
			staticFilePath : `${path.resolve()}/public`
		}]
	});

	swc = await swc.registerMiddleware(swc, {
		modelName : 'authBussiness',
		path : `${path.resolve()}/middlewares/authBussiness`
	})
	swc = await swc.registerMiddleware(swc, {
		modelName : 'authAdmin',
		path : `${path.resolve()}/middlewares/authAdmin`
	})
	swc = await swc.registerMiddleware(swc, {
		modelName : 'authWechat',
		path : `${path.resolve()}/middlewares/authWechat`
	})

	swc = await swc.registerHttpService(swc, {
		httpServiceFilePath : `${path.resolve()}/services/http`
	})

	swc = await swc.registerModel(swc, {
		modelName : "user",
		path : `${path.resolve()}/models/objects/user`
	})

	return swc;
}