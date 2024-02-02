import { useEffect, useState } from "react";
import { Link, matchPath, Outlet, useLocation } from "react-router-dom";
import { ConfigProvider, Layout, Menu, MenuProps } from "antd";
import { useWxworkOrgs, useWxworkUsers } from "@/hooks";
import { CalendarAccountCreateModal, CalendarAccountUpdateModal, CalendarCreateModal, CalendarUpdateModal, PpmProjectUpdateModal, ScheduleCreateModal, ScheduleFilesModal, ScheduleProjectModal, ScheduleUpdateModal } from "@/components";

const menus = [
  {
    path: '/',
    title: '今天',
    matchPaths: ['/'],
  },
  {
    path: '/schedules',
    title: '日历',
    matchPaths: ['/schedules'],
  },
  {
    path: '/projects',
    title: '项目',
    matchPaths: ['/projects', '/projects/:id/:tab'],
  },
];

export const BasicLayout = () => {
  const [menuSelectedKeys, setMenuSelectedKeys] = useState<string[]>();
  const location = useLocation();
  useWxworkOrgs();
  useWxworkUsers();

  useEffect(() => {
    const selectedMenu = menus.find(item => item.matchPaths.some(path => matchPath(path, location.pathname)));
    setMenuSelectedKeys(selectedMenu ? [selectedMenu.path] : []);
  }, [location]);

  const menuItems: MenuProps['items'] = menus.map(item => ({
    key: item.path,
    label: (
      <Link to={item.path}>
        {item.title}
      </Link>
    ),
  }));

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
      <Layout>
        <Layout.Header>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: 'rgb(39, 39, 39)',
              }
            }}
          >
            <Menu
              mode="horizontal"
              items={menuItems}
              selectedKeys={menuSelectedKeys}
            />
          </ConfigProvider>
        </Layout.Header>
        <Layout.Content className="p-8" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Layout.Content>
      </Layout>
      <ScheduleCreateModal />
      <ScheduleUpdateModal />
      <ScheduleProjectModal />
      <ScheduleFilesModal />
      <CalendarCreateModal />
      <CalendarUpdateModal />
      <CalendarAccountCreateModal />
      <CalendarAccountUpdateModal />
      <PpmProjectUpdateModal />
    </ConfigProvider>
  );
};
