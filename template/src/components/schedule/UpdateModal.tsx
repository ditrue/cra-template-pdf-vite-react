import { useEffect, useRef, useState } from "react";
import { App, FormInstance, FormProps, Modal } from "antd";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { getSchedule, updateSchedule } from "@/services";
import { formValuesToSchedule, ScheduleForm, ScheduleFormValues, scheduleToFormValues } from "./Form";
import { dispatchScheduleListRefreshEvent, ScheduleUpdateModalOpenEventDetail, ScheduleUpdateModalOpenEventName } from "./events";

export const ScheduleUpdateModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  // 日程ID
  const [id, setId] = useState<number>();

  // 修改类型 1: 仅次日程，2: 次日程及后续日程，0: 全部日程
  const [modifyType, setModifyType] = useState(0);

  // 修改时间
  const [modifyTime, setModifyTime] = useState<number>();

  // 是否显示重复选项
  const [showRepeat, setShowRepeat] = useState(false);

  const form = useRef<FormInstance<ScheduleFormValues>>(null);
  const [formValues] = useState(scheduleToFormValues());

  const { message } = App.useApp();

  const { run: runGetDetail, loading: detailLoading } = useRequest(getSchedule, {
    manual: true,
    debounceWait: 300,
    onSuccess: (data) => {
      if (data) {
        const modifyDate = dayjs.unix(modifyTime as number);
        const startTime = dayjs.unix(data.startTime);
        const endTime = dayjs.unix(data.endTime);
        const diff = endTime.startOf('date').diff(startTime.startOf('date'), 'd');
        if (data.reminder.isRepeat) {
          data.startTime = modifyDate.hour(startTime.hour()).minute(startTime.minute()).second(startTime.second()).unix();
          data.endTime = modifyDate.add(diff, 'd').hour(endTime.hour()).minute(endTime.minute()).second(endTime.second()).unix();
        }
        setShowRepeat(!(data.reminder.isRepeat === 1 && modifyType === 1));
        form.current?.setFieldsValue(scheduleToFormValues(data));
      }
    },
  });

  const { run: runUpdate, loading: updateLoading } = useRequest(updateSchedule, {
    manual: true,
    debounceWait: 300,
    onSuccess: () => {
      message.success('更新成功');
      form.current?.setFieldsValue(scheduleToFormValues());
      setOpen(false);
      dispatchScheduleListRefreshEvent();
    },
  });

  useEffect(() => {
    if (id && open) {
      runGetDetail(id);
    }
  }, [id, open, runGetDetail]);

  useEffect(() => {
    const handleOpen = (e: CustomEvent<ScheduleUpdateModalOpenEventDetail>) => {
      setId(e.detail.id);
      setModifyTime(e.detail.modifyTime);
      setModifyType(e.detail.modifyType);
      setOpen(true);
    };
    window.addEventListener(ScheduleUpdateModalOpenEventName, handleOpen);

    return () => {
      window.removeEventListener(ScheduleUpdateModalOpenEventName, handleOpen);
    };
  }, []);

  const handleOk = () => {
    if (form.current) form.current.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleFormFinish: FormProps<ScheduleFormValues>['onFinish'] = (values) => {
    if (!id) return message.error('参数ID不能为空');
    const schedule = formValuesToSchedule(values);
    runUpdate(id, schedule, modifyType, modifyTime);
  };

  return (
    <Modal
      title="修改日程"
      closable={!(detailLoading || updateLoading)}
      maskClosable={!(detailLoading || updateLoading)}
      open={open}
      okButtonProps={{
        loading: detailLoading || updateLoading,
      }}
      cancelButtonProps={{
        disabled: detailLoading || updateLoading,
      }}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ScheduleForm
        ref={form}
        initialValues={formValues}
        onFinish={handleFormFinish}
        showRepeat={showRepeat}
      />
    </Modal>
  );
};
