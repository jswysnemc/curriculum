"use strict";
// 此js 文件 记录课程表数据
let data = [
  {
    "courseName": "Android项目开发与创业实践-0003A",
    "address": "计科楼基础实验室一(JS-104)",
    "nodeClass": "1-2节",
    "date": "2025-03-21",
    "nodeWeek": "2-10周,12-14周",
    "teacher": "陈玉宽",
    "weakDay": "1"
  },
  {
    "courseName": "Android项目开发与创业实践-0003",
    "address": "教1楼209(多媒体)",
    "nodeClass": "3-4节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-13周",
    "teacher": "陈玉宽",
    "weakDay": "1"
  },
  {
    "courseName": "劳动-0005",
    "address": "三园区2号楼211（多媒体）",
    "nodeClass": "9-10节",
    "date": "2025-03-21",
    "nodeWeek": "5-8周",
    "teacher": "朱柯彪",
    "weakDay": "1"
  },
  {
    "courseName": "Oracle数据库技术-0001",
    "address": "三园区2号楼306",
    "nodeClass": "1-2节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-13周",
    "teacher": "朱三元",
    "weakDay": "2"
  },
  {
    "courseName": "Oracle数据库技术-0001A",
    "address": "三园区5号楼304（人工智能实验室（一））",
    "nodeClass": "3-4节",
    "date": "2025-03-21",
    "nodeWeek": "2-12周(双)",
    "teacher": "朱三元",
    "weakDay": "2"
  },
  {
    "courseName": "J2EE程序设计-0002",
    "address": "三园区2号楼119（多媒体）",
    "nodeClass": "5-6节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-17周",
    "teacher": "吴先飞",
    "weakDay": "2"
  },
  {
    "courseName": "网络编程-0001A",
    "address": "三园区5号楼301人工智能实验室（二））",
    "nodeClass": "7-8节",
    "date": "2025-03-21",
    "nodeWeek": "5-10周,12-17周",
    "teacher": "梁其洋",
    "weakDay": "2"
  },
  {
    "courseName": "J2EE程序设计-0002A",
    "address": "三园区5号楼304（人工智能实验室（一））",
    "nodeClass": "1-2节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-19周",
    "teacher": "吴先飞",
    "weakDay": "3"
  },
  {
    "courseName": "Swift编程-0001A",
    "address": "三园区5号楼304（人工智能实验室（一））",
    "nodeClass": "3-4节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-13周",
    "teacher": "赵罡",
    "weakDay": "3"
  },
  {
    "courseName": "软件工程-0001",
    "address": "三园区2号楼117（多媒体）",
    "nodeClass": "5-6节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-17周",
    "teacher": "刘振",
    "weakDay": "3"
  },
  {
    "courseName": "软件工程-0001A",
    "address": "三园区5号楼304（人工智能实验室（一））",
    "nodeClass": "7-8节",
    "date": "2025-03-21",
    "nodeWeek": "6-16周(双)",
    "teacher": "刘振",
    "weakDay": "3"
  },
  {
    "courseName": "网络编程-0001",
    "address": "教1楼309(多媒体)",
    "nodeClass": "9-10节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-17周",
    "teacher": "梁其洋",
    "weakDay": "3"
  },
  {
    "courseName": "Swift编程-0001",
    "address": "三园区2号楼211（多媒体）",
    "nodeClass": "1-2节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-17周",
    "teacher": "赵罡",
    "weakDay": "4"
  },
  {
    "courseName": "网络工程与组网技术-0003A",
    "address": "三园区5号楼304（人工智能实验室（一））",
    "nodeClass": "3-4节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-13周",
    "teacher": "苏丽娜",
    "weakDay": "4"
  },
  {
    "courseName": "就业指导-0044",
    "address": "三园区4号楼314",
    "nodeClass": "7-8节",
    "date": "2025-03-21",
    "nodeWeek": "9-10周,12-13周",
    "teacher": "柴松",
    "weakDay": "4"
  },
  {
    "courseName": "网络工程与组网技术-0003",
    "address": "三园区2号楼306",
    "nodeClass": "9-10节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-13周",
    "teacher": "苏丽娜",
    "weakDay": "4"
  },
  {
    "courseName": "网络与信息安全技术-0003",
    "address": "三园区2号楼117（多媒体）",
    "nodeClass": "1-2节",
    "date": "2025-03-21",
    "nodeWeek": "1-3周",
    "teacher": "徐泽",
    "weakDay": "5"
  },
  {
    "courseName": "网络与信息安全技术-0003A",
    "address": "计科楼基础实验室一(JS-104)",
    "nodeClass": "1-2节",
    "date": "2025-03-21",
    "nodeWeek": "4-12周(双)",
    "teacher": "徐泽",
    "weakDay": "5"
  },
  {
    "courseName": "网络与信息安全技术-0003A",
    "address": "三园区5号楼304（人工智能实验室（一））",
    "nodeClass": "3-4节",
    "date": "2025-03-21",
    "nodeWeek": "2周",
    "teacher": "徐泽",
    "weakDay": "5"
  },
  {
    "courseName": "网络与信息安全技术-0003",
    "address": "教1楼209(多媒体)",
    "nodeClass": "3-4节",
    "date": "2025-03-21",
    "nodeWeek": "4-10周,12-13周",
    "teacher": "徐泽",
    "weakDay": "5"
  },
  {
    "courseName": "C#程序设计-0006A",
    "address": "三园区5号楼401（人工智能实验室（三））",
    "nodeClass": "5-6节",
    "date": "2025-03-21",
    "nodeWeek": "2-5周,7-10周,12-15周",
    "teacher": "梁其洋",
    "weakDay": "5"
  },
  {
    "courseName": "马克思主义基本原理-0042",
    "address": "三园区2号楼117（多媒体）",
    "nodeClass": "7-8节",
    "date": "2025-03-21",
    "nodeWeek": "1-10周,12-15周",
    "teacher": "杨秋艳",
    "weakDay": "5"
  },
  {
    "courseName": "C#程序设计-0006",
    "address": "教1楼309(多媒体)",
    "nodeClass": "9-10节",
    "date": "2025-03-21",
    "nodeWeek": "2-10周,12-14周",
    "teacher": "梁其洋",
    "weakDay": "5"
  }
];
