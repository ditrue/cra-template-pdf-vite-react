import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, MenuProps } from "antd";

const Root: React.FC = () => {
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: 'jwt',
      label: (<Link to="/auth/jwt">JWT</Link>),
      title: 'JWT',
    },
    {
      key: 'email',
      label: (<Link to="/auth/email">邮箱</Link>),
      title: '邮箱',
    }
  ];

  const currentKey = location.pathname.split('/').pop();
  
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-96 mx-auto">
        <Menu
          selectedKeys={currentKey ? [currentKey] : []}
          items={menuItems}
          mode="horizontal"
        />
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Root;
