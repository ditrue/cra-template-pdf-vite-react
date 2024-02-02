import { DatePicker, Form, FormProps, Input, Modal } from "antd";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { createProjectTimeline, getProjectTimeline, updateProjectTimeline } from "@/services";

type Props = {
  id?: number;
  projectId: number;
  open?: boolean;
  onCancel?: () => void;
  onOk?: (id: number) => void;
};

const TimelineFormModal: React.FC<Props> = (props) => {
  const { id, open, projectId, onCancel, onOk } = props;

  const [form] = Form.useForm();

  const { loading: getLoading } = useRequest(
    async () => {
      if (id && open) return await getProjectTimeline(id);
    },
    {
      debounceWait: 300,
      refreshDeps: [id, open],
      onSuccess: (result) => {
        if (result) {
          form.setFieldsValue({
            name: result.name,
            startTime: result.startTime ? dayjs.unix(result.startTime) : null,
            endTime: result.endTime ? dayjs.unix(result.endTime) : null,
            stageDesc: result.stageDesc,
          });
        } else {
          form.resetFields();
        }
      },
    }
  );

  const { loading: createLoading, run: runCreate } = useRequest(createProjectTimeline, {
    manual: true,
    debounceWait: 300,
    onSuccess: (result) => {
      onOk?.(result.ID);
    },
  });

  const { loading: updateLoading, run: runUpdate } = useRequest(updateProjectTimeline, {
    manual: true,
    debounceWait: 300,
    onSuccess: (_, [id]) => {
      onOk?.(id);
    },
  });

  const handleCancel = () => {
    onCancel?.();
  };

  const handleOk = () => {
    form.submit();
  };
  const handleValuesChange: FormProps<API.PROJECT.TIMELINE.Detail>['onValuesChange'] = (changeValues) => {
    if ('startTime' in changeValues) {
      if (dayjs.isDayjs(changeValues.startTime)) {
        form.setFieldValue('endTime', changeValues.startTime.add(1, 'h'));
      } else {
        form.setFieldValue('endTime', null);
      }
    }
  };

  const handleFinish: FormProps<API.PROJECT.TIMELINE.Detail>['onFinish'] = (values) => {
    if (!projectId) throw new Error('projectId 不能为空');
    const formData = {
      projectID: projectId,
      name: values.name,
      startTime: dayjs.isDayjs(values.startTime) ? values.startTime.unix() : values.startTime,
      endTime: dayjs.isDayjs(values.endTime) ? values.endTime.unix() : values.endTime,
      stageDesc: values.stageDesc,
    };
    id ? runUpdate(id, formData) : runCreate(formData);
  };

  const loading = getLoading || createLoading || updateLoading;

  return (
    <Modal
      title={`${id ? '修改' : '创建'}会议节点`}
      open={open}
      maskClosable={!loading}
      closable={!loading}
      okButtonProps={{
        loading,
      }}
      cancelButtonProps={{
        disabled: loading,
      }}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onValuesChange={handleValuesChange}
        onFinish={handleFinish}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[
            { required: true, message: '名称不能为空' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="会议日期"
          name="startTime"
          rules={[
            { required: true, message: '会议日期不能为空' }
          ]}
          initialValue={dayjs().hour(0).minute(0)}
        >
          <DatePicker
            format="YYYY-MM-DD"
            defaultValue={dayjs().hour(0).minute(0)}
          />
        </Form.Item>
        <Form.Item
          label="结束时间"
          hidden
          name="endTime"
          validateFirst
          initialValue={dayjs().hour(0).minute(0).add(1, 'h')}
          rules={[
            { required: true, message: '结束时间不能为空' },
            ({ getFieldValue }) => ({
              validator: (_: Record<string, any>, value: dayjs.Dayjs) => {
                const withValue: dayjs.Dayjs = getFieldValue('startTime');
                if (!withValue || !value || value.isAfter(withValue)) return Promise.resolve();
                return Promise.reject(new Error('结束时间不能小于会议日期'));
              },
            })
          ]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
          />
        </Form.Item>
        <Form.Item
          label="阶段描述"
          name="stageDesc"
        >
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 4 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TimelineFormModal;
