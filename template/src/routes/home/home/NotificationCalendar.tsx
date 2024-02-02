import { useEffect, useState } from "react";
import { Button, Calendar, CalendarProps, Card, Col, Divider, Row, Select, Space, Spin, Tooltip } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import { ScheduleListRefreshEventName, SchedulePopover, SourceBadge, SourceButton } from "@/components";
import { sourceConfigs } from "@/config";
import { scheduleUtil } from "@/utils";
import { getSchedules } from "@/services";
import { NotificationState } from "./Notification";

type Props = {
  onModeChange?: (mode: NotificationState['mode']) => void;
}

const NotificationCalendar: React.FC<Props> = (props) => {
  const { onModeChange } = props;
  const [selectedSources, setSelectedSources] = useState<string[]>(sourceConfigs.map(item => item.name));
  const [currentMonth, setCurrentMonth] = useState<string>(); // YYYY-MM
  const { data, loading, refresh } = useRequest(
    async () => {
      if (currentMonth) {
        const [startTime, endTime] = scheduleUtil.getCalendarMonthUnixes(currentMonth);
        const result = await getSchedules({ startTime, endTime });
        return result.list;
      }
      return [];
    },
    {
      cacheKey: 'MonthSchedules',
      debounceWait: 300,
      refreshDeps: [currentMonth],
    }
  );

  useEffect(() => {
    setCurrentMonth(dayjs().format('YYYY-MM'));
  }, []);

  useEffect(() => {
    const handleCreateSuccess = () => {
      refresh();
    };
    window.addEventListener(ScheduleListRefreshEventName, handleCreateSuccess);
    return () => {
      window.removeEventListener(ScheduleListRefreshEventName, handleCreateSuccess);
    };
  }, [refresh]);

  const handleModeChange = () => {
    if (onModeChange) onModeChange('list');
  };

  const handleSourceChange = (source: string, active: boolean) => {
    setSelectedSources((arr) => active ? [...arr, source] : arr.filter(item => item !== source));
  };

  const handleCalendarChange: CalendarProps<dayjs.Dayjs>['onChange'] = (date) => {
    setCurrentMonth(date.format('YYYY-MM'));
  };

  const headerRender: CalendarProps<dayjs.Dayjs>['headerRender'] = ({ value, onChange }) => {
    const year = dayjs().year();
    const years = [year - 1, year, year + 1];
    const months = new Array(12).fill(null).map((_, index) => index);

    return (
      <Row justify="space-between" align="middle">
        <Col>
          <Space size="small">
            <Select
              size="small"
              placeholder="年份"
              value={value.year()}
              options={years.map(item => ({ label: `${item}年`, value: item }))}
              onChange={year => onChange(dayjs(value).year(year))}
            />
            <Select
              size="small"
              placeholder="月份"
              className="w-20"
              value={value.month()}
              options={months.map(item => ({ label: `${item + 1}月`, value: item }))}
              onChange={month => onChange(dayjs(value).month(month))}
            />
          </Space>
        </Col>
        <Col className="flex items-center">
          <Space className="mr-32">
            {sourceConfigs.map(source => (
              <SourceButton
                key={source.name}
                sourceName={source.name}
                active={selectedSources.includes(source.name)}
                size="small"
                onClick={() => handleSourceChange(source.name, !selectedSources.includes(source.name))}
              >
                {source.title}
              </SourceButton>
            ))}
          </Space>
          <Tooltip title="查看通知列表">
            <Button
              type="link"
              className="text-2xl p-0 flex items-center"
              onClick={handleModeChange}
            >
              <UnorderedListOutlined />
            </Button>
          </Tooltip>
        </Col>
        <Col span={24}>
          <Divider />
        </Col>
      </Row>
    );
  };

  const cellRender: CalendarProps<dayjs.Dayjs>['cellRender'] = (date) => {
    const listData = scheduleUtil.getDaySchedules(data, date)?.filter(item => selectedSources.includes(item.scheduleType));
    return (
      <ul className="list-none m-0 p-0">
        {listData?.map(item => (
          <li key={item.ID} className="truncate" title={item.summary}>
            <SchedulePopover schedule={item} date={date}>
              <SourceBadge
                sourceName={item.scheduleType}
                size="small"
                text={(
                  <Space size="small">
                    {!scheduleUtil.isAllDay(item) && (
                      <span>{dayjs.unix(item.startTime).format('HH:mm')}</span>
                    )}
                    <span className="ml-1">{item.summary}</span>
                  </Space>
                )}
              />
            </SchedulePopover>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Spin spinning={loading}>
      <Card>
        <Calendar
          mode="month"
          fullscreen
          headerRender={headerRender}
          cellRender={cellRender}
          onChange={handleCalendarChange}
        />
      </Card>
    </Spin>
  );
};

export default NotificationCalendar;
