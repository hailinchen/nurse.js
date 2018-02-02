/*
*
* 时间格式化过滤器
*
* Description
*
*/

// 取剩余秒
const pluralize = (time, label) => {
  return time + label + (time === 1) ? '' : '秒'
}

// 相对时间过滤器，传入时间，返回距离今天有多久
export const fromNow = time => {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) return pluralize(~~(between / 60), ' 分钟')
  if (between < 86400) return pluralize(~~(between / 3600), ' 小时')
  if (between >= 86400) return pluralize(~~(between / 86400), ' 天')
}

// YMDHMS时间转换过滤器
export const toYMD = date => {
  return date ? moment(date).format('YYYY年MM月DD日') : date
}

// 秒转为小时分钟过滤器
export const toHMS = (sec, type, h_slug, m_slug, s_slug) => {

  // 计算
  const sec_num = parseInt(sec, 10)
  const hours   = Math.floor(sec_num / 3600)
  const minutes = Math.floor((sec_num - (hours * 3600)) / 60)
  const seconds = sec_num - (hours * 3600) - (minutes * 60)

  // 低级格式化
  [seconds, minutes, hours].forEach(time => { (time < 10) && (time = `0${time}`) })

  // 显示规则
  let hour_display, minute_display, second_display
  if (type) {
    hour_display = type.indexOf("H") > -1 && hours > 0 ? true : false
    minute_display = type.indexOf("M") > -1 ? true : false
    second_display = type.indexOf("S") > -1 ? true : false
  } else {
    hour_display = minute_display = second_display = true
  }

  // 自定义格式化
  const hour_slug   = h_slug != undefined ? h_slug : ':'
  const minute_slug = m_slug != undefined ? m_slug : ':'
  const second_slug = s_slug != undefined ? s_slug : ''

  const time = (hour_display ? hours + hour_slug : '') + (minute_display ? minutes + minute_slug : '') + (second_display ? seconds + second_slug : '')
  return time;
}
