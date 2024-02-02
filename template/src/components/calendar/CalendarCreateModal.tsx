import { useEffect, useRef, useState } from "react";
import { App, FormInstance, Modal } from "antd";
import { useRequest } from "ahooks";
import { createCalendar } from "@/services";
import { CalendarCreateModalOpenEventDetail, CalendarCreateModalOpenEventName, dispatchCalendarListRefreshEvent } from "./events";
import { CalendarFormValues } from "./CalendarForm";

export const CalendarCreateModal = () => {
  const [open, setOpen] = useState(false);

  const form = useRef<FormInstance<CalendarFormValues>>(null);

  const [accountId, setAccountId] = useState<number>();

  const [title, setTitle] = useState<string>('创建日历');

  const [color, setColor] = useState<string>();

  const { message } = App.useApp();

  const { run: runCreate, loading } = useRequest(createCalendar, {
    manual: true,
    debounceWait: 300,
    onSuccess: () => {
      message.success('创建成功');
      form.current?.setFieldsValue({});
      setOpen(false);
      setAccountId(undefined);
      dispatchCalendarListRefreshEvent();
    },
  });

  useEffect(() => {
    const handleOpen = (e: CustomEvent<CalendarCreateModalOpenEventDetail>) => {
      console.log(e.detail);
      setAccountId(e.detail.accountId);
      if (e.detail.title) setTitle(e.detail.title);
      if (e.detail.color) setColor(e.detail.color.toLowerCase());
      setOpen(true);
    };
    window.addEventListener(CalendarCreateModalOpenEventName, handleOpen);

    return () => {
      window.removeEventListener(CalendarCreateModalOpenEventName, handleOpen);
    };
  }, []);

  useEffect(() => {
    if (open && color) {
      const timerId = setTimeout(() => {
        form.current?.setFieldValue('color', color);
      }, 200);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [color, open]);

  const handleOk = () => {
    if (!accountId) return message.error('日历账户不能为空');
    runCreate({ accountID: accountId });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title={title}
      open={open}
      okButtonProps={{
        loading,
      }}
      destroyOnClose
      bodyStyle={{ paddingTop: 24 }}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      确定要创建企业微信日历么？
    </Modal>
  );
};
