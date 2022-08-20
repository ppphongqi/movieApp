import { Graphics } from './cax'
import { isWeapp, getGradient } from './util'

let measureCtx

if (isWeapp) {
  measureCtx = wx.createCanvasContext('measure0')
} else if (typeof document !== 'undefined') {
  measureCtx = document.createElement('canvas').getContext('2d')
}

class Text extends Graphics {
  constructor(option) {
    super()

    option = Object.assign({
      font: '10px sans-serif',
      color: 'black',
      textAlign: 'left',
      baseline: 'top',
      orientation: 'horizontal'
    }, option)
    this.option = option || {}
    this.text = option.text;
  }

  getWidth(word) {
    if (!measureCtx) {
      if (util.isWegame) {
        measureCtx = wx.createCanvas().getContext('2d')
      }
    }

    if (this.option.font) {
      measureCtx.font = this.option.font
    }
    return measureCtx.measureText(word || this.text).width
  }

  getHeight() {
    return this.renderBreakLine({ isMeasure: true });
  }

  render(ctx) {
	const translateLine = this.option.lineHeight ? this.option.lineHeight/1.5/2 : 0;
    ctx.fillStyle = getGradient({ option: this.option }) || this.option.color
    ctx.font = this.option.font
    ctx.textAlign = this.option.textAlign
    ctx.textBaseline = this.option.baseline
		
    if (this.option.orientation === 'vertical') { // 竖排
      this.renderVertical({ ctx });
    } else if (this.option.maxWidth && (this.getWidth() > this.option.maxWidth)) { // 换行
		  if (this.option.maxLine === 1 && this.option.warp !== 'nowarp') {
				this.renderVertical({ ctx, lineHeight: translateLine});
			} else {
				this.renderBreakLine({ ctx });
			}
    } else {
      ctx.fillText(this.text, 0, 0);
	  this.renderDecoration({ ctx, moveTo: { x: 0, y: this.option.lineHeight || 0 }, lineTo:{ x:parseInt(this.getWidth(this.text)), y: this.option.lineHeight || 0 }});
    }
		
		// console.log(this.option)
  }
	renderDecoration({ ctx, moveTo, lineTo }){
		const { decoration, color,  } = this.option
		switch (decoration){
			case 'line':
				ctx.beginPath();
				ctx.moveTo(moveTo.x, this.numberAdd(moveTo.y)  || 0);
				ctx.lineTo(lineTo.x, lineTo.y || 0);  //设置末端状态
				ctx.lineWidth = 1;  //设置线宽状态
				ctx.strokeStyle = color || "#000000" ;  //设置线的颜色状态
				ctx.stroke();
			break
		}
	}
	numberAdd(){
		const args = arguments
		let d = 0
		let sum = 0
		for (var key in args) { // 遍历所有的参数
		  // 把数字转为字符串
		  var str = '' + args[key]
		  if (str.indexOf('.') !== -1) { // 判断数字是否为小数
		    // 获取小数位的长度
		    var temp = str.split('.')[1].length
		    // 比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
		    d = d < temp ? temp : d
		  }
		}
		// 计算需要乘的数值
		var m = Math.pow(10, d)
		// 遍历所有参数并相加
		for (var val in args) {
		  sum += args[val] * m
		}
		// 返回结果
		return sum / m
	}
  /**
   * 竖排代码来自 张鑫旭大神 http://www.zhangxinxu.com/wordpress/?p=7362
   * isMeasure 如果为测量模式,只返回计算的文本高度
   */
  renderVertical({ ctx, isMeasure = false, lineHeight = 0}) {
    var arrText = this.text.split('');
    var arrWidth = arrText.map((letter) => {
      return this.getWidth(letter);
    });
    var align = ctx.textAlign;
    var baseline = ctx.textBaseline;

    let x = 0;
    let y = lineHeight || 0;
    let text = this.text;
    if (align == 'left') {
      x = x + Math.max.apply(null, arrWidth) / 2;
    } else if (align == 'right') {
      x = x - Math.max.apply(null, arrWidth) / 2;
    }
    if (baseline == 'bottom' || baseline == 'alphabetic' || baseline == 'ideographic') {
      y = y - arrWidth[0] / 2;
    } else if (baseline == 'top' || baseline == 'hanging') {
      y = y + arrWidth[0] / 2;
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // 开始逐字绘制
    arrText.forEach(function (letter, index) {
      // 是否需要旋转判断
      let code = letter.charCodeAt(0);

      if (code <= 256) {
        ctx.translate(x, y);
        // 英文字符，旋转90°
        ctx.rotate(90 * Math.PI / 180);
        ctx.translate(-x, -y);
      } else if (index > 0 && text.charCodeAt(index - 1) < 256) {
        // y修正
        y = y + arrWidth[index - 1] / 2;
      }
      ctx.fillText(letter, x + (lineHeight), y + (lineHeight)*index);

      // 旋转坐标系还原成初始态
      if (code <= 256) {
        ctx.translate(x, y);
        ctx.rotate(-90 * Math.PI / 180);
        ctx.translate(-x, -y);
      }
      // 确定下一个字符的纵坐标位置
      var letterWidth = arrWidth[index];
      y = y + letterWidth;
    });
    // 水平垂直对齐方式还原
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    return y
  }

  /**
   * isMeasure 如果为测量模式,只返回计算的文本高度
   */
  renderBreakLine({ ctx, isMeasure = false }) {
    // coolzjy@v2ex 提供的正则 https://regexr.com/4f12l 
    const pattern = /\b(?![\u0020-\u002F\u003A-\u003F\u2000-\u206F\u2E00-\u2E7F\u3000-\u303F\uFF00-\uFF1F])|(?=[\u2E80-\u2FFF\u3040-\u9FFF])/g
    //_字数矫正
	this.option.maxWidth = this.option.maxWidth - 6 - ((this.option.maxWidth / this.option.text.length) * 1 + parseInt(this.option.font) * 0.2);
    let fillText = ''
    let fillTop = 0
    let lineNum = 1
    //获取可折行的下标
    let breakLines = [];
    this.option.text.replace(pattern, function () {
      breakLines.push(arguments[arguments.length - 2] - 1);
    });

    let tempBreakLine = 0;
    for (let i = 0; i < this.option.text.length; i++) {
      if (breakLines.indexOf(i) !== -1) {
        tempBreakLine = i;
      }

      fillText += [this.option.text[i]]

      // 支持 \n 换行
	  // console.log(fillText,this.getWidth(fillText) >= this.option.maxWidth,this.option.text[i], 'fillText:', this.getWidth(fillText), 'maxWidth:',this.option.maxWidth)
      if ((this.getWidth(fillText) >= this.option.maxWidth && i < (this.option.text.length - 1)) || this.option.text[i].charCodeAt(0) === 10) {
        let tempText = '';
        if (lineNum === this.option.maxLine && i !== this.option.text.length) {
          tempText = fillText.substring(0, fillText.length - 1) + '...';
          fillText = '';
        } else {
          if (tempBreakLine === i) {
            tempText = fillText;
            fillText = '';
          } else {
            tempText = fillText.substring(0, fillText.length - (i - tempBreakLine));
            fillText = fillText.substring(fillText.length - (i - tempBreakLine), fillText.length);
          }
        }

        if (this.option.text[i].charCodeAt(0) === 10) {
          tempText = tempText.substring(0, tempText.length - 1);
        }
        !isMeasure && ctx.fillText(tempText, 0, fillTop)

        if (lineNum === this.option.maxLine && i !== this.option.text.length) {
          break;
        }

        fillTop += this.option.lineHeight || 0;
		this.renderDecoration({ ctx, moveTo: { x: 0, y: fillTop }, lineTo:{ x:parseInt(this.getWidth()), y: fillTop }});
        lineNum++
      }
    }

    if (fillText) {
			if(!isMeasure) {
				console.log(fillText,'fillText')
				 ctx.fillText(fillText, 0, fillTop);
			   this.renderDecoration({ ctx, moveTo: { x: 0, y: fillTop + this.option.lineHeight * lineNum }, lineTo:{ x:parseInt(this.getWidth(fillText)), y: fillTop + this.option.lineHeight * lineNum}});
			}
    }
    return fillTop + this.option.lineHeight
  }
}

export default Text