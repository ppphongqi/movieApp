import cax from "./cax/cax.js";
import {
	isWeapp,
	TYPE,
	COLORS,
	copy
} from "./cax/util";
import Text from "./cax/text";
import Graphics from "./cax/graphics";
import TreeModel from "../treeModel";
import App from '@/common/js/app.js'
import Util from '@/common/js/util.js'
const tree = new TreeModel();

let stage = null;
let imageMap = new Map();

function draw(option, selecter, page = null, callback) {
	const channel = App.getClientType();
	const root = tree.parse(Object.assign({
		scale: 1,
	}, copy(option)));
	restElement(root);
	const params = [root.model.width * root.model.scale, root.model.height * root.model.scale, {
		selecter,
		callback
	}];
	if (isWeapp) {
		stage = new cax.Stage(...params, page);
	} else {
		stage = new cax.Stage(...params);
	}
	//兼容渠道整体缩放
	const {
		scaleX,
		scaleY
	} = handleChannel(channel, option);
	stage.scale = root.model.scale * scaleX
	// stage.scaleY = root.model.scale * scaleY

	/**
	 * 1.处理需要加载的url 
	 * 2.parent背景处理
	 */
	let urls = [];
	let loadImages = [];
	root.all().forEach((item, index) => {
		let option = item.model;
		if (option.url && !urls.includes(option.url)) {
			urls.push(option.url);
			loadImages.push(loadImage(option.url));
		}

		if ((option.type === TYPE.group || index === 0) && option.width && option.height) {
			if (option.url) {
				let groupBg = {
					type: TYPE.image,
					width: option.width,
					height: option.height,
					url: option.url
				}
				item.addChildAtIndex(tree.parse(groupBg), 0)
			} else if (option.fillStyle) {
				let groupBg = copy(option);
				delete groupBg.children;
				groupBg.type = TYPE.rect;
				groupBg.x = 0;
				groupBg.y = 0;

				item.addChildAtIndex(tree.parse(groupBg), 0)
			}
		}
	});
	Promise.all(loadImages).then((results) => {
		results.forEach(({
			url,
			bitmap
		}) => {
			imageMap.set(url, bitmap);
		});
		stage.add(handleGroup({
			option: root.model
		}));
		setTimeout(() => {
			stage.update();
			setTimeout(() => {
				callback && callback(results);
			}, 500)
		}, 500)
	});

}

function handleChannel(channel, {
	width,
	height
}) {
	let scale = {
		scaleX: 1,
		scaleY: 1
	};
	const {
		screenWidth,
		screenHeight
	} = uni.getSystemInfoSync()
	let proportion = 1;
	switch (true) {
		case (channel == '2' || channel == '3' || channel == '4'):
			if (screenWidth !== width) {
				proportion = screenWidth / width
			}
			break
	}
	scale.scaleX = (width / screenWidth) * proportion;
	scale.scaleY = (height / screenHeight) * proportion;
	return scale;
}

function handleGroup({
	option,
	parent
}) {
	const caxGroup = new cax.Group();
	option.width && (caxGroup.width = option.width);
	option.height && (caxGroup.height = option.height);

	setPosition(caxGroup, option, parent);

	option.children && option.children.forEach((child) => {
		let ele = null;
		let param = {
			option: child,
			parent: caxGroup
		};
		switch (child.type) {
			case TYPE.group:
				ele = handleGroup(param);
				break;
			case TYPE.rect:
			case TYPE.circle:
				ele = handleGraphics(param);
				break;
			case TYPE.image:
				ele = handleImage(param);
				/*
				 兼容多张图同src无法加载对应图片资源问题
				*/
				if (!ele.img) {
					ele.img = imageMap.get(ele.url)['img']
				}
				break;
			case TYPE.text:
				ele = handleText(param);
				break;
		}
		ele && caxGroup.add(ele);
	});
	return caxGroup;
}

function handleGraphics({
	option,
	parent
}) {
	const ele = new Graphics(option);
	setPosition(ele, option, parent);
	return ele;
}

