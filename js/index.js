"use strict";
// 此函数为主要逻辑，用于创建课程表

// 获取doms对象
const doms = {
    timetable: $('#timetable'),
    table: $('#timetable')?.firstElementChild,
    createNewDom(htmlstr) {
        let tmp_dom;
        // 根据传入的 HTML 判断需要创建的父元素
        if (htmlstr.trim().startsWith('<tr')) {
            tmp_dom = document.createElement('tbody'); // 创建一个 <tbody> 元素
        }
        else {
            tmp_dom = document.createElement('div'); // 默认使用 <div>
        }
        tmp_dom.innerHTML = htmlstr; // 设置 HTML
        return tmp_dom.firstChild; // 返回第一个子元素
    }
};


const table = doms.table;


/**
 * @description 此变量表示当前显示的课程的周次, 该变量会随着上下周按钮的点击而改变
 */
let now_display_week_count = getWeekCount(new Date());


/**
 * @description  根据显示上课周 的字符串 获取上课周的数组  例如 '1-3周,5-7周' => [1,2,3,5,6,7]
 * @param {string} str 
 * @returns 
 */
function getIsYesArray(str) {
    let arr = new Array();
    if (!isNaN(Number(str)))
        arr.push(Number(str));
    if (str.includes('单')) {
        let [start, end] = str.replaceAll('单', '').split('-').map(e => Number(e));
        for (let i = start; i <= end; i++) {
            if (i % 2 == 1)
                arr.push(i);
        }
    }
    else if (str.includes('双')) {
        let [start, end] = str.replaceAll('双', '').split('-').map(e => Number(e));
        for (let i = start; i <= end; i++) {
            if (i % 2 == 0)
                arr.push(i);
        }
    }
    else {
        let [start, end] = str.split('-').map(e => Number(e));
        for (let i = start; i <= end; i++) {
            arr.push(i);
        }
    }
    return arr;
}


/**
 * @description 给定一个字符串和当前周次, 判断该字符串是否包含当前周次
 * @param {Date} weak_str 
 * @param {string} now_weakCount 
 * @returns 
 */
function isThisWeek(weak_str, now_weakCount) {
    // 将字符串中的'周'、'('、')'替换为空字符串
    let str = weak_str.replaceAll('周', '').replaceAll('(', '').replaceAll(')', '');
    // 定义一个空数组
    let arr = [];
    // 将字符串按逗号分割，并遍历每个元素
    str.split(',').forEach(e => {
        // 将每个元素转换为布尔数组，并合并到arr数组中
        arr = arr.concat(getIsYesArray(e));
    });
    // 判断arr数组中是否包含now_weakCount
    return arr.includes(now_weakCount);
}

// 声明一个变量courses_map，并将其初始化为null
/**
 * @description 课程表的Map对象, 
 * @key {string} 课程表的单元格id
 * @value {Array} 该单元格中的课程数组
 */
let courses_map = null;

