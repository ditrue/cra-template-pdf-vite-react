import { useNavigate } from "react-router-dom";
import { Button, Form, FormProps, Input } from "antd";
import validator from "validator";
import { useRequest } from "ahooks";
import { formNormalize } from "@/utils";
import { authJwtLogin } from "@/services";

const JwtLogin: React.FC = () => {
  const navigate = useNavigate();

  const { run } = useRequest(authJwtLogin, {
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
        label="JWT"
        name="ithJwt"
        normalize={formNormalize.nonempty}
        rules={[
          { required: true, message: 'JWT不能为空' },
        ]}
      >
        <Input.TextArea
          autoSize={{ minRows: 5, maxRows: 5 }}
        />
      </Form.Item>
      <Form.Item noStyle dependencies={['ithJwt']}>
        {({ getFieldValue }) => (
          <Button
            type="primary"
            className="mt-4"
            block
            disabled={!validator.isJWT(getFieldValue('ithJwt') || '')}
            htmlType="submit"
          >
            登录
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default JwtLogin;
