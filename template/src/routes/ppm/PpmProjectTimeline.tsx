import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { Empty, Spin, Timeline } from "antd";
import { getProjectStagesTimelines } from "@/services/ppm";

const PpmProjectTimeline: React.FC = () => {
  const { code: projectCode } = useParams();

  const [stages, setStages] = useState<API.PROJECT.STAGE.ListItem[]>([]);
  const [timelines, setTimelines] = useState<API.PROJECT.TIMELINE.ListItem[]>([]);

  const [empty, setEmpty] = useState(false);

  const { loading, run } = useRequest(getProjectStagesTimelines, {
    manual: true,
    debounceWait: 300,
    onSuccess: (result) => {
      if (result) {
        setStages(result.stages);
        setTimelines(result.timelines);
        if (result.stages.length === 0 && result.timelines.length === 0) {
          setEmpty(true);
        }
      }
    },
  });

  const timelineData = useMemo(() => {
    const bigStages = stages.map(item => {
      const time = dayjs(item.startTime, 'YYYY-MM-DD');
      return {
        ID: item.ID,
        type: 'stage',
        position: 'right',
        title: item.name,
        time: time.unix(),
        description: `${time.format('YYYY/MM/DD')}`,
      };
    });
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
    return [...bigStages, ...meetings].sort((a, b) => {
      if (a.time > b.time) return 1;
      if (a.time < b.time) return -1;
      return 0;
    });
  }, [stages, timelines]);

  useEffect(() => {
    if (projectCode) {
      run(projectCode);
    }
  }, [projectCode, run]);

  return (
    <Spin spinning={loading}>
      <div className="min-h-screen flex justify-center py-4">
        {!empty && (
          <Timeline
            mode="alternate"
            style={{ width: 600 }}
            items={timelineData.map(item => ({
              position: item.position,
              children: (
                <div
                  className="bg-gray-200 p-4 inline-block w-48 rounded-xl relative ring-opacity-10 hover:ring-opacity-100"
                  style={{ minHeight: 76 }}
                >
                  <div>{item.title}</div>
                  <div>{item.description}</div>
                </div>
              ),
            }))}
          />
        )}
        {empty && (
          <div className="m-auto">
            <Empty
              image={Empty.PRESENTED_IMAGE_DEFAULT}
            />
          </div>
        )}
      </div>
    </Spin>
  );
};

export default PpmProjectTimeline;
