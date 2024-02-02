import { forwardRef, useEffect } from "react";
import { App, Checkbox, Col, Form, FormInstance, FormProps, Input, InputNumber, Row, Select, SelectProps, Space } from "antd";
import dayjs from "dayjs";
import { scheduleCustomRepeatTypes } from "@/config";
import UnixDateTimePicker from "./UnixDateTimePicker";
import { UserAddressBookSelector } from "../userAddressBook";
import DayOfWeek from "./DayOfWeek";
import DayOfMonth from "./DayOfMonth";

// 非全天提醒选项
const remindTimeDiffsOptions = [
  { label: '日程开始时', value: 0 },
  { label: '5分钟前', value: -5 * 60 },
  { label: '15分钟前', value: -15 * 60 },
  { label: '1小时前', value: -60 * 60 },
  { label: '1天前', value: -24 * 60 * 60 },
];

// 全天提醒选项
const allDayRemindTimeDiffsOptions = [
  { label: '当天9点', value: 9 * 60 * 60 },
  { label: '1天前9点', value: -(24 - 9) * 60 * 60 },
  { label: '2天前9点', value: -(24 - 9 + 24) * 60 },
  { label: '1周前9点', value: -(24 - 9 + 24 * 6) * 60 * 60 },
];

// 重复类型选项
const repeatTypeOptions = [
  { label: '不重复', value: 0 },
  { label: '每天重复', value: 1, repeatType: 0 },
  { label: '每个工作日重复', value: 2, repeatType: 7 },
  { label: '每周重复', value: 3, repeatType: 1 },
  { label: '每两周重复', value: 4, repeatType: 1 },
  { label: '每月重复', value: 5, repeatType: 2 },
  { label: '每年重复', value: 6, repeatType: 7 },
  { label: '自定义...', value: 99 },
];

export type ScheduleFormValues = {
  calendarID?: number;
  summary?: string;
  attendees?: number[];
  isAllDay?: boolean;
  startTime: number;
  endTime: number;
  location?: string;
  description?: string;
  allowActiveJoin?: boolean;
  remindTimeDiffs?: number[];
  allDayRemindTimeDiffs?: number[];
  repeatType?: number;
  repeatInterval?: number;
  customRepeatType?: number;
  repeatUntil?: number;
  repeatDayOfWeek?: number[];
  repeatDayOfMonth?: number[];
};

export const getInitTimes = (date?: dayjs.Dayjs) => {
  const today = date || dayjs().minute(0).second(0);
  const startTime = today.add(2, 'hour');
  const endTime = today.add(3, 'hour');
  return [startTime, endTime];
};

export const scheduleToFormValues = (schedule?: API.SCHEDULE.Detail) => {
  const [initStartTime, initEndTime] = getInitTimes();
  const formValues: ScheduleFormValues = {
    summary: '',
    location: '',
    description: '',
    isAllDay: false,
    startTime: initStartTime.unix(),
    endTime: initEndTime.unix(),
    remindTimeDiffs: [remindTimeDiffsOptions[2].value],
    allDayRemindTimeDiffs: [allDayRemindTimeDiffsOptions[0].value],
    allowActiveJoin: true,
    repeatType: 0,
    repeatInterval: 1,
    repeatUntil: 0,
    repeatDayOfWeek: [],
    repeatDayOfMonth: [],
    customRepeatType: 0,
  };
  if (schedule) {
    formValues.summary = schedule.summary;
    formValues.attendees = schedule.attendees;
    if (schedule.startTime) {
      formValues.startTime = schedule.startTime;
    }
    if (schedule.endTime) {
      formValues.endTime = schedule.endTime;
    }
    const startTime = dayjs.unix(schedule.startTime);
    const endTime = dayjs.unix(schedule.endTime);
    const isAllDay = startTime.format('HH:mm:ss') === '00:00:00' && endTime.format('HH:mm:ss') === '23:59:59';
    formValues.isAllDay = isAllDay;
    formValues.location = schedule.location;
    formValues.description = schedule.description;
    formValues.allowActiveJoin = !!schedule.allowActiveJoin;
    const reminder = schedule.reminder;
    if (reminder) {
      if (reminder.isRemind) {
        if (isAllDay) {
          formValues.allDayRemindTimeDiffs = reminder.remindTimeDiffs;
        } else {
          formValues.remindTimeDiffs = reminder.remindTimeDiffs;
        }
      }
      if (reminder.isRepeat) {
        if (reminder.repeatUntil) {
          formValues.repeatUntil = dayjs.unix(reminder.repeatUntil).hour(0).minute(0).second(0).unix();
        }
        if (reminder.isCustomRepeat) {
          formValues.repeatType = 99;
          formValues.customRepeatType = reminder.repeatType;
          if (reminder.repeatInterval) formValues.repeatInterval = reminder.repeatInterval;
          if (reminder.repeatDayOfWeek) formValues.repeatDayOfWeek = reminder.repeatDayOfWeek;
          if (reminder.repeatDayOfMonth) formValues.repeatDayOfMonth = reminder.repeatDayOfMonth;
        } else {
          switch (reminder.repeatType) {
            // 0 - 每日
            case 0: {
              formValues.repeatType = 1;
              break;
            }
            // 1 - 每周
            case 1: {
              if (reminder.repeatInterval === 2) {
                formValues.repeatType = 4;
              } else {
                formValues.repeatType = 3;
              }
              break;
            }
            // 2 - 每月
            case 2: {
              formValues.repeatType = 5;
              break;
            }
            // 5 - 每年
            case 5: {
              formValues.repeatType = 5;
              break;
            }
            // 7 - 工作日
            case 7: {
              formValues.repeatType = 2;
              break;
            }
          }
        }
      }
    }
  }
  return formValues;
};

