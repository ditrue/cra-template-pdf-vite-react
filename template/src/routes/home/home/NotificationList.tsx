import { Button, Card, Table, TableProps, Tooltip } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { sourceConfigs } from "@/config";
import { NotificationState } from "./Notification";
import { useRequest } from "ahooks";
import { getNotifications } from "@/services/apis";

const defaultParams = {
  page: 1,
  pageSize: 10,
};

type Props = {
  onModeChange?: (mode: NotificationState['mode']) => void;
}

const NotificationList: React.FC<Props> = (props) => {
  const { onModeChange } = props;

  const { data, loading, params: [searchParams = { ...defaultParams }], run: runGet } = useRequest(getNotifications, {
    cacheKey: 'Notifications',
    debounceWait: 300,
    defaultParams: [{ ...defaultParams }],
    onSuccess: (result, [params]) => {
      if (params.page && params.page > 1 && result.total > 0 && result.list.length === 0) {
        runGet({ ...params, page: params.page - 1 });
      }
    },
  });

  const handleModeChange = () => {
    if (onModeChange) onModeChange('calendar');
  };

  const handleTableChange: TableProps<API.NOTIFICATION.ListItem>['onChange'] = ({ current, pageSize }, filters) => {
    runGet({ ...searchParams, page: current, pageSize, source: filters.source ? filters.source.toString() : undefined });
  };

  const tableColumns: TableProps<API.NOTIFICATION.ListItem>['columns'] = [
    {
      key: 'title',
      dataIndex: 'title',
      title: '标题',
      width: 240,
    },
    {
      key: 'user',
      dataIndex: 'user',
      title: '创建人',
      width: 120,
      render: text => text?.chineseName,
    },
    {
      key: 'source',
      dataIndex: 'source',
      title: '来源',
      filters: sourceConfigs.map(item => ({ text: item.title, value: item.name })),
      width: 120,
    },
    {
      key: 'endTime',
      dataIndex: 'endTime',
      title: '预计结束',
      width: 160,
    },
  ];

  return (
    <Card
      title="通知"
      extra={(
        <Tooltip title="查看完整日历">
          <Button type="link" className="text-2xl p-0" onClick={handleModeChange}>
            <CalendarOutlined />
          </Button>
        </Tooltip>
      )}
    >
      <Table
        loading={loading}
        tableLayout="fixed"
        rowKey="ID"
        dataSource={data?.list}
        columns={tableColumns}
        pagination={{
          total: data?.total,
          current: searchParams.page,
          pageSize: searchParams.pageSize,
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default NotificationList;
