/*
* @param demo_id, code
*/
const crypto = require("crypto");
module.exports = {
	config : {
		path : '/api/m/demo/update',
		method : 'post',
		middlewares : [],
		model : {
			code : 2000,
			error_message : '',
			data : {}
		}
	},
	service : async (req, res, next)=>{
		var query = req.body;
		var swc = req.swc;

		if(!query.demo_id || query.demo_id.length != 32){
			req.response.code = 4005;
			req.response.error_message = "参数错误";
			next();
			return ;
		}

		if(!query.code || parseInt(query.code) != query.code){
			req.response.code = 4005;
			req.response.error_message = "参数错误";
			next();
			return ;
		}

		try{
			var selfService = await swc.dao.models.demos.findAndCountAll({
				where : {
					demo_id : query.demo_id
				}
			})
			var now = +new Date();
			var result = await selfService.rows[0].update({
				status : query.status,
				update_at : now,
				update_by : req.source.admin_user.admin_id
			});
			req.response.data = result;
			next();
		}catch(e){
			req.response.code = 5000;
			req.response.error_message = e.message;
			next();
			return ;
		}

		next();
	}
}