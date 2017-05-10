var util = require('../util');
var config = require('../config');
var UUID = util.UUID;
var getTimeExpires = function(second) {
    var time = new Date().getTime()
    var exprires = time + second * 1000
    return new Date(exprires)
};
/**
 * 生成全新的token
 * @return tokenInfo {object} 生成的token详情
 *         tokenInfo.accessToken {string} access token
 *         tokenInfo.refreshToken {string} refresh token
 *         tokenInfo.accessTokenExpiresOn {Date} access token的有效截止时间
 *         tokenInfo.refreshTokenExpiresOn {Date} refresh token的有效截止时间
 * @author gh
 */
var grantToken = function() {
    var uuid = new UUID();
    return {
        accessToken: uuid.v4(), refreshToken: uuid.v1(),
        // accessTokenExpiresOn: getTimeExpires(config.oauth.tockenLive),
        // refreshTokenExpiresOn: getTimeExpires(config.oauth.refreshLive)
        accessTokenExpiresOn: getTimeExpires(config.expire.accessToken),
        refreshTokenExpiresOn: getTimeExpires(config.expire.refreshToken)
    }
};
/**
 * 根据refresh token的存活时间生成合法的access token
 * @params rftExpiresOn {Date} refresh token的有效截止时间
 * @return tokenInfo {object} 生成的token详情
 *         tokenInfo.accessToken {string} access token
 *         tokenInfo.accessTokenExpiresOn {Date} access token的有效截止时间
 * @author gh
 */
var refresh = function(rftExpiresOn) {
    var uuid = new UUID();
    // var accessTokenExpiresOn = getTimeExpires(config.oauth.tockenLive);
    var accessTokenExpiresOn = getTimeExpires(config.expire.accessToken);
    accessTokenExpiresOn = accessTokenExpiresOn > rftExpiresOn
        ? rftExpiresOn
        : accessTokenExpiresOn;
    return {accessToken: uuid.v4(), accessTokenExpiresOn: accessTokenExpiresOn}
}
module.exports = {
    grantToken,
    refresh
}
