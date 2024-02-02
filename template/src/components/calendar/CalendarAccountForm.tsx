import { forwardRef } from "react";
import { Form, FormInstance, FormProps, Input } from "antd";

type Props = {
  initialValues?: any;
  onFinish: FormProps['onFinish'];
}

export const CalendarAccountForm = forwardRef<FormInstance<any>, Props>((props, ref) => {
  const { initialValues, onFinish } = props;

  const [form] = Form.useForm();

  const handleFinish: FormProps<any>['onFinish'] = (values) => {
    if (onFinish) onFinish(values);
  };

  return (
    <Form
      ref={ref}
      form={form}
      layout="horizontal"
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      <Form.Item
        label="密码"
        name="password"
        rules={[
          { required: true, message: '公司邮箱密码不能为空' }
        ]}
      >
        <Input.Password
          placeholder="请输入公司邮箱密码"
        />
      </Form.Item>
    </Form>
  );
});
