import { memo, useEffect, useMemo, useState } from "react";
import { Button, FloatButton, Popconfirm, Timeline } from "antd";
import { CloseOutlined, EditOutlined, PlusOutlined, ScheduleOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import update from 'immutability-helper';
import classNames from "classnames";
import { getProjectTimeline, getProjectTimelines, removeProjectTimeline } from "@/services";
import { ThSpinWithEmpty } from "@/components";
import TimelineFormModal from "./TimelineFormModal";

const defaultParams = {
  page: 1,
  pageSize: 50,
};

type Props = {
  projectId?: number;
}

const ProjectTimeline: React.FC<Props> = memo((props) => {
  const { projectId } = props;

  const [timelines, setTimelines] = useState<API.PROJECT.TIMELINE.ListItem[]>([]);

  const [timelineOpen, setTimelineOpen] = useState(false);

  const [timelineId, setTimelineId] = useState<number>();

  const { loading: timelineLoading, run: runGetTimelines } = useRequest(getProjectTimelines, {
    manual: true,
    debounceWait: 300,
    refreshDeps: [projectId],
    defaultParams: [{ ...defaultParams }],
    onSuccess: (result, [params]) => {
      if (result) {
        setTimelines((list) => {
          const newList = (!params.page || params.page === 1) ? [...result.list] : update(list, {
            $push: result.list,
          });
          if (result.total > newList.length) {
            runGetTimelines({ ...params, page: (params.page || 1) + 1 });
          }
          return newList;
        });
      }
    },
  });

  const { loading: getTimelineLoading, run: runGetTimeline } = useRequest(getProjectTimeline, {
    manual: true,
    debounceWait: 300,
    onSuccess: (result) => {
      setTimelines((list) => {
        const index = list.findIndex(item => item.ID === result.ID);
        if (index > -1) {
          return update(list, {
            [index]: {
              $merge: result,
            }
          })
        } else {
          return update(list, {
            $push: [result],
          });
        }
      });
      setTimelineOpen(false);
    },
  });

  const { loading: removeTimelineLoading, run: runRemoveTimeline } = useRequest(removeProjectTimeline, {
    manual: true,
    debounceWait: 300,
    onSuccess: (_, [id]) => {
      setTimelines((list) => {
        const index = list.findIndex(item => item.ID === id);        
        const newList = update(list, {
          $splice: [[index, 1]],
        });
        return newList;
      });
    },
  });

  const timelineData = useMemo(() => {
    const meetings = timelines.map(item => {
      const time = dayjs.unix(item.startTime);
      return {
        ID: item.ID,
        type: 'timeline',
        position: 'left',
        title: item.name,
        time: item.startTime,
        description: `${time.format('YYYY/MM/DD')}`,
      };
    });
    return meetings.sort((a, b) => {
      if (a.time > b.time) return 1;
      if (a.time < b.time) return -1;
      return 0;
    });
  }, [timelines]);

  useEffect(() => {
    if (projectId) {
      runGetTimelines({ ...defaultParams, projectID: projectId });
    }
  }, [projectId, runGetTimelines]);

  const handleRemove = (type: string, id: number) => {
    if (type === 'timeline') {
      runRemoveTimeline(id);
    }
  };

  const openEditFormModal = (type: string, id: number) => {
    if (type === 'timeline') {
      openTimelineFormModal(id);
    }
  };

  const openTimelineFormModal = (id?: number) => {
    setTimelineId(id);
    setTimelineOpen(true);
  };

  const closeTimelineFormModal = () => {
    setTimelineId(undefined);
    setTimelineOpen(false);
  };

  const onTimelineFormOk = (id: number) => {
    runGetTimeline(id);
  };

  const loading = timelineLoading || removeTimelineLoading || getTimelineLoading;

  return (
    <div>
      <ThSpinWithEmpty
        loading={loading}
        active={timelineData.length > 0}
        empty={{
          description: (
            <div className="text-black text-opacity-25 mt-4">
              {loading ? '数据加载中' : '暂无数据'}
            </div>
          )
        }}
      >
        <Timeline
          mode="alternate"
          items={timelineData.map(item => ({
            position: item.position,
            children: (
              <div
                className="bg-gray-200 p-4 inline-block w-48 rounded-xl relative ring-opacity-10 hover:ring-opacity-100"
                style={{ minHeight: 76 }}
              >
                <div>{item.title}</div>
                <div>{item.description}</div>
                <Popconfirm
                  title="确定要删除么？"
                  onConfirm={() => handleRemove(item.type, item.ID)}
                >
                  <Button
                    className={classNames('absolute top-1', { 'right-1': item.position === 'left', 'left-1': item.position === 'right' })}
                    style={{ opacity: 'var(--tw-ring-opacity)' }}
                    type="text"
                    size="small"
                    shape="circle"
                    title="删除"
                  >
                    <CloseOutlined />
                  </Button>
                </Popconfirm>
                <Button
                  className={classNames('absolute bottom-1', { 'right-1': item.position === 'left', 'left-1': item.position === 'right'  })}
                  style={{ opacity: 'var(--tw-ring-opacity)' }}
                  type="link"
                  size="small"
                  shape="circle"
                  title="修改"
                  onClick={() => openEditFormModal(item.type, item.ID)}
                >
                  <EditOutlined />
                </Button>
              </div>
            ),
          }))}
        />
      </ThSpinWithEmpty>
      {projectId && (
        <FloatButton.Group
          trigger="click"
          shape="circle"
          type="primary"
          icon={<PlusOutlined />}
          style={{ bottom: 200, right: 96 }}
        >
          <FloatButton
            icon={<ScheduleOutlined />}
            tooltip="添加会议节点（右）"
            onClick={() => openTimelineFormModal()}
          />
        </FloatButton.Group>
      )}
      {projectId && (
        <TimelineFormModal
          id={timelineId}
          projectId={projectId}
          open={timelineOpen}
          onCancel={closeTimelineFormModal}
          onOk={onTimelineFormOk}
        />
      )}
    </div>
  );
});

export default ProjectTimeline;
