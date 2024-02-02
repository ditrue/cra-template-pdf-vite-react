import { forwardRef } from "react";
import { Badge, Checkbox, Form, FormInstance, FormProps, Input, Select } from "antd";
import { calendarConfig } from "@/config";

export type CalendarFormValues = {
  name: string;
  color?: string;
  description?: string;
  default?: boolean;
}

type Props = {
  onFinish: FormProps<CalendarFormValues>['onFinish'];
}

export const CalendarForm = forwardRef<FormInstance<any>, Props>((props, ref) => {
  const { onFinish } = props;
  
  const [form] = Form.useForm();

  const handleFinish: FormProps<any>['onFinish'] = (values) => {
    if (onFinish) onFinish(values);
  };

  return (
    <Form
      ref={ref}
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="名称"
        name="name"
        rules={[
          { required: true, message: '名称不能为空' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="颜色"
        name="color"
        rules={[
          { required: true, message: '颜色不能为空' },
        ]}
      >
        <Select
          options={calendarConfig.colors.map(color => ({
            label: (
              <Badge
                color={color}
                text={color}
              />
            ),
            value: color,
          }))}
        />
      </Form.Item>
      <Form.Item label="描述" name="description">
        <Input.TextArea
          autoSize={{ minRows: 4, maxRows: 4 }}
        />
      </Form.Item>
      <Form.Item name="default" hidden valuePropName="checked">
        <Checkbox>
          设为默认
        </Checkbox>
      </Form.Item>
    </Form>
  );
});
