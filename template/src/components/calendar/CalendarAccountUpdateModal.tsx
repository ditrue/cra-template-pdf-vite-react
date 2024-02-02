import { useEffect, useRef, useState } from "react";
import { App, FormInstance, FormProps, Modal } from "antd";
import { useRequest } from "ahooks";
import { getCalendarAccount, updateCalendarAccount } from "@/services";
import { CalendarAccountUpdateModalOpenEventDetail, CalendarAccountUpdateModalOpenEventName, dispatchCalendarListRefreshEvent } from "./events";
import { CalendarAccountForm } from "./CalendarAccountForm";

export const CalendarAccountUpdateModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  const form = useRef<FormInstance<any>>(null);

  const [title, setTitle] = useState<string>('修改日历账户');

  const { message } = App.useApp();

  const [id, setId] = useState<number>();

  const { run: runGet, loading: getLoading } = useRequest(getCalendarAccount, {
    manual: true,
    debounceWait: 300,
    onSuccess: (data) => {
      if (data) {
        form.current?.setFieldsValue({});
      }
    },
  });

  const { run: runUpdate, loading: updateLoading } = useRequest(updateCalendarAccount, {
    manual: true,
    debounceWait: 300,
    onSuccess: () => {
      message.success('创建成功');
      form.current?.setFieldsValue({});
      setOpen(false);
      dispatchCalendarListRefreshEvent();
    },
  });

  useEffect(() => {
    if (id && open) {
      runGet(id);
    }
  }, [id, open, runGet]);

  useEffect(() => {
    const handleOpen = (e: CustomEvent<CalendarAccountUpdateModalOpenEventDetail>) => {
      setId(e.detail.id);
      if (e.detail.title) setTitle(e.detail.title);
      setOpen(true);
    };
    window.addEventListener(CalendarAccountUpdateModalOpenEventName, handleOpen);

    return () => {
      window.removeEventListener(CalendarAccountUpdateModalOpenEventName, handleOpen);
    };
  }, []);

  const handleOk = () => {
    if (form.current) form.current.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleFormFinish: FormProps<any>['onFinish'] = (values) => {
    if (!id) return message.error('参数ID不能为空');
    runUpdate(id, values);
  };

  return (
    <Modal
      title={title}
      open={open}
      okButtonProps={{
        loading: getLoading || updateLoading,
      }}
      destroyOnClose
      bodyStyle={{ paddingTop: 24 }}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <CalendarAccountForm
        ref={form}
        initialValues={{ accountType: 'outlook' }}
        onFinish={handleFormFinish}
      />
    </Modal>
  );
};
