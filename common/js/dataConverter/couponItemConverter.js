import Utils from '@/common/js/util.js'

/**
 * 转换优惠券数据
 */
export const couponItemConverter = (item = {}) => {
    // 商品数量
    const goods = Utils.deepGet(item, 'goods', [])
    // 商品的数量
    const goodsLen = goods.length
    // 优惠券样式 0:全品类样式，1:一个商品样式，2:三个商品样式
    let styleType
    if (+item.suit_goods_type === 0) {
        styleType = 0
    } else if ([
        1,
        3,
		4
    ].indexOf(+item.suit_goods_type) !== -1 && goodsLen === 1) {
        styleType = 1
    } else if ([
        1,
        3,
		4
    ].indexOf(+item.suit_goods_type) !== -1) {
        styleType = 2
    }
    // 优惠券类型10:满减券, 20:折扣券, 30:运费券, 40:随机券
    const couponType = item.coupon_type
    const couponTypeText = ({
        '10': '满减券',
        '20': '折扣券',
        '30': '运费券',
        '40': '随机券'
    })[couponType]
    // 优惠券价格部分应该显示的文字
    let couponPrice = ''
    if (couponType === 40) {
        // 随机券
        couponPrice = item.coupon_price ? item.coupon_price : '?'
    } else if (couponType === 20) {
        // 折扣券
        couponPrice = item.discount + '折'
    } else {
        // 满减券和运费券
        couponPrice = item.reduce_price
    }

    // 优惠券使用条件的前后缀的map
    const couponConditionMap = {
        '10': {
            textRule: '满',
            textPrev: '减免',
            textLast: '元'
        },
        '20': {
            textRule: '满',
            textPrev: '打',
            textLast: '折'
        },
        '30': {
            textRule: '满',
            textPrev: '减免',
            textLast: '元'
        },
        '40': {
            textRule: '满',
            textPrev: '随机减',
            textLast: '元'
        }
    }

    // 优惠券使用条件
    let couponCondition = ''
    const couponConditionMapAvtive = couponConditionMap[couponType] || {}

    if (item.rule === 0) {
        // 有门槛
        couponCondition = `${couponConditionMapAvtive.textRule}${item.rule_min_money}`
    }
    couponCondition = `${couponCondition}${couponConditionMapAvtive.textPrev}`
    if (couponType === 20) {
        // 是折扣券
        couponCondition = `${couponCondition}${item.discount}`
    } else if (couponType === 40) {
        // 是运费券
        couponCondition = `${couponCondition}${item.min}-${item.max}`
    } else {
        // 是满减券或者运费券
        couponCondition = `${couponCondition}${couponPrice}`
    }
    couponCondition = `${couponCondition}${couponConditionMapAvtive.textLast}`

    // 是否是会员专属
    const memberVisible = item.get_limit_type === 1

    // 操作按钮的类型0:领取,1:去使用
    const btnStatus = item.is_receive === false ? 1 : 0

    // 操作按钮的文字
    const btnText = item.is_receive === false ? '去使用' : '领取'


    // 最终返回结果 优惠券样式 0:全品类样式，1:一个商品样式，2:三个商品样式
    console.log('最终返回结果', styleType)
    if (styleType === 0) {
        return {
            // 优惠券的id
            id: item.coupon_id,
            couponType,
            couponTypeText,
            // 优惠券的组件样式
            styleType,
            // 按钮状态
            btnStatus,
            // 按钮文字
            btnText,
            // 优惠券名称
            title: item.name,
            // 副标题
            subtitle: item.vice_name,
            // 优惠券金额
            couponPrice,
            // 使用条件
            couponCondition,
            // 是否显示会员专属
            memberVisible,
			// 是否需要定位
			locationNeed: [1,2].includes(+item.area_restrictions)
        }
    }
    if (styleType === 1) {
        return {
            // 优惠券的id
            id: item.coupon_id,
            couponType,
            couponTypeText,
            // 优惠券的组件样式
            styleType,
            // 按钮状态
            btnStatus,
            // 按钮文字
            btnText,
            // 商品图片
            imgUrl: Utils.deepGet(item, 'goods.0.image.0.file_path', ''),
            // 优惠券名称
            title: item.name,
            // 副标题
            subtitle: item.vice_name,
            // 商品价
            goodsPrice: Utils.deepGet(item, 'goods.0.sku.0.goods_price', ''),
            // 优惠券金额
            couponPrice,
            // 使用条件
            couponCondition,
            // 是否显示会员专属
            memberVisible,
			// 是否需要定位
			locationNeed: [1,2].includes(+item.area_restrictions)
        }
    }
    if (styleType === 2) {
        return {
            // id
            id: item.coupon_id,
            couponType,
            couponTypeText,
            // 优惠券的组件样式
            styleType,
            // 按钮状态
            btnStatus,
            // 按钮文字
            btnText,
            // 标题
            title: item.name,
            // 副标题
            subtitle: item.vice_name,
            // 优惠券金额
            couponPrice,
            // 使用条件
            couponCondition,
            // 是否显示会员专属
            memberVisible,
            // 商品数据
            goods: goods.map((good = {}) => ({
                id: good.goods_id,
                imgUrl: Utils.deepGet(good, 'image.0.file_path', ''),
                price: Utils.deepGet(good, 'sku.0.goods_price', '')
            })),
			// 是否需要定位
			locationNeed: [1,2].includes(+item.area_restrictions)
        }
    }
    return {
        // id
        id: item.coupon_id,
        couponType,
        couponTypeText,
        // 按钮状态
        btnStatus,
        // 按钮文字
        btnText,
        // 标题
        title: item.name,
        // 副标题
        subtitle: item.vice_name,
        // 优惠券金额
        couponPrice,
        // 使用条件
        couponCondition,
        // 是否显示会员专属
        memberVisible,
		// 是否需要定位
		locationNeed: [1,2].includes(+item.area_restrictions)
    }
}
