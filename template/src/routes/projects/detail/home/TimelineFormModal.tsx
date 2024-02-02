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
          label="开始日期"
          name="startTime"
          rules={[
            { required: true, message: '开始日期不能为空' }
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="结束日期"
          name="endTime"
        >
          <DatePicker />
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
