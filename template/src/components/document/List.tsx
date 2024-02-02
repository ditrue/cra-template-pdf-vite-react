import { useEffect, useState } from "react";
import { Card, Table, TableProps } from "antd";
import { FileOutlined, FolderOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { getDocuments } from "@/services";

const defaultParams = {
  page: 1,
  pageSize: 50,
};

type Props = {
  folderId?: number;
  folderTitle?: string;
};

export const DocumentList: React.FC<Props> = (props) => {
  const { folderId, folderTitle } = props;

  const [currentFolderId, setCurrentFolderId] = useState<number>();
  const [currentFolderTitle, setCurrentFolderTitle] = useState<string>();

  useEffect(() => {
    setCurrentFolderId(folderId);
  }, [folderId]);

  useEffect(() => {
    setCurrentFolderTitle(folderTitle);
  }, [folderTitle]);

  const { data, loading, run: runGetDocuments, params: [_, searchParams = { ...defaultParams }] } = useRequest(getDocuments, {
    manual: true,
    debounceWait: 300,
  });

  useEffect(() => {
    if (currentFolderId) {
      runGetDocuments(currentFolderId, { ...defaultParams, page: 1 });
    }
  }, [currentFolderId, runGetDocuments]);

  const handleClick = (record: API.DOCUMENT.ListItem) => {
    if (!record.isFile) {
      setCurrentFolderId(record.ID);
      setCurrentFolderTitle(record.name);
    }
  };

  const tableColumns: TableProps<API.DOCUMENT.ListItem>['columns'] = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '名称',
      width: 256,
      render: (text, record) => {
        return (
          <div className="truncate cursor-pointer" onClick={() => handleClick(record)}>
            {record.isFile ? (
              <FileOutlined />
            ) : (
              <FolderOutlined />
            )}
            <span className="truncate ml-1">
              {text}
            </span>
          </div>
        );
      },
    },
    {
      key: 'format',
      dataIndex: 'format',
      title: '文件格式',
      width: 100,
    },
    {
      key: 'creator',
      dataIndex: 'creator',
      title: '创建人',
      width: 100,
    },
    {
      key: 'updated_at',
      dataIndex: 'updated_at',
      title: '修改时间',
      width: 160,
    }
  ];

  return (
    <Card
      bordered={false}
      title={currentFolderTitle || '未知'}
      size="small"
      style={{ boxShadow: 'none' }}
      bodyStyle={{ padding: 0 }}
    >
      <Table
        loading={loading}
        tableLayout="fixed"
        rowKey="ID"
        columns={tableColumns}
        dataSource={data?.list}
        scroll={{ x: 800, y: 600 }}
        pagination={{
          current: searchParams.page,
          pageSize: searchParams.pageSize,
          total: data?.total,
        }}
      />
    </Card>
  );
};
