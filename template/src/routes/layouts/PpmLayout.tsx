import { Outlet } from "react-router-dom";
import { ConfigProvider } from "antd";

export const PpmLayout = () => {

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            colorBgHeader: '#FFFFFF',
          },
        },
      }}
    >
      <Outlet />
    </ConfigProvider>
  );
};
