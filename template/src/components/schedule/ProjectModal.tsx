import { useEffect, useRef, useState } from "react";
import { App, Form, FormInstance, FormProps, Input, Modal, TreeSelect, TreeSelectProps } from "antd";
import { useRequest } from "ahooks";
import { getProjectTimeline, PPMService, updateProjectTimeline, UpdateProjectTimelineParams } from "@/services";
import { ProjectHalSource } from "@/halSources";
import { dispatchScheduleListRefreshEvent, ScheduleProjectModalOpenEventDetail, ScheduleProjectModalOpenEventName } from "./events";

export const ScheduleProjectModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  // 时间线ID
  const [id, setId] = useState<number>();

  // 标题
  const [title, setTitle] = useState<string>();

  const form = useRef<FormInstance<UpdateProjectTimelineParams>>(null);

  const { message } = App.useApp();

  const [projectOptions, setProjectOptions] = useState<TreeSelectProps['treeData']>();

  useRequest(PPMService.getProjects, {
    debounceWait: 300,
    defaultParams: [{
      pageSize: -1,
      offset: 1,
      filters: [
        {
          "active": {"operator":"=","values":["t"]}
        }
      ]
    }],
    onSuccess: (data) => {
      if (data) {
        const gTreeData = (list?: ProjectHalSource[]): TreeSelectProps['treeData'] => {
          if (!list || list.length === 0) return undefined;
          return list.map(item => {
            return {
              label: item.name,
              value: item.id,
              children: gTreeData(item.children),
            };
          });
        };
        setProjectOptions(gTreeData(data.treeList));
      }
    },
  });

  const { loading: detailLoading } = useRequest(
    async () => {
      if (id && open) return await getProjectTimeline(id);
    },
    {
      debounceWait: 300,
      refreshDeps: [id, open],
      onBefore: () => {
        form.current?.resetFields();
      },
      onSuccess: (data) => {
        if (data && data.projectID) {
          form.current?.setFieldsValue({
            projectID: data.projectID,
            stageDesc: data.stageDesc,
          });
        }
      },
    }
  );

  const { run: runUpdate, loading: updateLoading } = useRequest(updateProjectTimeline, {
    manual: true,
    debounceWait: 300,
    onSuccess: () => {
      message.success('更新成功');
      form.current?.resetFields();
      setOpen(false);
      dispatchScheduleListRefreshEvent();
    },
  });

  useEffect(() => {
    const handleOpen = (e: CustomEvent<ScheduleProjectModalOpenEventDetail>) => {
      setId(e.detail.id);
      setTitle(e.detail.title || '绑定项目');
      setOpen(true);
    };
    window.addEventListener(ScheduleProjectModalOpenEventName, handleOpen);

    return () => {
      window.removeEventListener(ScheduleProjectModalOpenEventName, handleOpen);
    };
  }, []);

  const handleOk = () => {
    if (form.current) form.current.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleFormFinish: FormProps<UpdateProjectTimelineParams>['onFinish'] = (values) => {
    if (!id) return message.error('参数ID不能为空');
    runUpdate(id, values);
  };

  return (
    <Modal
      title={title}
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
      <Form
        ref={form}
        className="mt-4"
        layout="vertical"
        onFinish={handleFormFinish}
      >
        <Form.Item label="项目" name="projectID">
          <TreeSelect
            showSearch
            treeData={projectOptions}
            treeDefaultExpandAll
            filterTreeNode
            treeNodeFilterProp="label"
          />
        </Form.Item>
        <Form.Item label="阶段描述" name="stageDesc">
          <Input.TextArea
            autoSize={{ minRows: 5, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
