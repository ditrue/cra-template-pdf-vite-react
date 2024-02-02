import { useEffect, useRef, useState } from "react";
import { App, FormInstance, FormProps, Modal } from "antd";
import { useRequest } from "ahooks";
import { getCalendar, updateCalendar } from "@/services";
import { CalendarUpdateModalOpenEventDetail, CalendarUpdateModalOpenEventName, dispatchCalendarListRefreshEvent } from "./events";
import { CalendarForm, CalendarFormValues } from "./CalendarForm";

export const CalendarUpdateModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  const form = useRef<FormInstance<CalendarFormValues>>(null);

  const { message } = App.useApp();

  const [id, setId] = useState<number>();

  const { run: runGet, loading: getLoading } = useRequest(getCalendar, {
    manual: true,
    debounceWait: 300,
    onSuccess: (data) => {
      if (data) {
        form.current?.setFieldsValue({
          name: data.name,
          color: data.color,
          description: data.description,
          default: data.default,
        });
      }
    },
  });

  const { run: runUpdate, loading: updateLoading } = useRequest(updateCalendar, {
    manual: true,
    debounceWait: 300,
    onSuccess: () => {
      message.success('更新成功');
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
    const handleOpen = (e: CustomEvent<CalendarUpdateModalOpenEventDetail>) => {
      setId(e.detail.id);
      setOpen(true);
    };
    window.addEventListener(CalendarUpdateModalOpenEventName, handleOpen);

    return () => {
      window.removeEventListener(CalendarUpdateModalOpenEventName, handleOpen);
    };
  }, []);

  const handleOk = () => {
    if (form.current) form.current.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleFormFinish: FormProps<CalendarFormValues>['onFinish'] = (values) => {
    if (!id) return message.error('参数ID不能为空');
    runUpdate(id, values);
  };

  return (
    <Modal
      title="修改日历"
      open={open}
      okButtonProps={{
        loading: getLoading || updateLoading,
      }}
      destroyOnClose
      bodyStyle={{ paddingTop: 24 }}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <CalendarForm
        ref={form}
        onFinish={handleFormFinish}
      />
    </Modal>
  );
};