// 更新课程表
function updateTable() {
    // 清空课程表
    courses_map = null;
    // 创建课程表
    createTable();
    // 清空周日课程
    clear_sunday();
    // 添加课程到课程表中
    data.forEach(e => {
        let [ll, rl] = ['<li>', '</li>'];
        const courses = {
            name: ll + '课程名称: ' + e.courseName + rl,
            address: ll + '上课地点: ' + e.address + rl,
            teacher: ll + '本课教师: ' + e.teacher + rl,
            nodeWeek: ll + '本课周次: ' + e.nodeWeek + rl,
            nodeClass: e.nodeClass.replace('节', ''),
            weakDay: Number(e.weakDay),
            isThisWeek: isThisWeek(e.nodeWeek, now_display_week_count),
            get id_text() {
                return `id_${this.nodeClass.replace('-', '_')}_${this.weakDay}`;
            },
            get text() {
                return `<ul>${this.name}\n${this.address}\n ${this.teacher}${ll + '本课节次 : 第' + this.nodeClass + '节' + rl}\n${this.nodeWeek}</ul>`;
            },
        };
        if (courses_map == null)
            courses_map = new Map();
        if (!courses_map.has(courses.id_text)) {
            courses_map.set(courses.id_text, []);
        }
        if (courses.isThisWeek) {
            courses_map.get(courses.id_text)?.unshift(courses);
        }
        else {
            courses_map.get(courses.id_text)?.push(courses);
        }
        // 特殊处理两节课 // 改为特殊处理多课连上
        let dom = $(`#${courses.id_text}`);
        if (dom == null || dom == undefined) {
            let [existenceId, rowspan_number, delete_ids] = ((str) => {
                let start_number = parseInt(str.replace('id_', '').split('_')[0]);
                let end_number = parseInt(str.replace('id_', '').split('_')[1]);
                let delete_ids = [];
                for (let i = start_number; i <= end_number; i += 2) {
                    let delete_id = `id_${i}_${i + 1}_${courses.weakDay}`;
                    if (delete_id.includes('11_12'))
                        delete_id = delete_id.replace('11_12', '11');
                    delete_ids.push(delete_id);
                }
                delete_ids.shift();
                return [str.replace('' + end_number, start_number + 1 + ''), end_number - start_number + 1, delete_ids];
            })(courses.id_text);
            delete_ids.forEach(e => {
                let delete_dom = $(`#${e}`);
                delete_dom?.setAttribute('realId', courses.id_text);
                delete_dom?.setAttribute('style', 'display: none');
            });
            let existDom = $(`#${existenceId}`);
            if (courses.isThisWeek)
                existDom.innerHTML = courses.text;
            // 将真实id添加到dom的属性中
            existDom?.setAttribute('realId', courses.id_text);
            existDom?.setAttribute('rowspan', '' + rowspan_number);
        }
        if (dom && courses.isThisWeek) {
            dom.innerHTML = courses.text;
        }
    });



    // 对表格添加监听事件, 事件委托, 将子元素事件委托给父元素
    table?.addEventListener("click", function (e) {
        
        // 获取鼠标位置信息
        let [x, y] = [e.clientX, e.clientY];
        let td_dom;
        let target = e?.target;
        // 无论谁触发事件,最后交给 td 处理
        if (target.tagName.toLocaleLowerCase() == "li") {
            td_dom = target.parentElement?.parentElement;
        }
        else if (target.tagName.toLocaleLowerCase() == "ul") {
            td_dom = target.parentElement;
        }
        else {
            td_dom = target;
        }
        // 创建小弹窗
        if (!td_dom.hasAttribute('id'))
            return;
        if (td_dom.getAttribute("id")?.startsWith('jc'))
            return;
        let innerStr = getPopUpWindowInnerStr(td_dom.getAttribute('id'));
        if (innerStr == null || innerStr.length == 0)
            innerStr = '没有课程';
        let str = '<table class="PopUpWindow-content" style=" ; border:  1px solid black; border-collapse: collapse">';
        str += innerStr + `<tr align="center"><td onclick="popUpWindowClose" class="closeBtn">关闭</td></tr>`;
        moddle_dom && (moddle_dom.innerHTML = str + '</table>');
        ;
        moddle_dom.style.display = "flex";
        moddle_dom.style.left = x + "px";
        moddle_dom.style.top = y + "px";
    });

}

updateTable();


// 获取切换周次按钮相关DOM
const prevWeekBtn = document.getElementById('prevWeek');
const nextWeekBtn = document.getElementById('nextWeek');
const currentWeekBtn = document.getElementById('currentWeek');
const weekDisplaySpan = document.getElementById('weekDisplay');

// 更新课程表显示的周次
function updateTimetableDisplay(weekNum) {
    now_display_week_count = weekNum;
    weekDisplaySpan.textContent = `显示第 ${now_display_week_count} 周, 当前 第 ${getWeekCount(new Date())} 周`;

    // 使用封装的函数重新初始化课程表
    updateTable()
}

// 初始化时显示当前周次
updateTimetableDisplay(now_display_week_count);


