export const scheduleCustomRepeatTypes = [
  { label: '按日重复', value: 0, unit: '日', min: 1, max: 365 },
  { label: '按周重复', value: 1, unit: '周', min: 1, max: 52 },
  { label: '按月重复', value: 2, unit: '月', min: 1, max: 12 },
  { label: '按年重复', value: 5, unit: '年', min: 1, max: 12 },
];

export const scheduleRepeatTypes = [
  { label: '每日', value: 0, unit: '日' }, 
  { label: '每周', value: 1, unit: '周' }, 
  { label: '每月', value: 2, unit: '月' }, 
  { label: '每年', value: 5, unit: '年' }, 
  { label: '工作日', value: 7, unit: '个工作日' }, 
];

export const zhCnWeeks = ['日', '一', '二', '三', '四', '五', '六', '日'];

// 非全天提醒选项
export const scheduleRemindTimeDiffs = [
  { label: '日程开始时', value: 0 },
  { label: '5分钟前', value: -5 * 60 },
  { label: '15分钟前', value: -15 * 60 },
  { label: '1小时前', value: -60 * 60 },
  { label: '1天前', value: -24 * 60 * 60 },
];

// 全天提醒选项
export const scheduleAllDayRemindTimeDiffs = [
  { label: '当天9点', value: 9 * 60 * 60 },
  { label: '1天前9点', value: -(24 - 9) * 60 * 60 },
  { label: '2天前9点', value: -(24 - 9 + 24) * 60 },
  { label: '1周前9点', value: -(24 - 9 + 24 * 6) * 60 * 60 },
];
