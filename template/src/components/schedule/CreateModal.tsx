import { useEffect, useMemo, useRef, useState } from "react";
import { App, Badge, FormInstance, FormProps, Modal, SelectProps } from "antd";
import { useRequest } from "ahooks";
import { createSchedule, getCalendarAccounts, getCalendars } from "@/services";
import { formValuesToSchedule, getInitTimes, ScheduleForm, ScheduleFormValues, scheduleToFormValues } from "./Form";
import { dispatchScheduleListRefreshEvent, ScheduleCreateModalOpenEventDetail, ScheduleCreateModalOpenEventName } from "./events";
import dayjs from "dayjs";

export const ScheduleCreateModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>();
  const form = useRef<FormInstance<ScheduleFormValues>>(null);
  const [formValues] = useState(scheduleToFormValues());
  const { message } = App.useApp();

  const { data: calendarAccounts, run: runCalendarAccounts } = useRequest(getCalendarAccounts, {
    manual: true,
    debounceWait: 300,
  });

  const { data: calendars, run: runGetCalendars } = useRequest(getCalendars, {
    manual: true,
    debounceWait: 300,
    onSuccess: (data) => {
      if (data && form.current) {
        const defaultCalendar = data.find(item => item.default);
        if (defaultCalendar) {
          form.current.setFieldValue('calendarID', defaultCalendar.ID);
        }
      }
    },
  });

  const calendarOptions: SelectProps['options'] = useMemo(() => {
    if (!calendarAccounts || !calendars) return [];
    return calendarAccounts.map(account => {
      return {
        label: account.name,
        options: calendars.filter(item => item.account?.ID === account.ID && item.permissions?.includes('createSchedule')).map(calendar => {
          return {
            label: (
              <Badge color={calendar.color} text={calendar.name} />
            ),
            value: calendar.ID,
          };
        }),
      };
    }).filter(item => item.options.length > 0);
  }, [calendarAccounts, calendars]);

  useEffect(() => {
    if (open) {
      runCalendarAccounts();
      runGetCalendars();
    }
  }, [open, runCalendarAccounts, runGetCalendars]);

  const { run: runCreate, loading } = useRequest(createSchedule, {
    manual: true,
    debounceWait: 300,
    onSuccess: () => {
      message.success('创建成功');
      form.current?.setFieldsValue(scheduleToFormValues());
      setOpen(false);
      dispatchScheduleListRefreshEvent();
    },
  });

  useEffect(() => {
    const handleOpen = (e: CustomEvent<ScheduleCreateModalOpenEventDetail>) => {
      const { date } = e.detail;
      setDate(date);
      setOpen(true);
    };
    window.addEventListener(ScheduleCreateModalOpenEventName, handleOpen);

    return () => {
      window.removeEventListener(ScheduleCreateModalOpenEventName, handleOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const today = date ? dayjs(date, 'YYYY-MM-DD HH:mm:ss') : dayjs().minute(0).second(0);
      const [startTime, endTime] = getInitTimes(today);
      setTimeout(() => {
        form.current?.setFieldValue('startTime', startTime.unix());
        form.current?.setFieldValue('endTime', endTime.unix());
      }, 200);
    }
  }, [open, date]);

  const handleOk = () => {
    if (form.current) form.current.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleFormFinish: FormProps<ScheduleFormValues>['onFinish'] = (values) => {
    const schedule = formValuesToSchedule(values);
    runCreate(schedule);
  };

  return (
    <Modal
      title="新建日程"
      open={open}
      okButtonProps={{
        loading,
      }}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ScheduleForm
        ref={form}
        initialValues={formValues}
        showCalendar
        calendarOptions={calendarOptions}
        onFinish={handleFormFinish}
      />
    </Modal>
  );
};
