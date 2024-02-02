import { useEffect, useState } from "react";
import { useRequest } from "ahooks";
import update from 'immutability-helper';
import { getProjectTimeline, getProjectTimelines, removeProjectTimeline } from "@/services";
import { ThSpinWithEmpty, dispatchScheduleFilesModalOpenEvent } from "@/components";
import TimelineFormModal from "./TimelineFormModal";
import ProjectTimeline from "./Timeline";
import ProjectMeetingGroup from "./MeetingGroup";
import { FloatButton, Radio, RadioGroupProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const defaultParams = {
  page: 1,
  pageSize: 50,
};

type Props = {
  projectId?: number;
};

const ProjectMeeting: React.FC<Props> = (props) => {
  const { projectId } = props;

  const [mode, setMode] = useState('timeline');

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
          });
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

  useEffect(() => {
    if (projectId) {
      runGetTimelines({ ...defaultParams, projectID: projectId });
    }
  }, [projectId, runGetTimelines]);

  const handleNew = () => {
    setTimelineId(undefined);
    setTimelineOpen(true);
  };

  const handleFilesManager = (id: number, name: string) => {
    dispatchScheduleFilesModalOpenEvent({
      id,
      title: `会议文件 - ${name}`,
    });
  };

  const handleEdit = (id: number) => {
    setTimelineId(id);
    setTimelineOpen(true);
  };

  const handleRemove = (id: number) => {
    runRemoveTimeline(id);
  };

  const onModalCancel = () => {
    setTimelineId(undefined);
    setTimelineOpen(false);
  };

  const onModalOk = (id: number) => {
    runGetTimeline(id);
  };

  const handleModeChange: RadioGroupProps['onChange'] = (e) => {
    setMode(e.target.value);
  };

  const loading = timelineLoading || removeTimelineLoading || getTimelineLoading;

  return (
    <div style={{ minHeight: 520 }}>
      <div className="mb-8 text-center">
        <Radio.Group value={mode} onChange={handleModeChange}>
          <Radio.Button value="timeline">时间轴</Radio.Button>
          <Radio.Button value="list">列表</Radio.Button>
        </Radio.Group>
      </div>
      <ThSpinWithEmpty
        loading={loading}
        active={timelines.length > 0}
        empty={{
          description: (
            <div className="text-black text-opacity-25 mt-4">
              {loading ? '数据加载中' : '暂无数据'}
            </div>
          )
        }}
      >
        {mode === 'timeline' && (
          <ProjectTimeline
            data={timelines}
            onFilesManager={handleFilesManager}
            onNew={handleNew}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        )}
        {mode === 'list' && (
          <ProjectMeetingGroup
            data={timelines}
            onFilesManager={handleFilesManager}
            onNew={handleNew}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        )}
      </ThSpinWithEmpty>
      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        tooltip="添加会议节点"
        style={{ bottom: 240, right: 96 }}
        onClick={() => handleNew()}
      />
      {projectId && (
        <TimelineFormModal
          id={timelineId}
          projectId={projectId}
          open={timelineOpen}
          onCancel={onModalCancel}
          onOk={onModalOk}
        />
      )}
    </div>
  );
};

export default ProjectMeeting;
