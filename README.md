# ucenter
a user center server

### api
###### baseUrl : /api/v1

#### oauth
* #### signup 
	**url**:/oauth/signup

	**method**:POST
	
	**headers**
	
	|key|type|name
	|:--|:----|:----|
	|app|String|app id 
	|secrect|String|app secrect

	**body**
	
	|param|type|name
	|:--|:----|:----|
	|mobile|String|user mobile
	|password|String|user password
	|verify_code|String|sms verify code
		
	**example**

	```js
	{
		"mobile":"13823099998",
		"password":"e10adc3949ba59abbe56e057f20f883e",
		"verify_code":"handsomegh"
	}

	```
	
	**response**
	
	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|
	|result|Object|result object|
	|-app|String|apply app id|
	|-mobile|String|user mobile|
	|-access_token|String|access token|
	|-refresh_token|String|refresh token|
	|-access_expire_at|Date|access token expire time|
	|-refresh_expire_at|Date|refresh token expire time|
	|-oauth_type|String|oauth type|

	**example**

	```js
	{
  		"code": 0,
  		"message": "operation success",
  		"result": {
    		"app": "123",
    		"mobile": "13823000000",
    		"user_id": "591400e3ecc497063706bd17",
    		"access_token": "5680f1b6bac4423e81ac80f2eab85b25",
    		"refresh_token": "dd65c360361011e784cce76a99da7708",
    		"access_expire_at": "2017-05-18T06:12:51.990Z",
    		"refresh_expire_at": "2017-06-10T06:12:51.990Z",
    		"oauth_type": "bearer"
  		}
	}

	```

* #### bearer signin 
	**note**:this api will reset the user signin status
	
	**note**:这个接口会把登陆前对应app的用户的所有token失效(互踢)
	
	**url**:/oauth/signin/bearer

	**method**:POST
	
	**headers**
	
	|key|type|name
	|:--|:----|:----|
	|app|String|app id 
	|secrect|String|app secrect

	**body**
	
	|param|type|name
	|:--|:----|:----|
	|mobile|String|user mobile
	|password|String|user password
		
	**example**

	```js
	{
		"mobile":"13823099998",
		"password":"e10adc3949ba59abbe56e057f20f883e"
	}

	```
	
	**response**
	
	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|
	|result|Object|result object|
	|-app|String|apply app id|
	|-mobile|String|user mobile|
	|-access_token|String|access token|
	|-refresh_token|String|refresh token|
	|-access_expire_at|Date|access token expire time|
	|-refresh_expire_at|Date|refresh token expire time|
	|-oauth_type|String|oauth type|

	**example**

	```js
	{
  		"code": 0,
  		"message": "operation success",
  		"result": {
    		"app": "123",
    		"mobile": "13823000000",
    		"user_id": "591400e3ecc497063706bd17",
    		"access_token": "5680f1b6bac4423e81ac80f2eab85b25",
    		"refresh_token": "dd65c360361011e784cce76a99da7708",
    		"access_expire_at": "2017-05-18T06:12:51.990Z",
    		"refresh_expire_at": "2017-06-10T06:12:51.990Z",
    		"oauth_type": "bearer"
  		}
	}

	```

* #### compatible signin 
	**note**:this api will not reset the user signin status
	
	**note**:这个接口会不把登陆前对应app的用户的所有token失效（当有可用token的时候，返回可用token，没有时生成token）
	
	**url**:/oauth/signin/bearer

	**method**:POST
	
	**headers**
	
	|key|type|name
	|:--|:----|:----|
	|app|String|app id 
	|secrect|String|app secrect

	**body**
	
	|param|type|name
	|:--|:----|:----|
	|mobile|String|user mobile
	|password|String|user password
		
	**example**

	```js
	{
		"mobile":"13823099998",
		"password":"e10adc3949ba59abbe56e057f20f883e"
	}

	```
	
	**response**
	
	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|
	|result|Object|result object|
	|-app|String|apply app id|
	|-mobile|String|user mobile|
	|-access_token|String|access token|
	|-refresh_token|String|refresh token|
	|-access_expire_at|Date|access token expire time|
	|-refresh_expire_at|Date|refresh token expire time|
	|-oauth_type|String|oauth type|

	**example**

	```js
	{
  		"code": 0,
  		"message": "operation success",
  		"result": {
    		"app": "123",
    		"mobile": "13823000000",
    		"user_id": "591400e3ecc497063706bd17",
    		"access_token": "5680f1b6bac4423e81ac80f2eab85b25",
    		"refresh_token": "dd65c360361011e784cce76a99da7708",
    		"access_expire_at": "2017-05-18T06:12:51.990Z",
    		"refresh_expire_at": "2017-06-10T06:12:51.990Z",
    		"oauth_type": "bearer"
  		}
	}

	```