export const formValuesToSchedule = (formValues?: ScheduleFormValues) => {
  const schedule: Partial<API.SCHEDULE.Detail> = {
    summary: '无主题',
    description: '',
    location: '',
    attendees: [],
    allowActiveJoin: true,
    reminder: {
      isRemind: 0,
      remindTimeDiffs: [],
      isRepeat: 0,
      repeatType: 0,
      repeatUntil: 0,
      isCustomRepeat: 0,
      repeatInterval: 1,
      repeatDayOfWeek: [],
      repeatDayOfMonth: [],
    },
  };
  if (formValues) {
    if (formValues.calendarID) {
      schedule.calendarID = formValues.calendarID;
    }
    if (formValues.isAllDay) {
      const startTime = dayjs.unix(formValues.startTime).startOf('date');
      const endTime = dayjs.unix(formValues.endTime).endOf('date');
      schedule.startTime = startTime.unix();
      schedule.endTime = endTime.unix();
    } else {
      schedule.startTime = formValues.startTime;
      schedule.endTime = formValues.endTime;
    }
    if (formValues.summary) schedule.summary = formValues.summary;
    if (formValues.description) schedule.description = formValues.description;
    if (formValues.location) schedule.location = formValues.location;
    if (formValues.attendees) schedule.attendees = formValues.attendees;
    if (!schedule.reminder) schedule.reminder = {};
    if (formValues.remindTimeDiffs) {
      if (formValues.remindTimeDiffs.length > 0) schedule.reminder.isRemind = 1;
      schedule.reminder.remindTimeDiffs = formValues.remindTimeDiffs;
    }
    if (!formValues.allowActiveJoin) schedule.allowActiveJoin = false;
    if (formValues.repeatType) {
      schedule.reminder.isRepeat = 1;

      const repeatTypeOption = repeatTypeOptions.find(item => item.value === formValues.repeatType);
      if (repeatTypeOption?.repeatType) schedule.reminder.repeatType = repeatTypeOption.repeatType;

      // 每两周重复
      if (formValues.repeatType === 4) {
        schedule.reminder.repeatInterval = 2;
      }

      // 自定义重复
      if (formValues.repeatType === 99) {
        schedule.reminder.isCustomRepeat = 1;
        schedule.reminder.repeatType = formValues.customRepeatType;
        if (formValues.repeatInterval) schedule.reminder.repeatInterval = formValues.repeatInterval;
        if (formValues.repeatDayOfWeek) schedule.reminder.repeatDayOfWeek = formValues.repeatDayOfWeek;
        if (formValues.repeatDayOfMonth) schedule.reminder.repeatDayOfMonth = formValues.repeatDayOfMonth;
      }
      if (formValues.repeatUntil && schedule.endTime) {
        const diff = schedule.endTime - dayjs.unix(schedule.endTime).hour(0).minute(0).second(0).unix();
        schedule.reminder.repeatUntil = dayjs.unix(formValues.repeatUntil).hour(0).minute(0).second(0).unix() + diff;
      }
    }
  }
  return schedule;
};

type Props = {
  initialValues?: ScheduleFormValues;
  values?: ScheduleFormValues;
  showRepeat?: boolean;
  showCalendar?: boolean;
  calendarOptions?: SelectProps['options'];
  onFinish?: FormProps<ScheduleFormValues>['onFinish'];
};

