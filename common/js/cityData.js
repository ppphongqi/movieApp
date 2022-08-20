// 全国行政区划获取
import App from '@/common/js/app.js'
let data = {
	allData: [],
    provinceData: [],
    cityData: [],
    areaData: [],
    init() {
        let _this = this,
            dataList = []
		// 在其他地方使用的时候这个接口数据可能还没返回....
        App._get('Address/getRegionList', {}, res => {
            // 数据格式化
            for (let key in res.data) {
                let item = {
                    label: res.data[key],
                    value: key
                }
                dataList.push(item)
				_this.allData = dataList
            }
            // 省
            dataList.map(val => {
                if (val.value.indexOf('0000000') !== -1) {
                    _this.provinceData.push(val)
                }
            })
            // 市
            _this.provinceData.map((province, provinceIndex) => {
                let provinceKey = province.value.substring(0, 2),
                    cityReg = new RegExp(provinceKey + '[0-9][0-9]00000')
                dataList.map(val => {
                    if (cityReg.test(val.value)) {
                        // 过滤省，筛选市
                        if (val.value.substring(2, 6) !== '0000') {
                            if (_this.cityData[provinceIndex]) {
                                _this.cityData[provinceIndex].push(val)
                            } else {
                                _this.cityData[provinceIndex] = []
                                _this.cityData[provinceIndex].push(val)
                            }
                        }
                    }
                })
            })
            // 区
            _this.cityData.map((province, provinceIndex) => {
                _this.areaData[provinceIndex] = []
                province.map((city, cityIndex) => {
                    _this.areaData[provinceIndex][cityIndex] = []
                    let specialCity = [
                            '441900000',
                            '442000000',
                            '620200000',
                            '460400000'
                        ], // 不设区的城市
                        isSpecial = specialCity.includes(city.value),
                        areaText = city.value.substring(0, (isSpecial ? 6 : city.value[2] === '9' ? 3 : 4)),
                        areaReg = new RegExp(areaText + (isSpecial ? '[0-9][0-9][1-9]' : (city.value[2] === '9'
                            ? '[0-9][0-9][1-9][0-9]{3}' : '[0-9][0-9][0-9]{3}')))

                    dataList.map(val => {
                        if (areaReg.test(val.value) && (val.value.slice(4, 6) !== '00' || isSpecial)) {
                            _this.areaData[provinceIndex][cityIndex].push(val)
                        } else if (val.label === '小榄镇' && city.value == '442000000') {
                            // fix https://weliam.coding.net/p/lingdian/bug-tracking/issues/6099/detail
                            _this.areaData[provinceIndex][cityIndex].push(val)
                        }
                    })
                })
            })
        })
    }
}
export default data
