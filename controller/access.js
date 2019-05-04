/**
* 控制器入口
* ）必须注意:先定义好静态路由，再定义api接口
*/
const path = require('path')
module.exports = async (swc, options)=>{
	swc = await swc.registerMysqlDao(swc);
	swc = await swc.registerStatic(swc, {
		items : [{
			path : '/' + swc.config.server.bussiness_name + '/res',
			staticFilePath : `static/res`
		} , {
			path : '/' + swc.config.server.bussiness_name + '/admin',
			staticFilePath : `static/admin`
		}]
	});
	swc = await swc.registerHttpService(swc, {
		httpServiceFilePath : `${path.resolve()}/services/http`
	})

	return swc;
}