import { useEffect, useMemo, useState } from "react";
import { App, Badge, Button, ButtonProps, Calendar, CalendarProps, Card, Divider, Select, Space, Spin, Tooltip } from "antd";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import classNames from "classnames";
import chroma from "chroma-js";
import { CalendarListRefreshEventName, ScheduleListRefreshEventName, SchedulePopover, ThSpinWithEmpty, dispatchCalendarAccountUpdateModalOpenEvent, dispatchCalendarCreateModalOpenEvent, dispatchScheduleCreateModalOpenEvent } from "@/components";
import { scheduleUtil } from "@/utils";
import { getCalendarAccounts, getCalendars, getSchedules } from "@/services";
import { useSse } from "@/hooks";
import { calendarConfig } from "@/config";

const ScheduleCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(); // YYYY-MM

  const [currentDate, setCurrentDate] = useState<string>(); // YYYY-MM-DD

  const [currentAccountIds, setCurrentAccountIds] = useState<number[]>([]);

  const [scheduleTimeRange, setScheduleTimeRange] = useState<[number, number]>();

  useSse();

  const { message } = App.useApp();

  const { data: calendarAccounts, loading: getCalendarAccountsLoading, refresh: calendarAccountsRefresh } = useRequest(getCalendarAccounts, {
    cacheKey: 'CalendarAccounts',
    debounceWait: 300,
  });

  const { data: calendars, loading: getCalendarsLoading, refresh: calendarsRefresh } = useRequest(getCalendars, {
    cacheKey: 'Calendars',
    debounceWait: 300,
  });

  const { data, loading, refresh } = useRequest(
    async () => {
      if (scheduleTimeRange) {
        const [startTime, endTime] = scheduleTimeRange;
        const result = await getSchedules({ startTime, endTime });
        return result.list;
      }
      return [];
    },
    {
      cacheKey: 'MonthSchedules',
      debounceWait: 300,
      refreshDeps: [scheduleTimeRange],
    }
  );

  const currentCalendarIds = useMemo(() => {
    if (currentAccountIds.length === 0 || !calendars || calendars.length === 0) return [];
    return calendars.filter(item => currentAccountIds.includes(item.account.ID)).map(item => item.ID);
  }, [currentAccountIds, calendars]);

  useEffect(() => {
    setCurrentMonth(dayjs().format('YYYY-MM'));
    setCurrentDate(dayjs().format('YYYY-MM-DD'));
  }, []);

  useEffect(() => {
    const timeRange = currentMonth ? scheduleUtil.getCalendarMonthUnixes(currentMonth) : undefined;
    setScheduleTimeRange(timeRange);
  }, [currentMonth]);

  useEffect(() => {
    const handleSuccess = () => {
      calendarsRefresh();
      calendarAccountsRefresh();
    };
    window.addEventListener(CalendarListRefreshEventName, handleSuccess);
    return () => {
      window.removeEventListener(CalendarListRefreshEventName, handleSuccess);
    };
  }, [refresh, calendarAccountsRefresh, calendarsRefresh]);

  useEffect(() => {
    const handleSuccess = () => {
      refresh();
    };
    window.addEventListener(ScheduleListRefreshEventName, handleSuccess);
    return () => {
      window.removeEventListener(ScheduleListRefreshEventName, handleSuccess);
    };
  }, [refresh]);

  useEffect(() => {
    setCurrentAccountIds(() => {
      if (!calendarAccounts) return [];
      return calendarAccounts.map(item => item.ID);
    });
  }, [calendarAccounts]);

  const handleCalendarChange: CalendarProps<dayjs.Dayjs>['onChange'] = (date) => {
    setCurrentMonth(date.format('YYYY-MM'));
    setCurrentDate(date.format('YYYY-MM-DD'));
  };

  const handleCalendarSelect: CalendarProps<dayjs.Dayjs>['onSelect'] = (date) => {
    const df = date.format('YYYY-MM-DD');
    if (currentDate !== df) return;
    dispatchScheduleCreateModalOpenEvent({
      date: date.hour(dayjs().hour()).second(0).minute(0).format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  const handleCreateClick: ButtonProps['onClick'] = () => {
    dispatchScheduleCreateModalOpenEvent();
  };

  const headerRender: CalendarProps<dayjs.Dayjs>['headerRender'] = ({ value, onChange }) => {
    const years = (() => {
      const count = 10;
      const from = value.year() - Math.ceil(count / 2);
      return new Array(count).fill(0).map((_, index) => from + index);
    })();
    const months = new Array(12).fill(null).map((_, index) => index);

    return (
      <div>
        <div className="flex justify-between items-center h-14 px-6">
          <Space size="small">
            <Select
              size="small"
              placeholder="年份"
              className="w-24 text-center"
              value={value.year()}
              options={years.map(item => ({ label: `${item}年`, value: item }))}
              onChange={year => onChange(dayjs(value).year(year))}
            />
            <Select
              size="small"
              placeholder="月份"
              className="w-20 text-center"
              value={value.month()}
              options={months.map(item => ({ label: `${item + 1}月`, value: item }))}
              onChange={month => onChange(dayjs(value).month(month))}
            />
          </Space>
          <Button
            className="flex-none"
            shape="round"
            icon={(<PlusOutlined/ >)}
            onClick={handleCreateClick}
          >
            新建日程
          </Button>
        </div>
        <Divider className="mt-0" />
      </div>
    );
  };

  const cellRender: CalendarProps<dayjs.Dayjs>['cellRender'] = (date) => {
    const listData = scheduleUtil.getDaySchedules(data, date)?.filter(item => {
      const id = item.calendarID || item.calendar?.ID;
      return id && currentCalendarIds.includes(id);
    });
    return (
      <ul className="list-none m-0 p-0">
        {listData?.map(schedule => {
          const calendar = calendars?.find(item => {
            const id = schedule.calendarID || schedule.calendar?.ID;
            return id && item.ID === id;
          });
          const color = calendar?.color || calendarConfig.defaultColor;
          return (
            <li
              key={schedule.ID}
              className="truncate"
              title={schedule.summary}
              onClick={e => e.stopPropagation()}
            >
              <SchedulePopover schedule={schedule} date={date}>
                <Badge
                  color={chroma(color).saturate(1.5).hex()}
                  size="small"
                  text={(
                    <Space size={4} className="text-xs">
                      {!scheduleUtil.isAllDay(schedule) && (
                        <span>{dayjs.unix(schedule.startTime).format('HH:mm')}</span>
                      )}
                      <span>{schedule.summary}</span>
                    </Space>
                  )}
                />
              </SchedulePopover>
            </li>
          );
        })}
      </ul>
    );
  };

  const handleToggleAccount = (id: number) => {
    setCurrentAccountIds((ids) => {
      if (ids.includes(id)) {
        return ids.filter(item => item !== id);
      }
      return [...ids, id];
    });
  };

  const handleAccountSetting = (account: API.CALENDAR.CalendarAccount) => {
    switch(account.accountType) {
      case 'wechat':
        dispatchCalendarCreateModalOpenEvent({
          accountId: account.ID,
          title: '创建日历 - 企业微信',
          color: account.color.toLowerCase(),
        });
        break;
      case 'outlook':
        dispatchCalendarAccountUpdateModalOpenEvent({
          id: account.ID,
          title: '修改日历账户 - outlook',
        });
        break;
      default:
        message.error('无效的操作');
    }
  };

  const calendarListLoading = getCalendarAccountsLoading || getCalendarsLoading;

  return (
    <div className="flex">
      <div className="flex-none w-80">
        <Card
          title="我的日历账户"
          bodyStyle={{ paddingTop: 20, paddingBottom: 20 }}
        >
          <ThSpinWithEmpty
            minHeight={148}
            loading={calendarListLoading}
            empty={{
              description: (
                <div className="text-black text-opacity-25 mt-4">
                  {loading ? '数据加载中' : '暂无数据'}
                </div>
              )
            }}
            active={calendarAccounts && calendarAccounts.length > 0}
          >
            <div>
              {calendarAccounts && calendarAccounts.map(account => {
                const checked = currentAccountIds.includes(account.ID);
                const cs = calendars?.filter(item => item.account.ID === account.ID) || [];
                const needSetting = (account.accountType === 'wechat' && cs.length === 0) || (account.accountType === 'outlook' && account.status !== 1);
                return (
                  <div
                    key={account.ID}
                    className={classNames("h-9 flex justify-between items-center rounded pl-3 pr-1 cursor-pointer mt-5 first:mt-0", {
                      'shadow': !checked,
                    })}
                    style={{
                      backgroundColor: checked ? account.color : '',
                    }}
                    onClick={() => handleToggleAccount(account.ID)}
                  >
                    <div className="flex items-center">
                      <img
                        className="w-4 h-4 object-scale-down"
                        src={account.icon}
                        alt=""
                      />
                      <span className="ml-2">
                        {account.name}
                      </span>
                    </div>
                    {needSetting && (
                      <Tooltip title="点击进行账户配置">
                        <Button
                          className="text-red-700"
                          type="ghost"
                          shape="circle"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccountSetting(account);
                          }}
                        >
                          <ExclamationCircleOutlined />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                )
              })}
            </div>
          </ThSpinWithEmpty>
        </Card>
      </div>
      <div className="flex-1 ml-4">
        <Spin spinning={loading}>
          <Card className="overflow-hidden" bodyStyle={{ padding: 0 }}>
            <Calendar
              mode="month"
              fullscreen
              headerRender={headerRender}
              cellRender={cellRender}
              onChange={handleCalendarChange}
              onSelect={handleCalendarSelect}
            />
          </Card>
        </Spin>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
