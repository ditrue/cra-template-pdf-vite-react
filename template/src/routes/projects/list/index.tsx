import { useEffect } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { Button, Card, Space, Table, TableProps, Tag, Tooltip, Typography } from 'antd';
import { EditOutlined, FolderAddOutlined, MessageOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { documentUtil, onIthAnchorClick } from '@/utils';
import { PPMService } from '@/services';
import { ProjectHalSource } from '@/halSources';
import { PpmProjectListRefreshEventName, ProjectStatus, ThEmpty, dispatchPpmProjectUpdateModalOpenEvent } from '@/components';
import ppmLogo from '@/assets/ppm-logo.png';

const ProjectList: React.FC = () => {
  const { data, loading, refresh } = useRequest(PPMService.getProjects, {
    cacheKey: 'Projects',
    debounceWait: 300,
    defaultParams: [{
      pageSize: -1,
      offset: 1,
      filters: [
        {
          "active": {"operator":"=","values":["t"]}
        }
      ]
    }],
  });

  useEffect(() => {
    const handleSuccess = () => {
      refresh();
    };
    window.addEventListener(PpmProjectListRefreshEventName, handleSuccess);
    return () => {
      window.removeEventListener(PpmProjectListRefreshEventName, handleSuccess);
    };
  }, [refresh]);

  const handleUpdate = (id: number, fields?: string[]) => {
    dispatchPpmProjectUpdateModalOpenEvent({ id, fields });
  };

  const tableColumns: TableProps<ProjectHalSource>['columns'] = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '项目名称',
      width: 300,
      className: 'group-hover:bg-inherit',
      render: (name, record) => {
        if (!name) return null;
        return (
          <Link
            to={generatePath('/projects/:id/information', { id: record.id.toString() })}
            className="hover:underline text-inherit"
          >
            <Typography.Text>
              {name}
            </Typography.Text>
            {record.profile?.typeId === 1 && (
              <Tag color="lime" className="ml-1">总包</Tag>
            )}
          </Link>
        );
      },
    },
    {
      key: 'profileCode',
      dataIndex: ['profile', 'code'],
      title: '项目编号',
      width: 120,
      className: 'group-hover:bg-inherit',
      render: (text, record) => {
        if (!record.profile) return null;
        return (
          <div>
            <span>{text}</span>
            {!!record.links.updateImmediately && (
              <EditOutlined
                className="text-blue-400 cursor-pointer ml-2 transition-all  opacity-0 group-hover:opacity-100"
                title="编辑"
                onClick={() => handleUpdate(record.id, ['code', 'name'])}
              />
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '项目状态',
      width: 120,
      className: 'group-hover:bg-inherit',
      render: (status) => {
        return (
          <ProjectStatus
            status={status.code}
            title={status.title}
          />
        );
      },
    },
    {
      key: 'manager',
      title: '管理',
      width: 200,
      align: 'left',
      className: 'group-hover:bg-inherit',
      render: (record) => {
        const items = [(
          <Link to={generatePath('/projects/:id/meeting', { id: record.id.toString() })}>
            <Button
              className="px-0"
              icon={(<MessageOutlined />)}
              type="ghost"
              style={{ color: '#EC598C' }}
            >
              会议
            </Button>
          </Link>
        )];
        if (record.profile) {
          items.push((
            <Tooltip
              title={(
                <div>
                  <span>{record.profile.docLink || '未设置'}</span>
                  {!!record.links.updateImmediately && (
                    <EditOutlined
                      className="text-blue-400 cursor-pointer ml-2"
                      title="编辑"
                      onClick={() => handleUpdate(record.id, ['docLink'])}
                    />
                  )}
                </div>
              )}
            >
              {record.profile.docLink ? (
                <a
                  href={record.profile.docLink}
                  target='_blank'
                  rel='noreferrer'
                  onClick={onIthAnchorClick}
                >
                  <Button
                    className="px-0"
                    icon={(<FolderAddOutlined />)}
                    type="ghost"
                    style={{ color: '#413974' }}
                  >
                    文档
                  </Button>
                </a>
              ) : (
                <Button
                  className="px-0"
                  icon={(<FolderAddOutlined />)}
                  type="ghost"
                  style={{ color: '#C1BDBD', cursor: 'not-allowed' }}
                >
                  文档
                </Button>
              )}
            </Tooltip>
          ));
        }
        items.push((
          <a
            href={documentUtil.getPpmProjectWorkPackagesPath(record.id)}
            target='_blank'
            rel='noreferrer'
            onClick={onIthAnchorClick}
          >
            <Button className='p-0' type="ghost">
              <img
                style={{ height: 20 }}
                src={ppmLogo}
                alt=""
              />
            </Button>
          </a>
        ));
        return (
          <Space size="large">
            {items}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Card
        title="项目看板"
        extra={(
          <Space>
            <Link to="/projects/new">
              <Button type="primary">创建项目空间</Button>
            </Link>
          </Space>
        )}
      >
        <Table
          loading={loading}
          tableLayout="fixed"
          rowKey="id"
          columns={tableColumns}
          dataSource={data?.treeList}
          pagination={false}
          rowClassName="even:bg-gray-50 odd:bg-white hover:shadow-eq hover:scale-100 transition-shadow duration-300 group"
          locale={{
            emptyText: (
              <ThEmpty
                description={(
                  <div className="text-black text-opacity-25 mt-4">
                    {loading ? '数据加载中' : '暂无数据'}
                  </div>
                )}
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default ProjectList;