export const ScheduleForm = forwardRef<FormInstance<ScheduleFormValues>, Props>((props, ref) => {
  const {
    initialValues,
    values,
    showRepeat = true,
    showCalendar = false,
    calendarOptions,
    onFinish,
  } = props;

  const [form] = Form.useForm();

  const { message } = App.useApp();

  useEffect(() => {
    form.setFieldsValue(values);
  }, [form, values]);

  const handleFinish: FormProps<ScheduleFormValues>['onFinish'] = (values) => {
    if (onFinish) onFinish(values);
  };

  const handleFinishFailed: FormProps<ScheduleFormValues>['onFinishFailed'] = (errorInfo) => {
    message.warning(errorInfo.errorFields[0].errors[0]);
  };

  const handleValuesChange: FormProps<ScheduleFormValues>['onValuesChange'] = (changeValues, allValues) => {
    const keys = Object.keys(changeValues);
    if (keys.includes('customRepeatType')) {
      const startTime = dayjs.unix(allValues.startTime);
      form.setFieldValue('repeatInterval', 1);
      if (changeValues.customRepeatType === 1) {
        form.setFieldValue('repeatDayOfWeek', [(startTime.day() || 7)]);
      }
      if (changeValues.customRepeatType === 2) {
        form.setFieldValue('repeatDayOfMonth', [startTime.date()]);
      }
    }
  };

  return (
    <Form
      ref={ref}
      form={form}
      initialValues={initialValues}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      onValuesChange={handleValuesChange}
    >
      <Row align="top" wrap={false}>
        <Col className="w-12 h-8 flex items-center" flex="none">主题</Col>
        <Col flex={1}>
          <Form.Item noStyle name="summary">
            <Input placeholder="请输入主题" />
          </Form.Item>
        </Col>
      </Row>
      <Row align="top" className="mt-4" wrap={false}>
        <Col className="w-12 h-8 flex items-center" flex="none">参与人</Col>
        <Col flex={1}>
          <Form.Item noStyle name="attendees">
            <UserAddressBookSelector
              max={100}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row align="top" className="mt-4" wrap={false}>
        <Col className="w-12 h-8 flex items-center" flex="none">开始</Col>
        <Col flex={1}>
          <Form.Item noStyle dependencies={['isAllDay']}>
            {({ getFieldValue }) => (
              <Form.Item noStyle name="startTime">
                <UnixDateTimePicker
                  showTime={!getFieldValue('isAllDay')}
                />
              </Form.Item>
            )}
          </Form.Item>
        </Col>
        <Col className="w-16 ml-2">
          <Space className="h-8" align="center">
            <Form.Item noStyle name="isAllDay" valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <label htmlFor="isAllDay">全天</label>
          </Space>
        </Col>
      </Row>
      <Row align="top" className="mt-4" wrap={false}>
        <Col className="w-12 h-8 flex items-center" flex="none">结束</Col>
        <Col flex={1}>
          <Form.Item noStyle dependencies={['isAllDay']}>
            {({ getFieldValue }) => (
              <Form.Item
                noStyle
                name="endTime"
                rules={[
                  ({ getFieldValue }) => ({
                    validator: (_: Record<string, any>, value: number) => {
                      const withValue = getFieldValue('startTime');
                      const isAllDay = getFieldValue('isAllDay');
                      if (isAllDay && dayjs.unix(value).isSameOrAfter(dayjs.unix(withValue), 'date')) {
                        return Promise.resolve();
                      }
                      if (withValue < value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('结束时间必须晚于开始时间'));
                    },
                  })
                ]}
              >
                <UnixDateTimePicker
                  showTime={!getFieldValue('isAllDay')}
                />
              </Form.Item>
            )}
          </Form.Item>
        </Col>
        <Col className="w-16 ml-2" />
      </Row>
      <Row align="top" className="mt-4" wrap={false}>
        <Col className="w-12 h-8 flex items-center" flex="none">地点</Col>
        <Col flex={1}>
          <Form.Item noStyle name="location">
            <Input placeholder="请输入地点" />
          </Form.Item>
        </Col>
      </Row>
      <Row align="top" className="mt-4" wrap={false}>
        <Col className="w-12 h-8 flex items-center" flex="none">描述</Col>
        <Col flex={1}>
          <Form.Item noStyle name="description">
            <Input.TextArea
              placeholder="请输入描述"
              autoSize={{ minRows: 6, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row align="top" className="mt-4" wrap={false}>
        <Col className="w-12 h-8 flex items-center" flex="none">提醒</Col>
        <Col flex={1}>
          <Form.Item noStyle dependencies={['isAllDay']}>
            {({ getFieldValue }) => getFieldValue('isAllDay') ? (
              <Form.Item noStyle name="allDayRemindTimeDiffs">
                <Select
                  className="w-full"
                  mode="multiple"
                  placeholder="无"
                  options={allDayRemindTimeDiffsOptions}
                />
              </Form.Item>
            ) : (
              <Form.Item noStyle name="remindTimeDiffs">
                <Select
                  className="w-full"
                  mode="multiple"
                  placeholder="无"
                  options={remindTimeDiffsOptions}
                />
              </Form.Item>
            )}
          </Form.Item>
        </Col>
      </Row>
      {showRepeat && (
        <>
          <Row align="top" className="mt-4" wrap={false}>
            <Col className="w-12 h-8 flex items-center" flex="none">重复</Col>
            <Col flex={1}>
              <Form.Item noStyle name="repeatType">
                <Select
                  className="w-full"
                  placeholder="无"
                  options={repeatTypeOptions}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item noStyle dependencies={['repeatType']}>
            {({ getFieldValue }) => getFieldValue('repeatType') === 99 && (
              <>
                <Row align="top" className="mt-4" wrap={false}>
                  <Col className="w-12 h-8 flex items-center" flex="none">频率</Col>
                  <Col flex={1}>
                    <Form.Item noStyle name="customRepeatType">
                      <Select
                        className="w-full"
                        placeholder="无"
                        options={scheduleCustomRepeatTypes.map(item => ({ label: item.label, value: item.value }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item noStyle dependencies={['customRepeatType']}>
                  {({ getFieldValue }) => {
                    const repeatTypeOption = scheduleCustomRepeatTypes.find(item => item.value === getFieldValue('customRepeatType'));
                    if (!repeatTypeOption) return null;
                    return (
                      <Row align="middle" className="mt-4" wrap={false}>
                        <Col className="w-12 h-8 flex items-center" flex="none">每</Col>
                        <Col>
                          <Form.Item noStyle name="repeatInterval">
                            <InputNumber
                              min={repeatTypeOption.min}
                              max={repeatTypeOption.max}
                              precision={0}
                            />
                          </Form.Item>
                        </Col>
                        <Col className="pl-1">{repeatTypeOption.unit}</Col>
                      </Row>
                    );
                  }}
                </Form.Item>
                <Form.Item noStyle dependencies={['customRepeatType']}>
                  {({ getFieldValue }) => getFieldValue('customRepeatType') === 1 && (
                    <Row align="middle" className="mt-4" wrap={false}>
                      <Col className="w-12 h-8 flex items-center" flex="none">每周的</Col>
                      <Col flex={1}>
                        <Form.Item noStyle name="repeatDayOfWeek">
                          <DayOfWeek />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </Form.Item>
                <Form.Item noStyle dependencies={['customRepeatType']}>
                  {({ getFieldValue }) => getFieldValue('customRepeatType') === 2 && (
                    <Row align="top" className="mt-4" wrap={false}>
                      <Col className="w-12 h-8 flex items-center" flex="none">每月的</Col>
                      <Col flex={1}>
                        <Form.Item noStyle name="repeatDayOfMonth">
                          <DayOfMonth />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </Form.Item>
              </>
            )}
          </Form.Item>
          <Form.Item noStyle dependencies={['repeatType']}>
            {({ getFieldValue }) => getFieldValue('repeatType') !== 0 && (
              <Row align="top" className="mt-4" wrap={false}>
                <Col className="w-12 h-8 flex items-center" flex="none">结束于</Col>
                <Col flex={1}>
                  <Form.Item
                    noStyle
                    name="repeatUntil"
                    rules={[
                      ({ getFieldValue }) => ({
                        validator: (_: Record<string, any>, value: number) => {
                          if (!value) return Promise.resolve();
                          const startDay = dayjs.unix(getFieldValue('startTime'));
                          const utilDay = dayjs.unix(value);
                          if (utilDay.isAfter(startDay, 'date')) return Promise.resolve();
                          return Promise.reject(new Error('重复结束日期必须晚于开始日期'));
                        },
                      })
                    ]}
                  >
                    <UnixDateTimePicker
                      showTime={false}
                      dateAllowClear
                      datePlaceholder="永不结束"
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Form.Item>
        </>
      )}
      {showCalendar && (
        <Row align="top" className="mt-4 hidden" wrap={false}>
          <Col className="w-12 h-8 flex items-center" flex="none">日历</Col>
          <Col flex={1}>
            <Form.Item noStyle name="calendarID">
              <Select
                className="w-full"
                options={calendarOptions}
              />
            </Form.Item>
          </Col>
        </Row>
      )}
      <Row align="top" className="mt-4" wrap={false}>
        <Col className="w-12 h-8 flex items-center" flex="none"></Col>
        <Col flex={1}>
          <Space className="h-8" align="center">
            <Form.Item
              noStyle
              name="allowActiveJoin"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <label htmlFor="allowActiveJoin">允许成员主动加入</label>
          </Space>
        </Col>
      </Row>
    </Form>
  );
});