function handleImage({
	option,
	parent
}) {
	let bitmap = imageMap.get(option.url);
	if (bitmap) {
		const {
			x,
			y,
			width: ow,
			height: oh,
			radius
		} = option;
		//标记位,如果一张图用到两次,应该clone.
		if (bitmap.used) {
			bitmap = bitmap.clone()
		} else {
			bitmap.used = true;
		}

		bitmap.url = option.url;

		let width = bitmap.width;
		let height = bitmap.height;


		bitmap.scaleX = option.width / width;
		bitmap.scaleY = option.height / height;
		// if(option.width !== option.height || (width !== height && !option.isCircular) || (option.width == option.height && option.isCircular && Object.keys(option).includes('radius'))){
		// 	bitmap.scaleX = option.width / width;
		// 	bitmap.scaleY = option.height  / height;
		// } else {
		// 	bitmap.scaleX = option.width / width;
		// 	bitmap.scaleY = option.height  / height;
		// 	// bitmap.scale = (height > width ? option.width / width : option.height / height);
		// 	// option.x = option.x - option.x  *  (option.height / height);
		// 	// option.y = option.y - option.y * (option.width / width);
		// }
		// console.log(bitmap.scaleX, bitmap.scaleY)
		setPosition(bitmap, option, parent);

		//圆角
		if (option.isCircular) {
			const clipPath = new cax.Graphics();
			const xe = width;
			const ye = height;
			const xm = width / 2;
			const ym = height / 2;
			//区分矩形和正方形
			if (Object.keys(option).includes('radius') && radius > 0) {
				clipPath.beginPath()
					.arc(xe - radius, ye - radius, radius, 0, Math.PI / 2) //右下圆弧
					.lineTo(radius, ye) //下边线
					.arc(radius, ye - radius, radius, Math.PI / 2, Math.PI) //左下圆弧
					.lineTo(0, radius) //左边线
					.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2) //左上圆弧
					.lineTo(xe - radius, 0) //上边线
					.arc(xe - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2) //右上圆弧
					.lineTo(xe, ye - radius) //右边线
					.strokeStyle(COLORS.none)
					.closePath()
					.stroke();
				bitmap.clip(clipPath);
			} else {
				if (option.width === option.height) {
					clipPath.beginPath()
						.arc(width / 2, height / 2, (width > height ? height : width) / 2, 0, Math.PI * 2)
						.closePath()
						.strokeStyle(COLORS.none)
						.stroke();
					bitmap.clip(clipPath);
				} else {
					//处理椭圆
					const k = 0.5522848;
					const ox = width / 2 * k;
					const oy = height / 2 * k;

					clipPath.beginPath()
						.moveTo(0, ym)
						.bezierCurveTo(0, ym - oy, xm - ox, 0, xm, 0)
						.bezierCurveTo(xm + ox, 0, xe, ym - oy, xe, ym)
						.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
						.bezierCurveTo(xm - ox, ye, 0, ym + oy, 0, ym)
						.strokeStyle(COLORS.none)
						.stroke();
					bitmap.clip(clipPath);
				}
			}
		}
		return bitmap;
	}
	return null;
}

function handleText({
	option,
	parent
}) {
	const text = new Text(option);
	// console.log(text, 'handleText');
	// const text = new cax.Text(option.text, option);
	if (option.shadow) {
		text.shadow = option.shadow;
	}
	setPosition(text, option, parent);

	return text;
}

/**
 * 处理元素的位置
 * @param {*} ele canvas元素
 * @param {*} option 配置参数
 * @param {*} parent 父元素,用于计算相对位置
 */
function setPosition(ele, option, parent) {
	_setPosition({
		ele,
		option,
		value: 'x',
		parent
	});
	_setPosition({
		ele,
		option,
		value: 'y',
		parent
	});
}

/**
 *
 * @param ele 处理的方向关键词 center / bottom
 * @param option
 * @param value 【x,y】
 */
