import { useMemo } from "react";
import { Button, Col, Popconfirm, Row, Tooltip } from "antd";
import { CalendarOutlined, DeleteOutlined, EditOutlined, FolderOpenOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

type Props = {
  data?: API.PROJECT.TIMELINE.ListItem[];
  onFilesManager?: (id: number, name: string) => void;
  onNew?: () => void;
  onEdit?: (id: number) => void;
  onRemove?: (id: number) => void;
}

const ProjectMeetingGroup: React.FC<Props> = (props) => {
  const { data, onFilesManager, onEdit, onRemove } = props;

  const groups = useMemo(() => {
    if (!data) return [];
    const g: Record<string, API.PROJECT.TIMELINE.ListItem[]> = {};
    for (const item of data) {
      const date = dayjs.unix(item.startTime).format('YYYY-MM-DD');
      if (!g[date]) g[date] = [];
      g[date].push(item);
    }
    return Object.keys(g).sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    }).map(date => {
      const list = g[date].sort((a, b) => {
        if (a.startTime > b.startTime) return -1;
        if (a.startTime < b.startTime) return 1;
        return 0;
      }).map(item => ({
        id: item.ID,
        name: item.name,
        startTime: item.startTime,
        endTime: item.endTime,
        description: item.stageDesc,
      }));
      return {
        date,
        list,
      };
    });
  }, [data]);
  
  const handleFilesManager = (id: number, name: string) => {
    onFilesManager?.(id, name);
  };

  const handleEdit = (id: number) => {
    onEdit?.(id);
  };

  const handleRemove = (id: number) => {
    onRemove?.(id);
  };

  return (
    <div>
      {groups.map(group => (
        <div key={group.date} className="mt-6 first:mt-0">
          <div className="flex items-center text-base italic underline">
            <span style={{ color: '#1677ff' }}>
              <CalendarOutlined />
            </span>
            <span className="ml-1">
              {group.date}
            </span>
          </div>
          <Row gutter={[16, 16]} className="mt-4">
            {group.list.map(item => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                <div className="border border-solid border-gray-200 rounded transition-all hover:shadow">
                  <div className="px-3 py-2">
                    <div>
                      {item.name}
                    </div>
                    <div className="mt-1 italic text-gray-400 text-xs">
                      <time>{dayjs.unix(item.startTime).format('HH:mm')}</time>
                      <span> - </span>
                      <time>{dayjs.unix(item.endTime).format('HH:mm')}</time>
                    </div>
                    <div className="mt-1 text-gray-600 text-xs">
                      {item.description}
                    </div>
                  </div>
                  <div className="flex justify-around items-center px-3 py-2 border-0 border-t border-solid border-gray-200">
                    <Tooltip title="信息修改" placement="top">
                      <Button
                        type="text"
                        size="small"
                        shape="round"
                        onClick={() => handleEdit(item.id)}
                      >
                        <EditOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip title="会议文件" placement="top">
                      <Button
                        type="primary"
                        size="small"
                        shape="round"
                        onClick={() => handleFilesManager(item.id, item.name)}
                      >
                        <FolderOpenOutlined />
                      </Button>
                    </Tooltip>
                    <Popconfirm
                      title="确定要删除么？"
                      onConfirm={() => handleRemove(item.id)}
                    >
                      <Button
                        type="text"
                        danger
                        size="small"
                        shape="round"
                      >
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default ProjectMeetingGroup;
