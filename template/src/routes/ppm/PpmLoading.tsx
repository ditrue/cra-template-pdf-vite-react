import { useLocation } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd"

const PpmLoading: React.FC = () => {
  const location = useLocation();
  const usp = new URLSearchParams(location.search);
  const tip = usp.get('tip') || '正在加载数据...';

  return (
    <Spin
      spinning
      tip={tip}
      style={{ color: '#175A8E' }}
      indicator={(<LoadingOutlined />)}
      size="large"
    >
      <div style={{ width: '100vw', height: '100vh' }}></div>
    </Spin>
  );
};

export default PpmLoading;
