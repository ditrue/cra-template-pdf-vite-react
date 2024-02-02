import { useEffect, useRef, useState } from "react";
import { App, FormInstance, FormProps, Modal } from "antd";
import { useRequest } from "ahooks";
import { createCalendarAccount } from "@/services";
import { CalendarAccountCreateModalOpenEventName, dispatchCalendarListRefreshEvent } from "./events";
import { CalendarAccountForm } from "./CalendarAccountForm";

export const CalendarAccountCreateModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  const form = useRef<FormInstance<any>>(null);

  const { message } = App.useApp();

  const { run: runCreate, loading } = useRequest(createCalendarAccount, {
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
    const handleOpen = (_e: CustomEvent) => {
      setOpen(true);
    };
    window.addEventListener(CalendarAccountCreateModalOpenEventName, handleOpen);

    return () => {
      window.removeEventListener(CalendarAccountCreateModalOpenEventName, handleOpen);
    };
  }, []);

  const handleOk = () => {
    if (form.current) form.current.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleFormFinish: FormProps<any>['onFinish'] = (values) => {
    runCreate({ ...values, accountType: 'outlook' });
  };

  return (
    <Modal
      title="创建日历账户"
      open={open}
      okButtonProps={{
        loading,
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
