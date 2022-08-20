/**
 * 工具类
 */
/*
 * @description: 公用方法文件
 * @author: 杨智源,吴潇
 * @update: 2018-12-26
 * 使用方式: this.$util.方法名
 */
const util = {
    /*
	* url 目标url
	* arg 需要替换的参数名称
	* arg_val 替换后的参数的值
	* return url 参数替换后的url
	*/
    changeURLArg(url, arg, arg_val) {
	    var pattern = arg + '=([^&]*)'
	    var replaceText = arg + '=' + arg_val
	    if (url.match(pattern)) {
	        var tmp = '/(' + arg + '=)([^&]*)/gi'
	        tmp = url.replace(eval(tmp), replaceText)
	        return tmp
	    }
	        if (url.match('[\?]')) {
	            return url + '&' + replaceText
	        }
	            return url + '?' + replaceText


	    return url + '\n' + arg + '\n' + arg_val
    },
    // 防抖函数
    // 防抖的概念
    // 短时间内大量触发同一事件，只会执行一次函数，实现原理为设置一个定时器，约定在xx毫秒后再触发事件处理，每次触发事件都会重新设置计时器，直到xx毫秒内无第二次操作，
    // 防抖常用于搜索框/滚动条/按钮点击 的监听事件处理，如果不做防抖，每输入一个字/滚动屏幕，都会触发事件处理，造成性能浪费
    /**
	 * func => 执行的函数体
	 * wait => 等待的时间
	 * immediate => 是否立即执行
	 */
    debounceNew(func, wait, immediate) {
	    // timeout => 控制间隔保存计时器的变量
	    // result => 执行函数如果有返回值 最后给它 return 出去
	    let timeout, result
	    // 防抖函数主体
	    let debounced = function () {
	        // debounce(doSomeing,300);
	        let context = this // 当前执行的方法的 this ，这里是 上面绑定事件的 dom
	        let args = arguments // 当前执行方法里doSomeing 的 arguments
	        if (timeout) {
                clearTimeout(timeout)
            } // 如果还在运动中 清除上一次的计时器

	        if (immediate) { // 立即执行
	            let callNow = !timeout // 默认立即执行 默认值 true
	            // timeout = setTimeout 时 = true; 在等待时间后 timeout 等于null ;用户控制 callNow 变量
	            timeout = setTimeout(() => {
	                timeout = null
	            }, wait)

	            // 如果 callNow = true 执行
	            if (callNow) {
                    result = func.apply(context, args)
                } // 改变执行函数内部this指向 ,并传入arguments

	        } else { // 非立即执行 事件结束后 等待时间 后执行
	            timeout = setTimeout(function () {
	                result = func.apply(context, args) // 改变执行函数内部this指向 ,并传入arguments
	            }, wait)
	        }
	        return result
	    }
	    // 防抖函数的取消方法
	    debounced.cancel = function () {
	        clearTimeout(timeout)
	        timeout = null
	    }
	    return debounced
    },

    //
    // 节流：
    // 防抖是延迟执行，而节流是间隔执行，函数节流即每隔一段时间就执行一次，实现原理为设置一个定时器，约定xx毫秒后执行事件，如果时间到了，那么执行函数并重置定时器，
    // 和防抖的区别在于，防抖每次触发事件都重置定时器，而节流在定时器到时间后再清空定时器
    // 应用场景 => DOM元素拖拽 射击游戏 计算鼠标距离 scroll滚动事件
    /**
	 * func => 绑定的方法
	 * wait => 间隔的时间
	 * {leading,trailing} 3中情况 不能同时为false
	 * leading => true,trailing => false, 第一次会立即执行 最后一次不会调用
	 * leading => false,trailing => true, 第一次不会立即执行 最后一次会调用
	 * leading => true,trailing => true, 第一次会立即执行 最后一次会调用
	 */
	 throttle(func, wait, options) {
	    let context, args, timeout, oldTime = 0
	    if (!options) {
            options = {}
        }
	    let later = function () {
	        oldTime = new Date().valueOf()
	        timeout = null
	        func.apply(context, args)
	    }
	    return function () {
	        context = this
	        args = arguments
	        let nowTime = new Date().valueOf()
	        // 第一次不会立即执行
	        if (options.leading === false && !oldTime) {
	            oldTime = nowTime
	        }
	        // 判断第一次进来 会不会 立即执行
	        if (nowTime - oldTime > wait) {
	            if (timeout) {
	                clearTimeout(timeout)
	                timeout = null
	            }
	            func.apply(context, args)// 间隔时间到了就可以执行
	            oldTime = nowTime
	        }
	        // 判断最后一次 会不会 执行
	        else if (!timeout && options.trailing !== false) {
	            timeout = setTimeout(later, wait)
	        }
	    }
    },
    // 数组分块
    chunk(arr, size) {
	  var arr2 = []
	  for (var i = 0;i < arr.length;i += size) {
	    arr2.push(arr.slice(i, i + size))
	  }
	  return arr2
    },
    /**
	 * lodash.get的简单实现
	 * @param {Object} object
	 * @param {Object} path
	 * @param {Object} defaultValue
	 */
    deepGet(object, path, defaultValue) {
        return (!Array.isArray(path)
            ? path.replace(/\[/g, '.').replace(/\]/g, '').
                split('.')
            : path).reduce((o, k) => (o || {})[k], object) || defaultValue
    },
    /**
	 * 时间戳格式化
	 * @param {Number} datetime 时间戳(秒)
	 * @param {String} formateType 时间戳所需处理的方式 normal(月日时分),info(年月日时分秒),rule(年月日时分秒,date(年月日)
	 * @param {String} joinType 日期间隔符号
	 * @return {String}  日期字符串
	 */
    formatTime(datetime, formateType, joinType) {
        const date = new Date(Number(datetime) * 1000),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds(),
            formatNumber = function formatNumber(n) {
                n = n.toString()
                return n[1] ? n : '0' + n
            },
            timeType = {
                normal: [
                    [
                        month,
                        day
                    ],
                    [
                        hour,
                        minute
                    ]
                ],
                info: [
                    [
                        year,
                        month,
                        day
                    ],
                    [
                        hour,
                        minute,
                        second
                    ]
                ],
                rule: [
                    [
                        year,
                        month,
                        day
                    ],
                    [
                        hour,
                        minute
                    ]
                ]
            }
        if (formateType == 'date') {
            return [
                year,
                month,
                day
            ].map(formatNumber).join(joinType)
        }
        return timeType[formateType][0].map(formatNumber).join(joinType) + ' ' + timeType[formateType][1].map(formatNumber).
            join(':')

    },

    /**
	 * 计算距离时间
	 * @param {String} dateStr 时间格式字符串 yyyy-mm-dd HH:MM:ss
	 * @return {String}  日期字符串
	 */
    dateDistance(dateStr) {
        let UNITS = {
                年: 31557600000,
                月: 2629800000,
                天: 86400000,
                小时: 3600000,
                分钟: 60000,
                秒: 1000
            },
            humanize = function (milliseconds) {
                var humanize = ''
                for (var key in UNITS) {
                    if (milliseconds >= UNITS[key]) {
                        humanize = Math.floor(milliseconds / UNITS[key]) + key + '前'
                        break
                    }
                }
                return humanize || '刚刚'
            },
            format = function (dateStr) {
                var date = parse(dateStr)
                var diff = Date.now() - date.getTime()
                if (diff < UNITS['天']) {
                    return humanize(diff)
                }
                var _format = function (number) {
                    return (number < 10 ? ('0' + number) : number)
                }
                return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
					_format(date.getHours()) + ':' + _format(date.getMinutes())
            },
            parse = function (str) { // 将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
                var a = str.split(/[^0-9]/)
                return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
            }
        return format(dateStr)
    },

    /**
	 * Base64编码解码
	 * @return {String}  Base64字符串
	 * 使用方法：new Base64().encode(String) , new Base64().decode(String)
	 */
    Base64() {
        var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

        // 编码
        this.encode = function (input) {
            var output = ''
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4
            var i = 0
            input = _utf8_encode(input)
            while (i < input.length) {
                chr1 = input.charCodeAt(i++)
                chr2 = input.charCodeAt(i++)
                chr3 = input.charCodeAt(i++)
                enc1 = chr1 >> 2
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
                enc4 = chr3 & 63
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64
                } else if (isNaN(chr3)) {
                    enc4 = 64
                }
                output = output +
					_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
					_keyStr.charAt(enc3) + _keyStr.charAt(enc4)
            }
            return output
        }

        // 解码
        this.decode = function (input) {
            var output = ''
            var chr1, chr2, chr3
            var enc1, enc2, enc3, enc4
            var i = 0
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
            while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++))
                enc2 = _keyStr.indexOf(input.charAt(i++))
                enc3 = _keyStr.indexOf(input.charAt(i++))
                enc4 = _keyStr.indexOf(input.charAt(i++))
                chr1 = (enc1 << 2) | (enc2 >> 4)
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
                chr3 = ((enc3 & 3) << 6) | enc4
                output += String.fromCharCode(chr1)
                if (enc3 != 64) {
                    output += String.fromCharCode(chr2)
                }
                if (enc4 != 64) {
                    output += String.fromCharCode(chr3)
                }
            }
            output = _utf8_decode(output)
            return output
        }

        let _utf8_encode = function (string) {
            string = string.replace(/\r\n/g, '\n')
            var utftext = ''
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n)
                if (c < 128) {
                    utftext += String.fromCharCode(c)
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192)
                    utftext += String.fromCharCode((c & 63) | 128)
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224)
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128)
                    utftext += String.fromCharCode((c & 63) | 128)
                }

            }
            return utftext
        }

        let _utf8_decode = function (utftext) {
            var string = ''
            var i = 0
            var c2 = 0,
                c1 = c2,
                c = c1
            while (i < utftext.length) {
                c = utftext.charCodeAt(i)
                if (c < 128) {
                    string += String.fromCharCode(c)
                    i++
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1)
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
                    i += 2
                } else {
                    c2 = utftext.charCodeAt(i + 1)
                    var c3 = utftext.charCodeAt(i + 2)
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
                    i += 3
                }
            }
            return string
        }
    },

    /**
	 * 获取对象里每一项的值(代替Object.values())
	 * @param {Object} obj 一个对象
	 * @return {String}  一个给定对象自身的所有属性值的数组
	 */
    objectValues(obj) {
        let valuesArray = []
        if (obj) {
            for (let key in obj) {
                valuesArray.push(obj[key])
            }
        }
        return valuesArray
    },

    /**
	 * scene解码
	 */
    scene_decode(e) {
        if (e === undefined) {
            return {}
        }
        let scene = decodeURIComponent(e),
            params = scene.split(','),
            data = {}
        for (let i in params) {
            var val = params[i].split(':')
            val.length > 0 && val[0] && (data[val[0]] = val[1] || null)
        }
        return data
    },

    /**
	 * 防止滚动触发多次函数
	 * @param {Number} wait 重复间隔
	 * @param {Function} handler 处理操作
	 */
    scorllTimert: null,
    debounce(wait, handler) {
        let that = this
        return (() => {
            // 每次触发 scroll 时先清除定时器
            clearTimeout(that.scorllTimert)
            that.scorllTimert = setTimeout(() => {
                handler()
            }, wait)
        })()
    },

    /**
	 * 获取url链接参数
	 * @param {String} name 需要获取的参数名
	 * @param {String} params url链接
	 * @param {Boolean} ishref 是否使用完整的href路径作为正则匹配的参数 默认为否
	 */
    getParams(name, params, ishref = !1) {
        var url = params
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
        var lastIndex = url.lastIndexOf('?')
        var r = !!url ? (ishref ? url.includes('?') && url.substring(lastIndex + 1).match(reg) : url.match(reg))
            : null
        if (Object.prototype.toString.call(r) == '[object Array]') {
            return r[2]
        }
        if (r != null && r) {
            return unescape(r[2])
        }
        return r || null
    },

    /**
	 * 坐标系转换
	 */
    // bd09转gcj02
    baidu_To_qq(lat, lon) {
        let x_pi = 3.14159265358979324 * 3000.0 / 180.0,
            x = lon - 0.0065,
            y = lat - 0.006,
            z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi),
            theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi),
            latitude = z * Math.cos(theta),
            longitude = z * Math.sin(theta),
            gps = {
                latitude,
                longitude
            }
        return gps
    },
    // gcj02转bd09
    qq_To_baidu(lat, lng) {
        let x_PI = 3.14159265358979324 * 3000.0 / 180.0,
            z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI),
            theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI),
            latitude = z * Math.cos(theta) + 0.0065,
            longitude = z * Math.sin(theta) + 0.006,
            gps = {
                latitude,
                longitude
            }
        return gps
    },

    /**
	 * 删除对象内值为空的键
	 * @param {Object} obj 需要处理的对象
	 */
    removeEmpty(obj) {
        const newObj = {
            ...obj
        }
        Object.keys(newObj).forEach(function (key) {
            (newObj[key] === undefined || newObj[key] === null || newObj[key] === '') && delete newObj[key]
        })
        return newObj
    },
    /**
	 * 生成唯一id
	 */
    signid(args = '') {
        // const [prefix, surplus] = [...args]
        const [prefix] = [...args]
        const uid =
			Math.floor(Math.random() * 26 + 10).toString(36) +
			new Date().getTime().
			    toString(36)
        const dif = 12 - uid.length
        const ustr = Math.floor(Math.random() * Math.pow(36, dif)).toString(36)
        return `${prefix || ''}${uid}${('000' + ustr).substr(`${ustr.length + 3 - `${dif}`}`)}`
    },

    /**
	 * 扫码进入小程序参数解析
	 * @param {String} url 扫码进入的url
	 *
	 */
    qureyDecode(url) {
        let Base64 = new this.Base64(),
            queryData = this.getParams('scene', decodeURIComponent(url), true)
        return JSON.parse(Base64.decode(queryData))
    },
    /**
	 * 去掉小数点
	 * @param {Object} num
	 */
    removePoint(num) {
        let money = num
        money += ''
        let [
            integer,
            decimal
        ] = money.split('.')
        return Number(integer) > 0 && decimal == '00' ? integer : money
    },

    /**
	 * 是否不存在手机号
	 */
    isEmptyMobile(mobile) {
        return [
            null,
            undefined,
            0,
            '0',
            ''
        ].includes(mobile)
    },
    getdate(time) {
        function getCurrentMonthFirst() {
            var date = new Date(time)
            date.setDate(1)
            return date
        }
        // 获取当前月的最后一天
        function getCurrentMonthLast() {
            var date = new Date(time)
            var currentMonth = date.getMonth()
            var nextMonth = ++currentMonth
            var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
            var oneDay = 1000 * 60 * 60 * 24
            return new Date(nextMonthFirstDay - oneDay)
        }

        return [
            getCurrentMonthFirst().getTime(),
            getCurrentMonthLast().getTime()
        ]
    }
}
export default util