// 修改周次切换功能
function createWeekSwitcher() {



    // 实际的当前周次，用于记录当前周次，确保点击回到当前周按钮时能够回到当前周
    const __const_now_weakCount = now_display_week_count;



    // 更新弹窗内容，确保弹窗显示的也是当前周的信息
    if (moddle_dom.style.display === "flex") {
        // 如果弹窗正在显示，更新其内容
        const currentPopupId = moddle_dom.getAttribute('current-id');
        if (currentPopupId) {
            const innerStr = getPopUpWindowInnerStr(currentPopupId);
            if (innerStr && innerStr.length > 0) {
                let str = '<table class="PopUpWindow-content" style="border: 1px solid black; border-collapse: collapse">';
                str += innerStr + `<tr align="center"><td onclick="popUpWindowClose()" class="closeBtn">关闭</td></tr>`;
                moddle_dom.innerHTML = str + '</table>';
            }
        }
    }


    // 上一周按钮点击事件
    prevWeekBtn.addEventListener('click', () => {
        if (now_display_week_count > 1) {
            updateTimetableDisplay(now_display_week_count - 1);
        }
    });

    // 下一周按钮点击事件
    nextWeekBtn.addEventListener('click', () => {
        if (now_display_week_count <= TAOTAL_WEEKS) { // 假设最多20周
            updateTimetableDisplay(now_display_week_count + 1);
        }
    });

    // 回到当前周按钮点击事件
    currentWeekBtn.addEventListener('click', () => {
        updateTimetableDisplay(__const_now_weakCount);
    });
}



// 确保DOM加载完成后再初始化周次切换器
document.addEventListener('DOMContentLoaded', function () {
    // 初始化周次切换器
    createWeekSwitcher();
});


// 获取dom
let moddle_dom = $('#popUpWindow');
// 关闭弹窗
function popUpWindowClose() {
    moddle_dom.style.display = "none";
}
// 处理弹窗
function getPopUpWindowInnerStr(text_id) {
    let str = '';
    let old_text_id = text_id;
    // debugger    
    if (text_id == null)
        return '';
    let text_dom = $('#' + text_id);
    let get_StrFunc = (text_id) => {
        let str = '';
        text_id && courses_map?.get(text_id)?.forEach(function (course) {
            str += `<tr style="color: ${course.isThisWeek ? 'black' : '#463c3ce1'}"><td>`;
            str += course?.text.replace('</ul>', `<li>是否本周: ${course.isThisWeek ? "本周" : "非本周"}</li></ul>`);
            str += '</td></tr>';
        });
        return str;
    };
    let chirld_str = '';
    if (text_dom?.hasAttribute('realId')) {
        text_id = text_dom.getAttribute("realId");
        // 获取被合并的单元格所占的id的课程
        let child_ids = ((str) => {
            // debugger
            let start_number = parseInt(str.replace('id_', '').split('_')[0]);
            let end_number = parseInt(str.replace('id_', '').split('_')[1]);
            let chirld_ids = [];
            for (let i = start_number; i <= end_number; i += 2) {
                let chirld_id = `id_${i}_${i + 1}_${str.split('_').toReversed()[0]}`;
                if (chirld_id.includes('11_12'))
                    chirld_id = chirld_id.replace('11_12', '11');
                chirld_ids.push(chirld_id);
            }
            return chirld_ids;
        })(text_id);
        child_ids.forEach(e => {
            chirld_str += get_StrFunc(e);
        });
    }
    if (text_id && courses_map?.get(text_id) == null) {
        return '';
    }
    str += get_StrFunc(text_id);
    // 添加是否本周信息
    return str + chirld_str;
}


