import { useEffect } from "react";
import { Link, Navigate, generatePath, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Card, Spin, Tabs, TabsProps } from "antd";
import { useRequest } from "ahooks";
import { PPMService } from "@/services";
import { PpmProjectListRefreshEventName } from "@/components";
import ProjectMeeting from "./meeting";
import ProjectInformation from "./information";

const tabNames = ['information', 'meeting'];

const ProjectDetail: React.FC = () => {
  const { id, tab } = useParams();

  const navigate = useNavigate();

  const { data, loading, refresh } = useRequest(
    async () => {
      return id ? await PPMService.getProject(Number(id)) : undefined;
    },
    {
      debounceWait: 300,
      refreshDeps: [id],
    },
  );

  useEffect(() => {
    const handleSuccess = () => {
      refresh();
    };
    window.addEventListener(PpmProjectListRefreshEventName, handleSuccess);
    return () => {
      window.removeEventListener(PpmProjectListRefreshEventName, handleSuccess);
    };
  }, [refresh]);

  if (!tab || !tabNames.includes(tab)) return (
    <Navigate to={generatePath('/projects/:id/:tab', { id: String(id), tab: tabNames[0] })} />
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'information',
      label: '项目信息',
      children: (<ProjectInformation project={data} />),
    },
    {
      key: 'meeting',
      label: '会议管理',
      children: (<ProjectMeeting projectId={data?.id} />),
    },
  ];

  const onTabChange: TabsProps['onChange'] = (activeKey) => {
    navigate(generatePath('/projects/:id/:tab', { id: String(id), tab: String(activeKey) }));
  };

  return (
    <Spin spinning={loading}>
      <div>
        <Breadcrumb
          items={[
            {
              key: 'list',
              title: (<Link to="/projects">项目</Link>),
            },
            {
              key: 'detail',
              title: '项目详情',
            },
          ]}
        />
        <Card
          title={data?.name || ' '}
          className="mt-4"
          bodyStyle={{ padding: 16 }}
        >
          <Tabs
            activeKey={tab}
            tabPosition="left"
            items={tabItems}
            onChange={onTabChange}
          />
        </Card>
      </div>
    </Spin>
  );
};

export default ProjectDetail;
