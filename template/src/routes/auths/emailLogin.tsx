import { useNavigate } from "react-router-dom";
import { Button, Form, FormProps, Input } from "antd";
import validator from "validator";
import { useRequest } from "ahooks";
import { formNormalize } from "@/utils";
import { authEmailLogin } from "@/services";

const EmailLogin: React.FC = () => {
  const navigate = useNavigate();

  const { run } = useRequest(authEmailLogin, {
    manual: true,
    debounceWait: 300,
    onSuccess: () => {
      navigate('/');
    },
  });

  const handleFinish: FormProps['onFinish'] = (values) => {
    run(values);
  };

  return (
    <Form
      onFinish={handleFinish}
      layout="vertical"
    >
      <Form.Item
        label="邮箱"
        name="email"
        normalize={formNormalize.nonempty}
        rules={[
          { required: true, message: '邮箱不能为空' },
          { type: 'email', message: '邮箱格式不正确' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item noStyle dependencies={['email']}>
        {({ getFieldValue }) => (
          <Button
            type="primary"
            className="mt-4"
            block
            disabled={!validator.isEmail(getFieldValue('email') || '')}
            htmlType="submit"
          >
            登录
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default EmailLogin;
