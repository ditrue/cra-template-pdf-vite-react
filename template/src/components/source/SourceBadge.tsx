import { Badge, BadgeProps } from "antd";
import { defaultSourceConfig, sourceConfigs } from "@/config";

type SourceBadgeProps = BadgeProps & {
  sourceName?: string;
};

export const SourceBadge: React.FC<SourceBadgeProps> = (props) => {
  const { sourceName = 'default', ...badgeProps } = props;

  const sourceConfig = sourceConfigs.find(item => item.name === sourceName) || defaultSourceConfig;

  return (
    <Badge
      {...badgeProps}
      color={sourceConfig.styles.primary}
    />
  );
};
