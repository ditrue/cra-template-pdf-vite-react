import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spin, Breadcrumb, Card, Form, Select, Input, Button, FormProps, SelectProps, App } from "antd";
import { useRequest } from "ahooks";
import { PPMService, getProjects } from "@/services";
import { documentUtil, ithOpenUrl } from "@/utils";
import { projectConfig } from "@/config";

const ProjectNew: React.FC = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { modal } = App.useApp();

  const { data, run } = useRequest(getProjects, {
    manual: true,
    debounceWait: 300,
  });

  const { run: copyProject } = useRequest(PPMService.copyProject, {
    manual: true,
    debounceWait: 300,
    onSuccess: (jobId) => {
      getJobStatus(jobId);
    },
    onError: () => {
      setLoading(false);
    },
    onBefore: () => {
      setLoading(true);
    },
  });

  const { run: getJobStatus, cancel: cancelGetJobStatus } = useRequest(PPMService.getCopyProjectStatus, {
    manual: true,
    debounceWait: 300,
    pollingInterval: 3000,
    pollingErrorRetryCount: 3,
    onSuccess: (res) => {
      if (res.success) {
        cancelGetJobStatus();
        setLoading(false);
        modal.confirm({
          title: '创建完成',
          okText: '前往项目空间',
          cancelText: '返回列表',
          onOk: () => {
            if (!res.redirect) return;
            ithOpenUrl(res.redirect);
          },
          onCancel: () => {
            navigate('/projects');
          },
          maskClosable: false,
          closable: false,
        });
      }
    },
  });

  
  const { run: runSubmit } = useRequest(
    async (params: PPMService.CopyProjectParams) => {
      if (params.projectCode) {
        const res = await PPMService.getProjectProfileByCode(params.projectCode);
        if (res.projectId) return res.projectId;
      }
      return true;
    },
    {
      manual: true,
      debounceWait: 300,
      onBefore: () => {
        setLoading(true);
      },
      onError: () => {
        setLoading(false);
      },
      onSuccess: (res, [params]) => {
        if (res !== true) {
          setLoading(false);
          modal.confirm({
            title: (<div>项目号: {params.projectCode} 的空间已存在</div>),
            okText: '前往项目空间',
            cancelText: '取消',
            onOk: () => {
              const url = documentUtil.getPpmProjectPath(res);
              ithOpenUrl(url);
            },
          });
          return;
        } else {
          modal.confirm({
            title: '确定要创建项目空间么？',
            onOk: () => {
              copyProject(params);
            },
          });
        }
      },
    },
  );

  useEffect(() => {
    run({});
  }, [run]);

  const projectOptions = useMemo(() => {
    const options = [
      { label: '临时项目，没有项目号', value: 'none' },
    ];
    data?.list.forEach(item => {
      options.push({ label: `${item.projectCode} - ${item.projectName}`, value: item.projectCode });
    });
    return options;
  }, [data]);

  const handleValuesChange: FormProps['onValuesChange'] = (changeValues) => {
    const keys = Object.keys(changeValues);
    if (keys.includes('projectCode')) {
      const projectCode = changeValues['projectCode'];
      if (projectCode === 'none') {
        form.setFieldValue('projectName', '');
        form.setFieldValue('docLink', '');
      } else {
        const projectOption = data?.list.find(item => item.projectCode === projectCode);
        form.setFieldValue('projectName', projectOption?.projectName || '');
        form.setFieldValue('docLink', projectOption?.workspaceID ? documentUtil.getEdocPathById(projectOption?.workspaceID) : '');
      }
    }
  };

  const handleProjectSearch: SelectProps['onSearch'] = (keywords) => {
    if (!keywords) return;
    run({ keywords });
  };

  const handleFormFinish: FormProps<PPMService.CopyProjectParams>['onFinish'] = (values) => {
    const projectCode = values.projectCode === 'none' ? undefined : values.projectCode;
    runSubmit({ ...values, projectCode });
  };

  return (
    <Spin spinning={loading} tip="正在创建中，请稍后...">
      <div className="mx-auto w-[1000px]">
        <Breadcrumb
          items={[
            {
              key: 'list',
              title: (<Link to="/projects">项目</Link>),
            },
            {
              key: 'new',
              title: '创建项目空间',
            },
          ]}
        />
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          onFinish={handleFormFinish}
        >
          <Card
            title="基本信息"
            className="mt-4"
          >
            <Form.Item
              label="项目类型选择"
              name="projectTypeId"
              rules={[
                { required: true, message: '项目类型不能为空' }
              ]}
              initialValue={1}
            >
              <Select
                placeholder="请选择项目类型"
                options={projectConfig.types.map(item => ({
                  label: item.title,
                  value: item.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="选择项目号"
              name="projectCode"
              rules={[
                { required: true, message: '项目号不能为空' }
              ]}
            >
              <Select
                placeholder="请选择项目号"
                options={projectOptions}
                showSearch
                filterOption={false}
                onSearch={handleProjectSearch}
              />
            </Form.Item>
            <Form.Item noStyle dependencies={['projectCode']}>
              {({ getFieldValue }) => (
                <Form.Item
                  label="项目名称"
                  name="projectName"
                  rules={[
                    { required: true, message: '项目名称不能为空' },
                  ]}
                >
                  <Input
                    placeholder="请输入项目名称"
                    disabled={getFieldValue('projectCode') !== 'none'}
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item label="文档管理" name="docLink">
              <Input placeholder="输入文档链接" />
            </Form.Item>
          </Card>
          <div className="mt-4">
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              提交
            </Button>
          </div>
        </Form>
      </div>
    </Spin>
  );
};

export default ProjectNew;
