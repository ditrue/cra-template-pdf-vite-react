import dayjs from "dayjs";
import { scheduleAllDayRemindTimeDiffs, scheduleCustomRepeatTypes, scheduleRemindTimeDiffs, scheduleRepeatTypes, zhCnWeeks } from "@/config";

export const scheduleUtil = {
  /**
   * 根据日期筛选日程
   */
  getDaySchedules: (list?: API.SCHEDULE.ListItem[], day?: dayjs.Dayjs) => {
    if (!day || !list) return list;
    return list.filter(item => {
      // 如果没有开始时间，直接返回false
      if (!item.startTimeUnix) return false;

      // 如果是在开始时间之前，返回false
      if (day.isBefore(dayjs.unix(item.startTimeUnix), 'date')) return false;

      // 如果没有提醒设置或者是非重复日程
      if (!item.reminder || item.reminder.isRepeat === 0) {
        // 如果不在开始时间和结束时间之间，返回false
        return day.isSameOrBefore(dayjs.unix(item.endTimeUnix), 'date');
      }

      /// 重复日程逻辑

      // 如果不是永不结束，在结束时间之后，返回false
      if (item.endTimeUnix !== 0 && day.isAfter(dayjs.unix(item.endTimeUnix), 'date')) return false;

      // 如果在是排除的日期中，返回false
      if (item.reminder.excludeTimeList && item.reminder.excludeTimeList.some(t => day.isSame(dayjs.unix(t.start_time), 'date'))) return false;

      // 判断重复类型
      const repeatInterval = item.reminder.repeatInterval;
      const startDay = dayjs.unix(item.startTimeUnix);
      switch (item.reminder.repeatType) {
        // 每日
        case 0: {
          // 如果是非自定义重复，返回true
          if (!item.reminder.isCustomRepeat) return true;

          // 日差值
          const diff = day.diff(startDay, 'day');
          return diff % repeatInterval === 0;
        }
        // 每周
        case 1: {
          // 如果等于startTime，返回true
          if (day.isSame(startDay, 'date')) return true;

          // 判断是否在重复周期中
          const diff = day.diff(startDay, 'week');
          if (diff % repeatInterval !== 0) return false;

          // 如果是自定义重复
          if (item.reminder.isCustomRepeat) {
            // 如果不在重复周内，返回false
            return item.reminder.repeatDayOfWeek.includes(day.day() || 7);
          }

          // 非自定义重复，判断周天是否相等
          return day.day() === startDay.day();
        }
        // 每月
        case 2: {
          // 如果等于startTime，返回true
          if (day.isSame(startDay, 'date')) return true;
          
          // 判断是否在重组周期中
          const diff = day.diff(startDay, 'month');
          if (diff % repeatInterval !== 0) return false;

          // 如果是非自定义重复，比较月天是否相等
          if (item.reminder.isCustomRepeat) {
            // 如果不在重复月内，返回false
            return item.reminder.repeatDayOfMonth.includes(day.date());
          }

          return day.date() === startDay.date();
        }
        // 每年
        case 5: {
          // 月日不相等，返回false
          if (day.date() !== startDay.date() || day.month() !== startDay.month()) return false;

          // 如果不是非自定义重复，返回true
          if (!item.reminder.isCustomRepeat) return true;

          // 判断是否在重复周期中
          const diff = day.diff(startDay, 'year');
          return diff % repeatInterval === 0;
        }
        // 工作日
        case 7: {
          return day.day() >= 1 && day.day() <= 5
        }
        default: {
          return false;
        }
      }
    }).sort((a, b) => {
      const aDate = dayjs.unix(a.startTime).format('HH:mm:ss');
      const bDate = dayjs.unix(b.startTime).format('HH:mm:ss');
      if (aDate > bDate) return 1;
      if (aDate < bDate) return -1;
      return 0;
    });
  },

  /**
   * 判断是否是全天
   */
  isAllDay: (schedule: API.SCHEDULE.ListItem) => {
    const startTime = dayjs.unix(schedule.startTime);
    const endTime = dayjs.unix(schedule.endTime);

    return startTime.format('HH:mm:ss') === '00:00:00' && endTime.format('HH:mm:ss') === '23:59:59';
  },

  /**
   * 获取日历月份开始结束的unix时间戳
   */
  getCalendarMonthUnixes: (month: string, rows = 6): [number, number] => {
    const monthStartDay = dayjs(month, 'YYYY-MM').startOf('month');
    const monthEndDay = dayjs(month, 'YYYY-MM').endOf('month');
    const beforeDays = (monthStartDay.day() || 7) - 1;
    const afterDays = rows * 7 - monthEndDay.date() - beforeDays;
    const startTime = monthStartDay.subtract(beforeDays, 'day').startOf('date').unix();
    const endTime = monthEndDay.add(afterDays, 'day').endOf('date').unix();
    return [startTime, endTime];
  },

  /**
   * 获取时间描述
   */
  getTimeDescription: (schedule: API.SCHEDULE.ListItem, date: dayjs.Dayjs) => {
    const now = dayjs();
    const startTime = dayjs.unix(schedule.startTime);
    const endTime = dayjs.unix(schedule.endTime);

    const diff = endTime.startOf('date').diff(startTime.startOf('date'), 'd');

    const isRepeat = schedule.reminder.isRepeat;

    const startDate = isRepeat ? date : startTime;

    const endDate = startDate.add(diff, 'd');

    const timesDesc: string[] = [];

    const isAllDay = scheduleUtil.isAllDay(schedule);

    if (isAllDay) {
      if (endDate.isSame(startDate, 'date')) {
        timesDesc[0] = `${startDate.format('MM月DD日')} 周${zhCnWeeks[startDate.day()]} 全天`;
      } else {
        timesDesc[0] = `${startDate.format('MM月DD日')} 周${zhCnWeeks[startDate.day()]}`;
        timesDesc[1] = `${endDate.format('MM月DD日')} 周${zhCnWeeks[startDate.day()]} 全天`;
      }
    } else {
      // 如果开始时间和结束时间是同一年，只在开始时间显示年份
      if (startDate.isSame(endDate, 'year')) {
        // 如果开始时间是今年，不显示年份
        if (startDate.isSame(now, 'year')) {
          timesDesc[0] = `${startDate.format('MM月DD日')} 周${zhCnWeeks[startDate.day()]} ${startTime.format('HH:mm')}`;
        } else {
          timesDesc[0] = `${endDate.format('YYYY年MM月DD日')} 周${zhCnWeeks[endDate.day()]} ${startTime.format('HH:mm')}`;
        }
        // 如果结束时间与开始时间日期相同，则不显示日期
        if (endDate.isSame(startDate, 'date')) {
          timesDesc[1] = `${endTime.format('HH:mm')}`;
        } else {
          timesDesc[1] = `${endDate.format('MM月DD日')} 周${zhCnWeeks[endDate.day()]} ${endTime.format('HH:mm')}`;
        }
      } else {
        // 如果开始时间是今年，则不显示年份
        if (startDate.isSame(now, 'year')) {
          timesDesc[0] = `${startDate.format('MM月DD日')} 周${zhCnWeeks[startDate.day()]} ${startTime.format('HH:mm')}`;
          timesDesc[1] = `${endDate.format('YYYY年MM月DD日')} 周${zhCnWeeks[endDate.day()]} ${endTime.format('HH:mm')}`;
        }
        // 如果结束时间是今年，则不显示年份
        if (endDate.isSame(now, 'year')) {
          timesDesc[0] = `${startDate.format('YYYY年MM月DD日')} 周${zhCnWeeks[startDate.day()]} ${startTime.format('HH:mm')}`;
          timesDesc[1] = `${endDate.format('MM月DD日')} 周${zhCnWeeks[endDate.day()]} ${endTime.format('HH:mm')}`;
        }
      }
    }

    return timesDesc.join(' - ');
  },

  /**
   * 获取重复描述
   */
  getRepeatDescription: (schedule: API.SCHEDULE.ListItem) => {
    if (!schedule.reminder || !schedule.reminder.isRepeat) return '不重复';
    const { repeatUntil, repeatInterval, isCustomRepeat, repeatType, repeatDayOfWeek, repeatDayOfMonth } = schedule.reminder;
    const untilTimeDesc = repeatUntil > 0 ? dayjs.unix(repeatUntil).format('MM月DD日结束') : '永不结束';
    const repeatIntervalDesc = repeatInterval > 1 ? `每${repeatInterval}` : '每';

    // 自定义重复
    if (isCustomRepeat) {
      const scheduleCustomRepeatType = scheduleCustomRepeatTypes.find(item => item.value === repeatType);
      if (!scheduleCustomRepeatType) return '未定义重复类型';
      const intervalDesc = `${repeatIntervalDesc}${scheduleCustomRepeatType.unit}`;
      // 每周
      if (repeatType === 1) {
        const weeksDesc = repeatDayOfWeek.sort().map(item => `周${zhCnWeeks[item]}`).join('、');
        return `${intervalDesc}的${weeksDesc}重复，${untilTimeDesc}`;
      }
      // 每月
      if (repeatType === 2) {
        const monthDaysDesc = repeatDayOfMonth.sort().map(item => `${item}号`).join('、');
        return `${intervalDesc}的${monthDaysDesc}重复，${untilTimeDesc}`;
      }

      // 每天、每年
      return `${intervalDesc}重复，${untilTimeDesc}`;
    }

    // 非自定义重复
    const scheduleRepeatType = scheduleRepeatTypes.find(item => item.value === repeatType);
    if (!scheduleRepeatType) return '未定义重复类型';
    const intervalDesc = `${repeatIntervalDesc}${scheduleRepeatType.unit}`;
    return `${intervalDesc}重复，${untilTimeDesc}`;
  },

  /**
   * 获取提醒描述
   */
  getRemindDescription: (schedule: API.SCHEDULE.ListItem, date: dayjs.Dayjs) => {
    if (!schedule.reminder || !schedule.reminder.isRemind) return '无';
    const startTime = dayjs.unix(schedule.startTime);

    const { remindTimeDiffs } = schedule.reminder;
  
    const isAllDay = scheduleUtil.isAllDay(schedule);

    if (isAllDay) {
      const diffsDesc = remindTimeDiffs.sort().map(diff => {
        const remindTimeDiff = scheduleAllDayRemindTimeDiffs.find(d => d.value === diff);
        if (!remindTimeDiff) {
          const remindTime = date.hour(startTime.hour()).minute(startTime.minute()).second(startTime.second()).add(diff, 'second');
          if (remindTime.isSame(date, 'date')) {
            return remindTime.format('HH:mm');
          } else {
            return remindTime.format('MM月DD日 HH:mm');
          }
        }
        return remindTimeDiff.label;
      });
      return diffsDesc.join('、');
    } else {
      const diffsDesc = remindTimeDiffs.sort().map(diff => {
        const remindTimeDiff = scheduleRemindTimeDiffs.find(d => d.value === diff);
        if (!remindTimeDiff) {
          const remindTime = date.hour(startTime.hour()).minute(startTime.minute()).second(startTime.second()).add(diff, 'second');
          if (remindTime.isSame(date, 'date')) {
            return remindTime.format('HH:mm');
          } else {
            return remindTime.format('MM月DD日 HH:mm');
          }
        }
        return remindTimeDiff.label;
      });
      return diffsDesc.join('、');
    }
  },
};
