const crypto = require('crypto');

async function initAdmin(swc, options){
	var admin = {
		name : swc.argv['-adminName'],
		password : swc.argv['-adminPassword']
	}
	if(!admin.name || !admin.password){
		swc.log.error('失败:输入错误');
		return undefined;
	}

	var adminInDb = await swc.dao.models.admins.findAndCountAll({
		where : {
			name : admin.name
		}
	})

	if(adminInDb.count !== 0){
		swc.log.error('失败:创建失败，管理员账号已存在');
		return undefined;
	}

	var source = [
		'admins',
		admin.name,
		admin.password,
		swc.config.server.public_salt
	].join('&');
	var now = +new Date();

	var newAdmin = {
		user_id : crypto.createHash('md5').update(source).digest('hex'),
		nick_name : admin.name,

		name : admin.name,
		password : crypto.createHash('md5').update([
			admin.password,
			swc.config.server.public_salt
		].join('&')).digest('hex'),

		create_at : now,
		update_at : now,
		create_by : 'root',
		update_by : 'root'
	}

	var result = await swc.dao.models.admins.create(newAdmin);
	return result;
}

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
		middlewareFilePath : `${path.resolve()}/middlewares`,
	})

	swc = await swc.registerHttpService(swc, {
		httpServiceFilePath : `${path.resolve()}/services/http`
	})

	swc = await swc.registerModel(swc, {
		modelName : "user",
		path : `${path.resolve()}/models/objects/user`
	})

	if(swc.argv['-initAdmin'] === '1'){
		var result = await initAdmin(swc, {});
		if(!result){
			swc.log.error('失败:创建管理员失败');
		}
	}

	return swc;
}