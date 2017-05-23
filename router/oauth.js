const Router = require('koa-router'),
    config = require('../config'),
    oauthCtr = require('../controller/oauth'),
    userCtr = require('../controller/user'),
    authMid = require('../midware/auth'),
    filter = require('../midware/filter/oauth'),
    router = new Router();
router.post('/signup', filter.signup, authMid.verifySMS(config.smsType.signup.name), userCtr.create, oauthCtr.grantToken, oauthCtr.bearerReply);
router.post('/signin/bearer', filter.signin, oauthCtr.signin, oauthCtr.grantToken, oauthCtr.bearerReply);
router.post('/signin/compatible', filter.signin, oauthCtr.signin, oauthCtr.getExistToken, oauthCtr.grantToken);
router.delete('/signout', authMid.getTokenInfo, oauthCtr.signout);
router.get('/token', oauthCtr.refresh, oauthCtr.bearerReply);
//oauth2
router.get('/github', oauthCtr.redirectGithub);
router.get('/callback/github', oauthCtr.githubCallback, oauthCtr.getGitHubUserInfo, oauthCtr.getOauthUserInfo, oauthCtr.grantToken, oauthCtr.bearerReply);
module.exports = router;