function _setPosition({
	ele,
	option,
	value,
	parent
}) {
	switch (option[value]) {
		case 'center':
			switch (option.type) {
				case TYPE.image:
					ele[value] = (parent.width - ele.width * ele.scale) / 2;
					break;
				case TYPE.text:
					ele[value] = (parent.width - ele.getWidth()) / 2;
					break;
			}
			break;
		case 'bottom':
			switch (option.type) {
				case TYPE.image:
					ele[value] = (parent ? parent.height : (option.height / option.scale)) - ele.height * ele.scale;
					break;
				case TYPE.rect:
				case TYPE.group:
					ele[value] = (parent ? parent.height : (option.height / option.scale)) - option.height;
					break;
			}
			break;
		default:
			switch (option.type) {
				case TYPE.circle:
					ele[value] = option[value] + option.r;
					break;
				default:
					ele[value] = option[value] || 0;
					break;
			}
	}
}

/**
 * 加载图片
 */
function loadImage(url, bitmap) {
	return new Promise((resolve, reject) => {
		if (isWeapp) {
			uni.getImageInfo({
				src: url,
				success(res) {
					new cax.Bitmap(res.path.startsWith('http') ? res.path : url, function() {
						resolve({
							url,
							bitmap: this
						});
					});
				},
				fail(res) {
					resolve({
						url,
						bitmap: null
					});
				},
				complete(res) {
					console.log(res)
					if (res.errMsg !== "getImageInfo:ok" && !!url) {
						let imgUrl = `https://${url.split("/")[2]}`;
						uni.showModal({
							title: "海报生成有误",
							content: `图片域名${imgUrl}不在小程序downloadFile合法域名列表中,或者图片不存在,请检查后重试`,
							showCancel: false
						})
					}
				}
			});
		} else {
			const img = new Image()
			img.setAttribute("crossOrigin", 'Anonymous')
			img.onload = function() {
				const bitmap = new cax.Bitmap(this);
				// bitMapCatch.push(bitmap);
				resolve({
					url,
					bitmap
				});
			};


			img.onerror = function(res) {
				console.error(res);
				resolve({
					url,
					bitmap: null
				});
			};

			img.src = decodeURIComponent(`${url}&timer=${Util.signid('Img')}`);
		}
	});
}

function downloadFile(url, name = 'file_img') {
	var a = document.createElement("a")
	a.setAttribute("href", url)
	a.setAttribute("download", name)
	a.setAttribute("target", "_blank")
	let clickEvent = document.createEvent("MouseEvents");
	clickEvent.initEvent("click", true, true);
	a.dispatchEvent(clickEvent);
	console.log(a, 'downloadFile')
}

function downloadFileByBase64(base64, name) {
	var blob = dataURLtoFile(base64)
	var url = URL.createObjectURL(blob)
	downloadFile(url, name)
}

/**
 * base64转blob
 */
function dataURLtoFile(dataurl) { // 将base64转换为文件
	const hasSplit = dataurl.includes(',')
	const arr = hasSplit ? dataurl.split(',') : dataurl;
	const mime = hasSplit ? arr[0].match(/:(.*?);/)[1] : 'png'
	const bstr = hasSplit ? atob(arr[1]) : atob(arr)
	let n = bstr.length
	const u8arr = new Uint8Array(n)

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}

	return new Blob([u8arr], {
		type: 'image/png'
	});
}

/**
 * 更新元素位置
 * @param {} root 
 */
function restElement(root) {
	root.all().forEach((item) => {
		let option = item.model;
		if (option.type === TYPE.text && option.height === 'auto') {
			let text = new Text(option);
			let height = text.getHeight() - (option.uiheight || 0);
			console.log(height);

			item.getPath().forEach((node, index, array) => {
				//更新父元素的高度
				if (index !== (array.length - 1)) {
					node.model.height += height;
				}

				// 更新兄弟元素y值
				if (index !== 0) {
					let parent = array[index - 1];
					parent.children.slice(node.getIndex() + 1, parent.children.length).forEach((item) => {
						if (!item.model.pin) {
							item.model.y += height;
						}
					});
				}
			});
		}
	});
}

export {
	draw
}
