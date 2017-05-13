# Ucenter
* #### model设计
	* redis
		* app.js
			|key|type|name
			|:--|:----|:----
			|apps|hash|hget apps {appId} =>{app secret}
		* token.js
			|key|type|name
			|:--|:----|:----
			|token:${token}|hash|key为token的值|
			|-access_token|hash field|access token
			|-refresh_token|hash field|refresh token
			|-app_id|hash field|token 对应的app
			|-user_id|hash field|token对应的user id （objectId）
			|-user_short_id|hash field|token对应的user 短id
			|-expire_at|hash field|token 到期日期（timestamp）
			|-type|hash field|token类型 （access_token/refresh_token）
		* user.js
			|key|value|name
			|:--|:--|:--
			|user:total:${app}|keys|存储app对应的用户总数
			|${year}-${month}-${today}:${app}|bitmap|存储每个app每日每个用户的在线状态和在线总数（详情可搜索如何用bitmap存储用户访问信息）
			
	* mongo
		* user.js
			|key|type|name
			|:--|:----|:----|
			|_id|ObjectId|mongo主键
			|short_id|Number|用户短id 基于redis.userTotalCount
			|name|String|用户名
			|mobile|String|用户注册手机
			|apps|Array|用户关联的apps，以appId组成的Array
			|status|Number|用户状态 0:active 1:baned 
			|create_at|Date|用户创建日期
			|chance|Number|创建的时候随机生成的0~1数，用于随机选取用户
			索引：
			```js
			  	users.index({create_at: -1});
			    users.index({name: 1});
			    users.index({mobile: 1});
			    users.index({short_id: 1});
			```
		* app.js
			|key|type|name
			|:--|:----|:----|
			|_id|ObjectId|mongo主键
			|app_id|String|app 独立的id，每个app唯一
			|user_id|String|关联用户表的_id
			|password|String|用户密码
			|status|Number|用户状态 0:active 1:baned 
			|create_at|Date|用户改app的注册时间
			|update_at|Date|用户信息更新时间
			|last_login|Date|上次登录时间
			|last_refresh|Date|上册refresh token 时间
			|login_times|Number|登陆次数
			索引：
			```js
			    apps.index({app_id: 1, user_id: 1});
			```
		* token.js
			|key|type|name
			|:--|:--|:--
			|_id|ObjectId|mongo主键
			|user_id|String|token关联用户表的_id
			|app_id|String|token关联的app_id
			|access_token|String|access token
			|refresh_token|String|refresh token
			|access_expire_at|Date|access token 的到期时间
			|refresh_expire_at|Date|refresh token 的到期时间
			|platform|Array|使用过的平台
			索引：
			```js
			    tokens.index({app_id: 1, user_id: 1});
			```
		
	
* #### 工程目录
	
	![untitled4.png](//dn-cnode.qbox.me/FsWYl1Q1QCrcVPUJie7_gLUFCskN)
	
	* common 
		
		- const.js 存放静态变量
		- error.map.js 存放错误码
	
	* config
		- config.dev.js 存放开发环境配置
		- config.workong.js 开发环境配置示例
		- config.production.js 存放生产环境配置
		- index.js 根据运行环境返回配置文件

	* controller 业务逻辑存放的文件目录

	* dao 数据库代理文件夹
		- mongo 对mongo的数据操作
		- sql 对sql的数据操作
		- redis 对redis的数据操作
	* logs 日志文件夹
	* midware 
		- filter 该文件夹下的文件基于业务分类，封装了每个接口的数据过滤中间件
		- auth.js 验证中间件，验证token的合法性等用途
		- log.js 我使用的是使用log4js，所以基于业务配置了不同的appender
			这里放一点代码解释会实际一点
			```js
			const log4js = require('log4js'),
    			  adminLogger = log4js.getLogger('admin'),
    			  oauthLogger = log4js.getLogger('oauth'),
   				  commonLogger = log4js.getLogger('common'),
  				  userLogger = log4js.getLogger('user');
			var user = async(ctx, next) => {
    			  ctx.logger = userLogger;
   				  await next()
			};   
			```
	* model 数据库model定义

	* router 路由定义

	* service 第三方服务等封装，例如我把密码加密，验证放在了这里做成一个服务，token也封装成一个服务，这样以后更改密码加密形式或者token加密形式的时候就可以直接在这里改。

		- passport.js 
			```js
			var bcrypt = require('bcrypt');
			var Promise = require('bluebird');
			var config = require('../config');
			Promise.promisifyAll(bcrypt);
			/**
			 * 加盐加密
			 * @param password {string} 原始密码
			 * @return hash {object} 加密密码
			 * @author gh
			 */
			var encrypt = async function(password) {
			    var salt = await bcrypt.genSaltAsync(config.password.saltTimes);
			    var hash = await bcrypt.hashAsync(password, salt);
			    return hash;
			};
			/**
			 * 密码对比
			 * @param password {string} 原始密码
			 * @param hash {string} 加密密码
			 * @return res {boolean} 比对结果 true:密码匹配 | false:密码不匹配
			 * @author gh
			 */
			var validate = async function(password, hash) {
			    var res = await bcrypt.compareAsync(password, hash);
			    return res
			};
			module.exports = {
			    encrypt,
			    validate
			}
			``` 
	* test 测试用例文件夹			
	* util 工具类的封装
