import { useLocation } from "react-router-dom";
import { Alert } from "antd";

const PpmError: React.FC = () => {
  const location = useLocation();
  const usp = new URLSearchParams(location.search);
  const title = usp.get('title') || '错误提示'
  const message = usp.get('message') || '获取项目信息失败';

  return (
    <div>
      <Alert
        message={title}
        description={message}
        type="error"
      />
    </div>
  );
};

export default PpmError;
