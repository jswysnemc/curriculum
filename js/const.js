"use strict";
// 此js文件 创建若干常量

// 输入学期周数
const TAOTAL_WEEKS = 19;

// 输入开学日期
const START_DATE = new Date('2025-2-17');

// 定义时间常量单位
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOURS = MINUTE * 60;
const DAYS = HOURS * 24;


// 输入课程上下课时间
const TIMES = ['08:00~08:45', '08:55~09:45', '10:00~10:45', '10:55~11:40', '14:00~14:45', '14:55~15:40', '16:00~16:45', '16:55~17:40', '19:00~19:45', '19:55~20:40', '20:50~21:35'];
const weakday_text = '日,一,二,三,四,五,六'.split(',').map(e => '星期' + e);
const table_header_text = ['时间段', '节次'].concat(weakday_text);
const YIYAN_API = "https://uapis.cn/api/say";
