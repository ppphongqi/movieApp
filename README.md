# 说明
## 打包流程
### 微信小程序打包流程
需要修改version.json如下
```json
{
	"siteroot": "https://zerodev.weliam.com.cn/",
	"uniacid": "1",
	"name": "weliam_areashop",
	"edition": "we7",
	"weliamv": "1.1.0.5"
}
```
需要修改源码试图->h5.router.base为/addons/weliam_areashop/web/h5/