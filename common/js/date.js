import dayjs from 'dayjs'

/**
 *
 * 格式化10位或13位时间戳,不能正确格式化的时候输出fallback
 */
export const dateFormat = (timeStamp = '', {
    format = 'YYYY-MM-DD HH:mm:ss', fallback = '--'
} = {}) => {
    if (!timeStamp) {
        return fallback
    }
    const len = ('' + timeStamp).length
    if (len === 10 && dayjs.unix(+timeStamp).isValid()) {
        return dayjs.unix(+timeStamp).format(format)
    }
    if (len === 13 && dayjs(timeStamp).isValid()) {
        return dayjs(+timeStamp).format(format)
    }
    return fallback
}

/**
 * 转化为10位时间戳
 * @param {number|string} timeStamp 时间戳
 * @return {string|undefined}
 */
export const toUnixTimeStamp = timeStamp => {
    if (!timeStamp) {
    // undefined兼容element-date-picker
        return undefined
    }
    const len = ('' + timeStamp).length
    if (len === 10) {
        return timeStamp
    } else if (len) {
        return +('' + timeStamp).slice(0, 10)
    }
}

/**
 * 将10位时间戳转化为13位时间戳
 * @param {number|string} timeStamp 时间戳
 * @return {string|undefined}
 */
export const toTimeStamp = timeStamp => (!timeStamp ? undefined : `${timeStamp}000`.slice(0, 13))

