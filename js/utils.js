"use strict";

/**
 * @description 通过$ 和 选择器字符串 获取元素
 * @param {string} seletor_str 
 * @returns {HTMLElement}
 */
function $(seletor_str) {
    return document.querySelector(seletor_str);
}


/** Date 自定义格式化
 * @description
 * @param {string} fmt 格式化字符串
 * @returns {string} 格式化后的日期字符串
 */
Date.prototype.format = function (fmt) {
    const o = {
        "M+": this.getMonth() + 1, // 月份 
        "d+": this.getDate(), // 日 
        "H+": this.getHours(), // 小时 
        "m+": this.getMinutes(), // 分 
        "s+": this.getSeconds(), // 秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度 
        "S": this.getMilliseconds() // 毫秒 
    };
    // 替换年份
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    // 替换其他日期组件
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            const replacement = (RegExp.$1.length === 1) ? o[k] : (("00" + o[k]).substr(("" + o[k]).length));
            fmt = fmt.replace(RegExp.$1, replacement);
        }
    }
    return fmt;
};

// 获取农历日期
/**
 * 返回农历字符串，不包含年份 : eg 三月初一, 三月十五, 十二月廿八
 * @returns {string} 农历日期字符串
 */
Date.prototype.getTheLunarStr = function () {
    // 农历日和前缀
    const lunarDayStrs = "十,一,二,三,四,五,六,七,八,九".split(',');
    const lunarDayPrefixes = "初,十,廿,卅".split(',');
    // 获取农历字符串
    const lunarStr = this.toLocaleString('zh-Hans-u-ca-chinese', { year: 'numeric', month: 'long', day: 'numeric' });
    // 从农历字符串中提取出农历月和农历日
    const [lunarMonth, lunarDay] = lunarStr.split('月');
    // 解析农历日并构造最终字符串
    const dayNum = parseInt(lunarDay, 10);
    const prefixIndex = Math.floor(dayNum / 10); // 前缀索引
    const dayIndex = dayNum % 10; // 日索引
    // 返回农历字符串，不包含年份
    return `${lunarMonth}月${lunarDayPrefixes[prefixIndex]}${lunarDayStrs[dayIndex]}`.replace('十十', '初十').slice(4);
};


/**
 * @description 返回两个日期之间的周数(基于开学日期)
 * @param {Date} date 
 * @returns number
 */
function getWeekCount(date) {
    // 开学的日期（视为第一周第一天）
    var baseDate = START_DATE;
    // 计算两个日期之间的毫秒差
    const diffInMillis = +date - +baseDate;
    // 将毫秒差转换为天数
    var days = Math.floor(diffInMillis / DAYS);
    // 计算周数
    return Math.floor(days / 7) + 1; // 加1以包括基准日期（9月1日）
}


/**
 * @description 更新底部提示信息
 */
function updateTips() {
    let nowDate = new Date();
    let now_weakCount = getWeekCount(nowDate);
    let [li, ri] = ["<i class='rt'>", "</i>"];
    let weakTipsText = `<span>现在是:  ` +
        `${nowDate.format('yyyy年')}` +
        `${li + nowDate.format('M') + ri}月` +
        `${li + nowDate.format('dd') + ri}日, ` +
        `时间: ${li + nowDate.format(' HH:mm:ss') + ri}, ` +
        `农历: ${nowDate.getTheLunarStr()}, ` +
        `今天是第 ${li + now_weakCount + ri} 周, ${li + weakday_text[nowDate.getDay()] + ri} , 一共${TAOTAL_WEEKS}周.  ${yiyan}</span>`;
    dom_tips.innerHTML = weakTipsText;
}

/**
 * @description 通过fetch获取一言(非主要功能)
 */

function get_yiyan() {
    try {
        fetch(YIYAN_API).then(async (response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let reader = response.body?.getReader();
            let result = "";
            let done = false;
            // 逐块读取流中的数据
            while (!done) {
                const { value, done: streamDone } = await reader.read();
                done = streamDone;
                // 将 Uint8Array 转换为字符串
                result += new TextDecoder("utf-8").decode(value);
            }
            yiyan = result;
        });
    }
    catch (err) {
        console.error(err);
    }
}
 /**
  * @description 创建空课程表, 每个单元格的id为 "id_第几节_第几节_第几节课"
  */
