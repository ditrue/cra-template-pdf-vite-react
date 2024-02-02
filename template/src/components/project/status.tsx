import { Badge } from "antd";
import { projectConfig } from "@/config";

type Props = {
  status?: string;
  title?: string;
};

export const ProjectStatus: React.FC<Props> = (props) => {
  const { status = 'not_set', title = '-' } = props;

  const color = projectConfig.statusColors[status] || projectConfig.statusColors.not_set;

  return (
    <Badge color={color} text={title} />
  );
};
