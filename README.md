# ucenter
a user center server

### api
###### baseUrl : /api/v1
#### admin
* ####apply app

	**url**:/admin/app

	**method**:post

	**body**

	|param|type|name
	|:--|:----|:----|:---|
	|app|String|app name

	**example**

	```js
	{
		"app":"1234"
	}

	```

	**response**
	
	|param|type|name
	|:--|:----|:----|:---|
	|code|Number|status code 0:success 
	|message|String|status code message
	
	**example**
	
	
	```js
	{
  		"code": 7001,
  		"message": "app exist"
	}

	```
