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
			path : '/' + swc.config.server.bussiness_name + '/res',
			staticFilePath : `./keke_stage/static/res`
		} , {
			path : '/' + swc.config.server.bussiness_name + '/admin',
			staticFilePath : `./keke_stage/static/admin`
		}, {
			path : `/${swc.config.server.bussiness_name}/public`,
			staticFilePath : `${path.resolve()}/public`
		}]
	});
	swc = await swc.registerHttpService(swc, {
		httpServiceFilePath : `${path.resolve()}/services/http`
	})

	return swc;
}