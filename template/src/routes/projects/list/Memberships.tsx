import { Spin, Tooltip } from "antd";
import { useRequest } from "ahooks";
import { PPMService } from "@/services";

type Props = {
  projectId: number;
}

const Memberships: React.FC<Props> = (props) => {
  const { projectId } = props;

  const { data, loading } = useRequest(PPMService.getMemberships, {
    cacheKey: `Projects-${projectId}-memberships`,
    debounceWait: 300,
    defaultParams: [{
      filters: [{"project":{"operator":"=","values":[projectId.toString()]}}],
    }],
  });

  return (
    <Spin spinning={loading}>
      <Tooltip title={data?.principalNames.join('; ')}>
        <div className="truncate">
          {data?.principalNames.join('; ')}
        </div>
      </Tooltip>
    </Spin>
  );
};

export default Memberships;
