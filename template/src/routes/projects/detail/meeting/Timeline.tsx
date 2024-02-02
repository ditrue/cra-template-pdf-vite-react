import { memo, useMemo } from "react";
import { Button, Popconfirm, Timeline, Tooltip } from "antd";
import { CalendarOutlined, CloseOutlined, EditOutlined, FolderOpenOutlined, PlusSquareFilled } from "@ant-design/icons";
import dayjs from "dayjs";

type Props = {
  data?: API.PROJECT.TIMELINE.ListItem[];
  onFilesManager?: (id: number, name: string) => void;
  onNew?: () => void;
  onEdit?: (id: number) => void;
  onRemove?: (id: number) => void;
}

const ProjectTimeline: React.FC<Props> = memo((props) => {
  const { data, onNew, onFilesManager, onEdit, onRemove } = props;

  const timelineData = useMemo(() => {
    if (!data) return [];
    const g: Record<string, API.PROJECT.TIMELINE.ListItem[]> = {};
    for (const item of data) {
      const date = dayjs.unix(item.startTime).format('YYYY-MM-DD');
      if (!g[date]) g[date] = [];
      g[date].push(item);
    }
    type DateTimeline = {
      type: 'date',
      date: string;
    };
    type MeetingTimeline = {
      type: 'meeting',
      id: number;
      name: string;
      startTime: number;
      endTime: number;
      description?: string;
    };
    const result: (DateTimeline | MeetingTimeline)[] = [];
    Object.keys(g).sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    }).forEach(date => {
      result.push({
        type: 'date',
        date,
      });
      g[date].sort((a, b) => {
        if (a.startTime > b.startTime) return 1;
        if (a.startTime < b.startTime) return -1;
        return 0;
      }).forEach(meeting => {
        result.push({
          type: 'meeting',
          id: meeting.ID,
          name: meeting.name,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          description: meeting.stageDesc,
        });
      });
    });
    return result;
  }, [data]);

  const handleFilesManager = (id: number, name: string) => {
    onFilesManager?.(id, name);
  };

  const handleNew = () => {
    onNew?.();
  };
  
  const handleEdit = (id: number) => {
    onEdit?.(id);
  };

  const handleRemove = (id: number) => {
    onRemove?.(id);
  };

  return (
    <div>
      <Timeline
        mode="left"
        pending={(
          <Button
            size="small"
            type="primary"
            shape="round"
            onClick={handleNew}
          >
            添加节点
          </Button>
        )}
        pendingDot={(
          <PlusSquareFilled />
        )}
        items={timelineData.map(item => {
          if (item.type === 'date') {
            return {
              dot: (<CalendarOutlined />),
              color: '#1677ff',
              label: (
                <span className="italic underline">
                  {item.date}
                </span>
              ),
              children: dayjs.weekdaysShort()[dayjs(item.date, 'YYYY-MM-DD').day()],
            };
          }
          return {
            color: 'green',
            label: (
              <span className="text-gray-400 italic">
                {dayjs.unix(item.startTime).format('HH:mm')}
              </span>
            ),
            children: (
              <div className="flex group">
                <div
                  className="px-4 py-2 w-44 rounded border border-solid border-gray-300 transition-all hover:shadow"
                  style={{ minHeight: 76 }}
                >
                  <div>
                    {item.name}
                  </div>
                  <div className="mt-1 text-xs text-gray-400 italic">
                    {dayjs.unix(item.startTime).format('HH:mm')} - {dayjs.unix(item.endTime).format('HH:mm')}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">{item.description}</div>
                </div>
                <div className="w-8 flex flex-col justify-between items-center">
                  <Tooltip title="信息修改" placement="right">
                    <Button
                      className="transition-all opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0"
                      type="text"
                      size="small"
                      shape="circle"
                      onClick={() => handleEdit(item.id)}
                    >
                      <EditOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip title="会议文件" placement="right">
                    <Button
                      className="transition-all delay-75 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0"
                      type="primary"
                      size="small"
                      shape="circle"
                      onClick={() => handleFilesManager(item.id, item.name)}
                    >
                      <FolderOpenOutlined />
                    </Button>
                  </Tooltip>
                  <Popconfirm
                    title="确定要删除么？"
                    onConfirm={() => handleRemove(item.id)}
                  >
                    <Tooltip title="删除" placement="right">
                      <Button
                        className="transition-all delay-150 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0"
                        type="text"
                        size="small"
                        shape="circle"
                        danger
                      >
                        <CloseOutlined />
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                </div>
              </div>
            ),
          }
        })}
      />
    </div>
  );
});

export default ProjectTimeline;
