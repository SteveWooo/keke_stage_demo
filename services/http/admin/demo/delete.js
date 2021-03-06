/*
* @param demo_id
*/
const crypto = require("crypto");
module.exports = {
	config : {
		path : '/api/m/demo/delete',
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

		if(!query.demo_id){
			req.response.code = 4005;
			req.response.error_message = "参数错误";
			next();
			return ;
		}

		try{
			var result = await swc.dao.models.demos.destroy({
				where : {
					demo_id : query.demo_id
				}
			})

			req.response.data = result;
			next();
		}catch(e){
			req.response.code = 5000;
			req.response.error_message = e.message;
			next();
			return ;
		}
	}
}