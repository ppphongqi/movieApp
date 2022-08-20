module.exports = function(e) {
    var g;
    if ((g = getCurrentPages()).length) {
        var r = g[g.length - 1];
        r && "pages/mainPages/login/login" != r.route && uni.setStorageSync("login_pre_page", r);
    }
    uni.redirectTo({
        url: "/pages/mainPages/login/login"
    });
};