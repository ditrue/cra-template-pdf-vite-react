import { useEffect, useMemo, useRef, useState } from "react";
import { App, AutoComplete, AutoCompleteProps, Form, FormInstance, FormProps, Input, Modal, Select } from "antd";
import { useRequest } from "ahooks";
import { PPMService, getProjects } from "@/services";
import { projectConfig } from "@/config";
import { PpmProjectUpdateModalOpenEventDetail, PpmProjectUpdateModalOpenEventName, dispatchPpmProjectListRefreshEvent } from "./events";

export const PpmProjectUpdateModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  const [id, setId] = useState<number>();

  const [fields, setFields] = useState<string[]>();

  const form = useRef<FormInstance<any>>(null);

  const { message } = App.useApp();

  const { data: projects, run: runGetProjects } = useRequest(getProjects, {
    manual: true,
    debounceWait: 300,
  });

  const { loading: detailLoading, run: runGetDetail } = useRequest(PPMService.getProject, {
    manual: true,
    debounceWait: 300,
    onSuccess: (data) => {
      if (!data || !form.current) return message.error('未正确获取到项目信息');
      form.current.setFieldsValue({
        typeId: data.profile?.typeId,
        code: data.profile?.code,
        name: data.profile?.name,
        docLink: data.profile?.docLink,
      });
    },
    onError: () => {
      message.error('获取项目信息错误');
    },
  });

  const { run: runUpdate, loading: updateLoading } = useRequest(PPMService.updateProject, {
    manual: true,
    debounceWait: 300,
    onSuccess: () => {
      message.success('更新成功');
      form.current?.setFieldsValue({});
      setOpen(false);
      dispatchPpmProjectListRefreshEvent();
    },
  });

  const projectOptions = useMemo(() => {
    const options: AutoCompleteProps['options'] = [];
    projects?.list.forEach(item => {
      options.push({ label: `${item.projectCode} - ${item.projectName}`, value: item.projectCode });
    });
    return options;
  }, [projects]);

  useEffect(() => {
    if (id && open) {
      runGetDetail(id);
      runGetProjects({});
    }
  }, [id, open, runGetDetail, runGetProjects]);

  useEffect(() => {
    const handleOpen = (e: CustomEvent<PpmProjectUpdateModalOpenEventDetail>) => {
      const { id, fields } = e.detail;
      setId(id);
      setFields(fields);
      setOpen(true);
    };
    window.addEventListener(PpmProjectUpdateModalOpenEventName, handleOpen);

    return () => {
      window.removeEventListener(PpmProjectUpdateModalOpenEventName, handleOpen);
    };
  }, []);

  const handleFormFinish: FormProps['onFinish'] = (values) => {
    if (!id) return message.error('id不能为空');
    runUpdate(id, { profile: values });
  };

  const handleProjectSearch: AutoCompleteProps['onSearch'] = (keywords) => {
    if (!keywords) return;
    runGetProjects({ keywords });
  };

  const handleProjectSelect: AutoCompleteProps['onSelect'] = (_, option) => {
    if (!option.label || !form.current) return;
    const name = option.label.toString().replace(/^\w+\s-\s/, '');
    form.current.setFieldValue('name', name);
  };

  const handleOk = () => {
    if (form.current) form.current.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const loading = detailLoading || updateLoading;

  return (
    <Modal
      title="修改项目信息"
      closable={!(loading)}
      maskClosable={!(loading)}
      open={open}
      okButtonProps={{
        loading: loading,
      }}
      cancelButtonProps={{
        disabled: loading,
      }}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        ref={form}
        className="mt-4"
        layout="vertical"
        onFinish={handleFormFinish}
      >
        {(!fields || fields.includes('typeId')) && (
          <Form.Item
            label="天华项目类型"
            name="typeId"
          >
            <Select
              placeholder="请选择天华项目类型"
              options={projectConfig.types.map(item => ({
                label: item.title,
                value: item.id,
              }))}
            />
          </Form.Item>
        )}
        {(!fields || fields.includes('code')) && (
          <Form.Item
            label="天华项目编号"
            name="code"
          >
            <AutoComplete
              placeholder="请输入天华项目编号"
              options={projectOptions}
              onSearch={handleProjectSearch}
              onSelect={handleProjectSelect}
            />
          </Form.Item>
        )}
        {(!fields || fields.includes('name')) && (
          <Form.Item
            label="天华项目名称"
            name="name"
          >
            <Input disabled />
          </Form.Item>
        )}
        {(!fields || fields.includes('docLink')) && (
          <Form.Item label="天华文档管理" name="docLink">
            <Input placeholder="输入天华文档链接" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