// 周末以及第11节, 不显示课程,将其隐藏 如有课程可以在此处修改
function clear_sunday() {
    let sunDayColumn_dmom = $('#timetable > table > tr:nth-child(1) > th:nth-child(3)');
    let sartardayColum_dmom = $('#timetable > table > tr:nth-child(1) > th:nth-child(9)');
    let _11_jie_line = $('#timetable > table > tr:nth-child(12)');


    
    let delete_ids = '1_2,3_4,5_6,7_8,9_10,11'.split(',')
    delete_ids.forEach(e => {
        let str1 = 'id_' + e + '_0';
        let str2 = 'id_' + e + '_6';
        let dom_delete_td_dom = $('#' + str1);
        let dom_delete_td_dom2 = $('#' + str2)
        
        dom_delete_td_dom.style.display = 'none';
        dom_delete_td_dom2.style.display = 'none';
    });
    sunDayColumn_dmom.style.display = "none";
    sartardayColum_dmom.style.display = "none";
    _11_jie_line.style.display = "none";

    // 修复删除一行的异常
    document.getElementById("8_0").setAttribute("rowspan","2")    
}

// 以下代码用于 将即将上课的课程或者正在上课的课程 边框变色,
const TIMESS = [...TIMES, '00:00~23:59'];
const JC = ['1_2', '1_2', '3_4', '3_4', '5_6', '5_6', '7_8', '7_8', '9_10', '9_10', '9_10', 'null'];
// 创建 Map
const time_map = Object.fromEntries(TIMESS.map((time, index) => [time, JC[index]]));
let old_dom = null;
// 绘制边框
function setBoder(date) {
    let ss = date.getHours() * HOURS + date.getMinutes() * MINUTE + date.getSeconds();
    let time_str = TIMESS.find((v) => {
        let [s_str, e_str] = v.split('~');
        let [s_h, s_m] = s_str.split(':');
        let [e_h, e_m] = e_str.split(':');
        let s_s = parseInt(s_h) * HOURS + parseInt(s_m) * MINUTE;
        let e_s = parseInt(e_h) * HOURS + parseInt(e_m) * MINUTE;
        return ss <= e_s;
    });
    if (time_str === '00:00~23:59') {
        if (old_dom != null) {
            old_dom.style.border = 'none';
            old_dom = null;
        }
        time_str = '08:00~08:45';
    }
    let id_str = `id_${time_map[time_str]}_${date.getDay()}`;
    let [s_str, e_str] = time_str.split('~');
    let [s_h, s_m] = s_str.split(':');
    let [e_h, e_m] = e_str.split(':');
    let s_s = parseInt(s_h) * HOURS + parseInt(s_m) * MINUTE;
    let e_s = parseInt(e_h) * HOURS + parseInt(e_m) * MINUTE;
    let n_s = date.getHours() * HOURS + date.getMinutes() * MINUTE + date.getSeconds();
    let is_in_class = n_s >= s_s && n_s <= e_s;
    let dom = $('#' + id_str);
    if (dom.hasAttribute('realId')) {
        let reall_id = dom.getAttribute('realId');
        // 获取被合并的单元格所占的id的课程
        let child_ids = ((str) => {
            let start_number = parseInt(str.replace('id_', '').split('_')[0]);
            let end_number = parseInt(str.replace('id_', '').split('_')[1]);
            let chirld_ids = [];
            for (let i = start_number; i <= end_number; i += 2) {
                let chirld_id = `id_${i}_${i + 1}_${str.split('_').toReversed()[0]}`;
                if (chirld_id.includes('11_12'))
                    chirld_id = chirld_id.replace('11_12', '11');
                chirld_ids.push(chirld_id);
            }
            return chirld_ids;
        })(reall_id)[0];
        dom = $('#' + child_ids);
    }
    let colort_str = `10px solid ${is_in_class ? 'green' : 'yellow'}`;
    if (dom != null) {
        dom.style.border = colort_str;
        if (dom != old_dom) {
            if (old_dom != null)
                old_dom.style.border = "none";
            old_dom = dom;
        }
    }
    else {
        dom = old_dom;
        dom.style.border = colort_str;
        return;
    }
}



let dom_tips = $('#tips');
let yiyan = '正在寻找一句话...';
createTimer();
updateTips();
//get_yiyan();


let da = new Date();
setBoder(da);
let ns = da.getTime();
setInterval(() => {
    ns += SECOND;
    setBoder(new Date(ns));
}, SECOND);

