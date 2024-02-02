import { Button, ButtonProps, ConfigProvider } from "antd";
import { defaultSourceConfig, sourceConfigs } from "@/config";

type SourceButtonProps = ButtonProps & {
  sourceName?: string;
  active?: boolean;
};

export const SourceButton: React.FC<SourceButtonProps>= (props) => {
  const {
    sourceName,
    active,
    ...buttonProps
  } = props;

  const sourceConfig = sourceConfigs.find(item => item.name === sourceName) || defaultSourceConfig;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: active ? sourceConfig.styles.primary : defaultSourceConfig.styles.primary,
        },
      }}
    >
      <Button
        {...buttonProps}
        type="primary"
      />
    </ConfigProvider>
  );
};
