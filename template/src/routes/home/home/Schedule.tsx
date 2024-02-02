import { useEffect, useMemo, useState } from "react";
import { Button, ButtonProps, Calendar, CalendarProps, Card, Col, ConfigProvider, Divider, Empty, List, Row, Select, Space } from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import chroma from "chroma-js";
import { getCalendars, getSchedules } from "@/services";
import { scheduleUtil } from "@/utils";
import { calendarConfig } from "@/config";
import { dispatchScheduleCreateModalOpenEvent, ScheduleListRefreshEventName, SchedulePopover, ThSpinWithEmpty } from "@/components";

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(); // YYYY-MM-DD

  const [scheduleTimeRange, setScheduleTimeRange] = useState<[number, number]>();

  const { data: calendars } = useRequest(getCalendars, {
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
      cacheKey: 'SingleDaySchedules',
      debounceWait: 300,
      refreshDeps: [scheduleTimeRange],
    }
  );

  const dataSource = useMemo(() => {
    return scheduleUtil.getDaySchedules(data, dayjs(currentDate));
  }, [currentDate, data]);

  useEffect(() => {
    setCurrentDate(dayjs().format('YYYY-MM-DD'));
  }, []);

  useEffect(() => {
    if (currentDate) {
      const startTime = dayjs(currentDate, 'YYYY-MM-DD').startOf('date').unix();
      const endTime = dayjs(currentDate, 'YYYY-MM-DD').endOf('date').unix();
      setScheduleTimeRange([startTime, endTime]);
    } else {
      setScheduleTimeRange(undefined);
    }
  }, [currentDate]);

  useEffect(() => {
    const handleCreateSuccess = () => {
      refresh();
    };
    window.addEventListener(ScheduleListRefreshEventName, handleCreateSuccess);
    return () => {
      window.removeEventListener(ScheduleListRefreshEventName, handleCreateSuccess);
    };
  }, [refresh]);

  const handleCalendarChange: CalendarProps<dayjs.Dayjs>['onChange'] = (date) => {
    setCurrentDate(date.format('YYYY-MM-DD'));
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
      <ConfigProvider theme={{ token: { lineWidth: 1 } }}>
        <Row justify="space-between" align="middle">
          <Col className="px-6 h-8 flex items-center">
            <Space size="small">
              <Select
                placeholder="年份"
                size="small"
                className="w-24 text-center"
                value={value.year()}
                options={years.map(item => ({ label: `${item}年`, value: item }))}
                onChange={year => onChange(dayjs(value).year(year))}
              />
              <Select
                placeholder="月份"
                size="small"
                className="w-20 text-center"
                value={value.month()}
                options={months.map(item => ({ label: `${item + 1}月`, value: item }))}
                onChange={month => onChange(dayjs(value).month(month))}
              />
            </Space>
          </Col>
          <Col span={24}>
            <Divider className="my-4" />
          </Col>
        </Row>
      </ConfigProvider>
    );
  };

  return (
    <Card
      title="日程"
      headStyle={{ border: 'none' }}
      bodyStyle={{ padding: 0 }}
      extra={(
        <Button
          shape="round"
          block
          icon={(<PlusOutlined/ >)}
          onClick={handleCreateClick}
        >
          新建
        </Button>
      )}
    >
      <ConfigProvider
        theme={{
          token: {
            lineWidth: 0,
          }
        }}
      >
        <Calendar
          mode="month"
          fullscreen={false}
          headerRender={headerRender}
          onChange={handleCalendarChange}
          value={dayjs(currentDate)}
        />
      </ConfigProvider>
      <Divider className="my-4" />
      <ThSpinWithEmpty
        minHeight={140}
        loading={loading}
        empty={{
          image: Empty.PRESENTED_IMAGE_SIMPLE,
          description: loading ? '数据加载中' : '暂无数据',
          imageStyle: { height: 64 },
        }}
        active={dataSource && dataSource.length > 0}
      >
        <List
          className="px-2 pb-4"
          size="small"
          rowKey="ID"
          bordered={false}
          dataSource={dataSource}
          renderItem={(schedule) => {
            const calendar = calendars?.find(item => {
              const id = schedule.calendarID || schedule.calendar?.ID;
              return id && item.ID === id;
            });
            const color = calendar?.color || calendarConfig.defaultColor;
            return (
              <SchedulePopover
                schedule={schedule}
                date={dayjs(currentDate)}
              >
                <div
                  className="my-2 px-2 py-2 border-0 border-l-2 border-solid cursor-pointer truncate"
                  style={{ backgroundColor: color, borderLeftColor: chroma(color).saturate(1.5).hex() }}
                >
                  <Space size="small">
                    {!scheduleUtil.isAllDay(schedule) && (
                      <span>
                        {dayjs.unix(schedule.startTime).format('HH:mm')}
                      </span>
                    )}
                    <span title={schedule.summary}>
                      {schedule.summary}
                    </span>
                  </Space>
                </div>
              </SchedulePopover>
            )
          }}
        />
      </ThSpinWithEmpty>
    </Card>
  );
};

export default Schedule;