function createTable() {
    table.innerHTML = '';

    let th_str = '<tr>\n';
    table_header_text.forEach(e => {
        th_str += `<th>${e}</th>\n`;
    });
    th_str += '</tr>';
    let newNode = doms.createNewDom(th_str);
    table?.append(newNode);
    for (let i = 0; i < 11; i++) {
        th_str = '<tr>\n';
        for (let j = 0; j < table_header_text.length; j++) {
            if (j == 0) {
                if (i == 0)
                    th_str += `<td class="swbj" id="${i}_${j}" rowspan=4>上午</td>\n`;
                if (i == 4)
                    th_str += `<td class="xwbj" id="${i}_${j}" rowspan=4>下午</td>\n`;
                if (i == 8)
                    th_str += `<td class="wsbj" id="${i}_${j}" rowspan=3>晚上</td>\n`;
            }
            else if (true) {
                if (i == 0) {
                    if (j == 1) {
                        th_str += `<td  class="swbj" id="jc${i + 1}_${i + 2}_${j - 2}" rowspan=2>第${i + 1}~${i + 2}节 ${TIMES[i]} <br>${TIMES[i + 1]}</td>\n`;
                    }
                    else {
                        th_str += `<td  class="swbj closeBtn" id="id_${i + 1}_${i + 2}_${j - 2}" rowspan=2></td>\n`;
                    }
                }
                if (i == 2) {
                    if (j == 1) {
                        th_str += `<td  class="swbj" id="jc${i + 1}_${i + 2}_${j - 2}" rowspan=2>第${i + 1}~${i + 2}节 ${TIMES[i]} <br>${TIMES[i + 1]}</td>\n`;
                    }
                    else {
                        th_str += `<td  class="swbj closeBtn" id="id_${i + 1}_${i + 2}_${j - 2}" rowspan=2></td>\n`;
                    }
                }
                if (i == 4) {
                    if (j == 1) {
                        th_str += `<td  class="xwbj" id="jc${i + 1}_${i + 2}_${j - 2}" rowspan=2>第${i + 1}~${i + 2}节 ${TIMES[i]} <br>${TIMES[i + 1]}</td>\n`;
                    }
                    else {
                        th_str += `<td  class="xwbj closeBtn" id="id_${i + 1}_${i + 2}_${j - 2}" rowspan=2></td>\n`;
                    }
                }
                if (i == 6) {
                    if (j == 1) {
                        th_str += `<td  class="xwbj" id="jc${i + 1}_${i + 2}_${j - 2}" rowspan=2>第${i + 1}~${i + 2}节 ${TIMES[i]} <br>${TIMES[i + 1]}</td>\n`;
                    }
                    else {
                        th_str += `<td  class="xwbj closeBtn" id="id_${i + 1}_${i + 2}_${j - 2}" rowspan=2></td>\n`;
                    }
                }
                if (i == 8) {
                    if (j == 1) {
                        th_str += `<td  class="wsbj" id="jc${i + 1}_${i + 2}_${j - 2}" rowspan=2>第${i + 1}~${i + 2}节 ${TIMES[i]} <br>${TIMES[i + 1]}</td>\n`;
                    }
                    else {
                        th_str += `<td  class="wsbj closeBtn" id="id_${i + 1}_${i + 2}_${j - 2}" rowspan=2></td>\n`;
                    }
                }
                if (i == 10) {
                    if (j == 1) {
                        th_str += `<td  class="wsbj" id="jc${i + 1}_${i + 2}_${j - 2}" rowspan=1>第${i + 1}节 ${TIMES[i]}</td>\n`;
                    }
                    else {
                        th_str += `<td class="wsbj closeBtn" id="id_${i + 1}_${j - 2}" ></td>\n`;
                    }
                }
            }
        }
        th_str += '</tr>';
        table?.append(doms.createNewDom(th_str));
    }
    table?.append(doms.createNewDom('<tr><td colspan="11" ><marquee id="tips"></marquee></td></tr>'));
}

/**
 * @description 创建定时器, 每秒更新底部提示信息, 每10秒获取一言
 */
function createTimer() {
    setInterval(() => {
        updateTips();
    }, SECOND);
    setInterval(() => {
        get_yiyan();
    }, 10 * SECOND);
}
