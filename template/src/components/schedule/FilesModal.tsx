import { useEffect, useState } from "react";
import {
  App,
  Button,
  Modal,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { UploadRequestOption } from "rc-upload/lib/interface";
import {
  createScheduleFile,
  getScheduleFiles,
  removeScheduleFile,
  uploadFile,
} from "@/services";
import {
  ScheduleFilesModalOpenEventDetail,
  ScheduleFilesModalOpenEventName,
} from "./events";

const defaultParams = {
  page: 1,
  pageSize: 10,
};

export const ScheduleFilesModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  // 时间线ID
  const [id, setId] = useState<number>();

  // 日程主题
  const [title, setTitle] = useState<string>();

  const [createList, setCreateList] = useState<UploadFile<API.FILE.File>[]>([]);

  const { message } = App.useApp();

  const {
    data: fileData,
    run: runGetFiles,
    loading: listLoading,
    refresh,
    params: [searchParams = { ...defaultParams }],
  } = useRequest(getScheduleFiles, {
    manual: true,
    debounceWait: 300,
    defaultParams: [{ ...defaultParams }],
    onSuccess: (result, [params]) => {
      if (result) {
        if (
          params.page &&
          params.page > 1 &&
          result.list.length === 0 &&
          result.total > 0
        ) {
          runGetFiles({ ...params, page: params.page - 1 });
        }
      }
    },
  });

  const { run: runCreate, loading: createLoading } = useRequest(
    createScheduleFile,
    {
      manual: true,
      debounceWait: 300,
      onSuccess: () => {
        message.success("创建成功");
        refresh();
      },
    }
  );

  const { run: runRemove, loading: removeLoading } = useRequest(
    removeScheduleFile,
    {
      manual: true,
      debounceWait: 300,
      onSuccess: () => {
        message.success("删除成功");
        refresh();
      },
    }
  );

  useEffect(() => {
    if (id && open) {
      setCreateList([]);
      runGetFiles({ timelineID: id });
    }
  }, [id, open, runGetFiles]);

  useEffect(() => {
    const handleOpen = (e: CustomEvent<ScheduleFilesModalOpenEventDetail>) => {
      setId(e.detail.id);
      setTitle(e.detail.title || "会议文件");
      setOpen(true);
    };

    window.addEventListener(ScheduleFilesModalOpenEventName, handleOpen);

    return () => {
      window.removeEventListener(ScheduleFilesModalOpenEventName, handleOpen);
    };
  }, []);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleUploadChange: UploadProps<API.FILE.File>["onChange"] = ({
    file,
    fileList,
  }) => {
    setCreateList(fileList);
    if (file.status === "done") {
      if (id && file.response) {
        const nameSplit = file.name.split(".");
        nameSplit.pop();
        runCreate({
          timelineID: id,
          fileID: file.response.ID,
          fileName: nameSplit.join("."),
        });
      }
    }
  };

  const handleUploadRequest = async (
    options: UploadRequestOption<API.FILE.File>
  ) => {
    const { file, onError, onSuccess, onProgress } = options;

    onProgress?.({ percent: 0 });

    try {
      const result = await uploadFile(file as File);
      onSuccess?.(result.file);
    } catch (err: any) {
      onError?.(err);
    }
  };

  const handleTableChange: TableProps<API.SCHEDULE.File>["onChange"] = ({
    current,
    pageSize,
  }) => {
    runGetFiles({ ...searchParams, page: current, pageSize });
  };

  const tableColumns: TableProps<any>["columns"] = [
    {
      key: "fileName",
      dataIndex: "fileName",
      title: "文件名",
      align: "center",
      width: 400,
    },
    {
      key: "tag",
      dataIndex: "tag",
      title: "类型",
      align: "center",
      width: 160,
      render: (text) => text || "未知",
    },
    {
      key: "user",
      dataIndex: "user",
      title: "上传人",
      align: "center",
      width: 120,
      render: (user) => user?.chineseName,
    },
    {
      key: "action",
      title: "操作",
      width: 120,
      align: "center",
      render: (record) => {
        if (record.permissions) {
          return (
            <Space>
              {record.permissions.includes("remove") && (
                <Popconfirm
                  title="确定要删除么？"
                  onConfirm={() => id && runRemove(record.ID)}
                  disabled={removeLoading}
                >
                  <Button type="link" danger loading={removeLoading}>
                    删除
                  </Button>
                </Popconfirm>
              )}
            </Space>
          );
        }
        return null;
      },
    },
  ];

  return (
    <Modal
      title={title}
      closable={!(listLoading || createLoading || removeLoading)}
      maskClosable={!(listLoading || createLoading || removeLoading)}
      open={open}
      footer={null}
      width={1000}
      onCancel={handleCancel}
    >
      <Table
        loading={listLoading}
        tableLayout="fixed"
        className="mt-4"
        rowKey="ID"
        dataSource={fileData?.list}
        pagination={{
          total: fileData?.total,
          current: searchParams.page,
          pageSize: searchParams.pageSize,
        }}
        columns={tableColumns}
        scroll={{ x: 800, y: 480 }}
        footer={() => (
          <Upload.Dragger
            className="w-full"
            onChange={handleUploadChange}
            customRequest={handleUploadRequest}
            fileList={createList}
          >
            <Space>
              <FileAddOutlined />
              <span>新增</span>
            </Space>
          </Upload.Dragger>
        )}
        onChange={handleTableChange}
      />
    </Modal>
  );
};
