import { DatePicker, Form, FormProps, Input, Modal } from "antd";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { createProjectStage, getProjectStage, updateProjectStage } from "@/services";

type Props = {
  id?: number;
  projectId: number;
  open?: boolean;
  onCancel?: () => void;
  onOk?: (id: number) => void;
};

const StageFormModal: React.FC<Props> = (props) => {
  const { id, projectId, open, onCancel, onOk } = props;

  const [form] = Form.useForm();

  const { loading: getLoading } = useRequest(
    async () => {
      if (id && open) return await getProjectStage(id);
    },
    {
      debounceWait: 300,
      refreshDeps: [id, open],
      onSuccess: (result) => {
        if (result) {
          form.setFieldsValue({
            name: result.name,
            startTime: result.startTime ? dayjs(result.startTime) : null,
          });
        } else {
          form.resetFields();
        }
      },
    }
  );

  const { loading: createLoading, run: runCreate } = useRequest(createProjectStage, {
    manual: true,
    debounceWait: 300,
    onSuccess: (result) => {
      result?.ID && onOk?.(result.ID);
    },
  });

  const { loading: updateLoading, run: runUpdate } = useRequest(updateProjectStage, {
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

  const handleFinish: FormProps<API.PROJECT.STAGE.ListItem>['onFinish'] = (values) => {
    if (!projectId) throw new Error('projectId 不能为空');
    const formData = {
      name: values.name,
      projectID: projectId,
      startTime: dayjs.isDayjs(values.startTime) ? values.startTime.format('YYYY-MM-DD') : values.startTime,
    };
    id ? runUpdate(id, formData) : runCreate(formData);
  };

  const loading = getLoading || createLoading || updateLoading;

  return (
    <Modal
      title={`${id ? '修改' : '创建'}项目节点`}
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
          label="日期"
          name="startTime"
          rules={[
            { required: true, message: '日期不能为空' }
          ]}
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StageFormModal;