* #### signout
	
	**url**:/oauth/signout

	**method**:DELETE
	
	**headers**
	
	|key|type|name
	|:--|:----|:----|
	|app|String|app id 
	|secrect|String|app secrect
	|Authorization|String|oauth type & token 
	
	**example**
	
	```js
		var headers = {
			app:1234,
			secrect:1234,
			Authorization: bearer ${token}	
		};
	```
	
	**response**
	
	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|

* #### refresh token
	
	**url**:/oauth/token

	**method**:GET
	
	**query**
	|param|type|name|
	|:--|:----|:----|
	|refresh_token|String|refresh token|
	
	**example**

	``` var url = /oauth/token?refresh_token=1234```

	**headers**
	
	|key|type|name
	|:--|:----|:----|
	|app|String|app id 
	|secrect|String|app secrect
	|Authorization|String|oauth type & token 


	**response**
	
	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|
	|result|Object|result object|
	|-app|String|apply app id|
	|-mobile|String|user mobile|
	|-access_token|String|access token|
	|-refresh_token|String|refresh token|
	|-access_expire_at|Date|access token expire time|
	|-refresh_expire_at|Date|refresh token expire time|
	|-oauth_type|String|oauth type|

	**example**

	```js
	{
  		"code": 0,
  		"message": "operation success",
  		"result": {
    		"app": "123",
    		"mobile": "13823000000",
    		"user_id": "591400e3ecc497063706bd17",
    		"access_token": "5680f1b6bac4423e81ac80f2eab85b25",
    		"refresh_token": "dd65c360361011e784cce76a99da7708",
    		"access_expire_at": "2017-05-18T06:12:51.990Z",
    		"refresh_expire_at": "2017-06-10T06:12:51.990Z",
    		"oauth_type": "bearer"
  		}
	}

	```

#### user

* #### get user info
	**url**:/user/profile

	**method**:GET

	**headers**
	
	|key|type|name
	|:--|:----|:----|
	|app|String|app id 
	|secrect|String|app secrect
	|Authorization|String|oauth type & token 

	**response**

	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|
	|result|Object|result object|
	|-user_id|String|user long id (ObjectId)|
	|-short_id|Number|user short id (Number)|
	|-chance|Number|a random number create when user signup,0~1|
	|-mobile|String|user mobile|
	
* #### update password

	**url**:/user/password

	**method**:PUT

	**headers**
	
	|key|type|name
	|:--|:----|:----|
	|app|String|app id 
	|secrect|String|app secrect
	|Authorization|String|oauth type & token 
	
	**body**
	|key|type|name
	|:--|:----|:----|
	|old_password|String|user old password
	|new_password|String|user new password

	**response**
	
	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|

* #### reset password

	**url**:/user/password

	**method**:POST

	**headers**
	
	|key|type|name
	|:--|:----|:----|
	|app|String|app id 
	|secrect|String|app secrect

	**body**
	|key|type|name
	|:--|:----|:----|
	|password|String|user new password
	|mobile|String|user mobile
	|verify_code|String|user receive sms code

	**response**
	
	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|

#### public
* #### apply sms verify code

	**url**:/public/sms/:type

	**method**:POST

	**body**
	|key|type|name
	|:--|:----|:----|
	|mobile|String|the mobile to receive sms

	**response**
	
	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|
#### admin

* #### apply app

	**url**:/admin/app

	**method**:POST

	**body**

	|param|type|name
	|:--|:----|:----|
	|app|String|app name

	**example**

	```js
	{
		"app":"1234"
	}

	```

	**response**
	
	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|
	
		
	**example**
	
	
	```js
	{
  		"code": 7001,
  		"message": "app exist"
	}

	```
* #### get app secret (for dev)

	**url**:/admin/app/:appId

	**method**:GET

	**response**
	
	|param|type|name|
	|:--|:----|:----|
	|code|Number|status code 0:success|
	|message|String|status code message|
	|result|Object|result object|
	|-{appId}|String|key=>appid value=>app secret|
		
	**example**
	
	
	```js
	{
  		"code": 0,
  		"message": "operation success",
  		"result": {
    		"1234": "a7ad0a5ae83a41c0ae25934ee02c3a13"
  		}
	}
	```
