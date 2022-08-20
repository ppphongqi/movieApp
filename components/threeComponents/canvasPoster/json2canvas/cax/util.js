/**
 * 根据配置获取渐变色
 * @param {*} param0 
 */
function getGradient({
	option
}) {
	let gradient = null;
	if (option.linearGradient && option.colors) {
		gradient = getCtx().createLinearGradient(...option.linearGradient);
		for (let i = 0; i < option.colors.length; i++) {
			gradient.addColorStop(...option.colors[i]);
		}
	}
	return gradient;
}

function getCtx() {
	if (isWeapp) {
		return uni.createCanvasContext('measure0')
	} else if (typeof document !== 'undefined') {
		return document.createElement('canvas').getContext('2d')
	}
	return null;
	// return isWeapp ? stage.ctx : stage.canvas.getContext("2d")
}

function copy(obj) {
	return JSON.parse(JSON.stringify(obj));
}
// let isWeapp = typeof uni !== 'undefined' && !uni.createCanvas && uni.createCanvasContext;
// let isWegame = typeof uni !== 'undefined' && uni.createCanvas;
let isWeapp = false;
let isWegame = false;
// #ifdef MP
isWeapp = true;
// #endif
// #ifdef H5
isWeapp = false;
// #endif


const TYPE = {
	rect: 'rect',
	circle: 'circle',
	image: 'image',
	text: 'text',
	group: 'group'
};

const COLORS = {
	none: 'transparent'
};
export {
	getGradient,
	isWeapp,
	isWegame,
	TYPE,
	COLORS,
	copy
}
