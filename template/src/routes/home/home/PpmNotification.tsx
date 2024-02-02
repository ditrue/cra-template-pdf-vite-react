import { useEffect, useState } from "react";
import { App, Badge, Button, Card, Divider, List, Select, Space, Tag } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import classNames from "classnames";
import { PPMService } from "@/services";
import { documentUtil, ithOpenUrl } from "@/utils";
import { ThSpinWithEmpty } from "@/components";
import { PpmNotificationsRefreshEventName } from "@/halSources";
import ppmLogo from '@/assets/ppm-logo.png';

const PpmNotification: React.FC = () => {
  const [readIAN, setReadIAN] = useState(false);
  
  const { message } = App.useApp();

  const { data: statuses } = useRequest(PPMService.getStatuses, {
    cacheKey: 'PpmStatuses',
    debounceWait: 300,
  });

  const { data: types } = useRequest(PPMService.getTypes, {
    cacheKey: 'PpmTypes',
    debounceWait: 300,
  });

  const [projects, setProjects] = useState<{ id: number; title: string; total: number; }[]>([]);

  const [projectId, setProjectId] = useState<number>();

  const { run: runGetCount } = useRequest(
    async () => {
      return await PPMService.getNotificationCountByProject();
    },
    {
      debounceWait: 300,
      onSuccess: (data) => {
        setProjects(data);
        if (projectId && !data.some(item => item.id === projectId)) {
          setProjectId(undefined);
        }
      },
    },
  );

  const { data, loading, run, refresh } = useRequest(
    async (params: { readIAN: boolean; projectId?: number; }) => {
      const { readIAN, projectId } = params;

      const filters = [];

      if (readIAN === false) {
        filters.push({
          readIAN: {
            operator: '=',
            values: ['f'],
          },
        });
      }

      if (projectId) {
        filters.push({
          project: {
            operator: '=',
            values: [projectId.toString()],
          },
        });
      }

      const notifications = await PPMService.getNotifications({
        pageSize: 100,
        filters,
      });

      if (notifications.list.length === 0) return [];

      const workPackages = await PPMService.getWorkPackages({
        pageSize: -1,
        offset: 1,
        filters: [
          {
            id: {
              operator: '=',
              values: notifications.workPackageIds,
            },
          },
        ],
      });

      const data: Record<string, {
        projectId: number;
        projectTitle: string;
        wpId: number;
        wpTitle: string;
        wpStatusId: number;
        wpStatusTitle: string;
        wpTypeId: number;
        wpTypeName: string;
        reasons: string[];
        actors: string[];
        createdAt: string;
        notificationIds: number[];
        total: number;
      }> = {};

      notifications.list.forEach((ntf) => {
        if (!ntf.wpId) return;
        if (data[ntf.wpId]) {
          data[ntf.wpId].notificationIds.push(ntf.id);
          if (ntf.reasonName && !data[ntf.wpId].reasons.includes(ntf.reasonName)) {
            data[ntf.wpId].reasons.push(ntf.reasonName);
          }
          if (ntf.actorName && !data[ntf.wpId].actors.includes(ntf.actorName)) {
            data[ntf.wpId].actors.push(ntf.actorName);
          }
          if (!ntf.readIAN) {
            data[ntf.wpId].total += 1;
          }
        } else {
          const wp = workPackages.list.find(item => item.id === ntf.wpId);
          if (!wp) return;
          data[ntf.wpId] = {
            projectId: ntf.projectId as number,
            projectTitle: ntf.projectName,
            wpId: ntf.wpId,
            wpTitle: ntf.wpName as string,
            wpTypeId: wp.typeId as number,
            wpTypeName: wp.typeName,
            wpStatusTitle: wp.statusName,
            wpStatusId: wp.statusId as number,
            reasons: [ntf.reasonName],
            actors: [ntf.actorName],
            createdAt: ntf.createdAt,
            notificationIds: [ntf.id],
            total: !ntf.readIAN ? 1 : 0,
          };
        }
      });

      return Object.values(data).sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      });
    },
    {
      cacheKey: 'PpmNotifications',
      debounceWait: 300,
      manual: true,
      onSuccess: () => {
        runGetCount();
      },
    },
  );

  const { loading: readLoading, run: runRead } = useRequest(
    (ids: number[], _wpID: number) => {
      return PPMService.readNotifications(ids);
    },
    {
      debounceWait: 300,
      manual: true,
      onSuccess: (_, [__, wpId]) => {
        run({ readIAN, projectId });
        console.log(wpId);
        message.success(`ID: ${wpId} 成功设置为已完成`);
      },
    }
  );

  useEffect(() => {
    run({
      readIAN,
      projectId,
    });
  }, [readIAN, projectId, run]);

  useEffect(() => {
    const handle = () => {
      refresh();
    };
    window.addEventListener(PpmNotificationsRefreshEventName, handle);
    return () => {
      window.removeEventListener(PpmNotificationsRefreshEventName, handle);
    };
  }, [refresh]);

  const getStatusColor = (id: number) => {
    const defaultColor = '#ccc';
    if (!statuses) return defaultColor;
    const status = statuses.list.find(item => item.id === id);
    return status?.color || defaultColor;
  };

  const getTypeColor = (id: number) => {
    const defaultColor = '#ccc';
    if (!types) return defaultColor;
    const type = types.list.find(item => item.id === id);
    return type?.color || defaultColor;
  };

  const handleJumpToProject = (id: number) => {
    const url = documentUtil.getPpmProjectPath(id);
    ithOpenUrl(url);
  };

  const handleJumpToWpDetail = (id: number, projectId: number) => {
    const url = documentUtil.getPpmProjectWorkPackagePath(id, projectId);
    ithOpenUrl(url);
  };

  return (
    <Card
      title="待办"
      bodyStyle={{ padding: 0 }}
      headStyle={{ border: 'none' }}
      extra={(
        <img
          style={{ height: 24 }}
          src={ppmLogo}
          alt=""
        />
      )}
    >
      <div className="flex justify-between items-center px-6">
        <Space.Compact size="small">
          <Button
            className={classNames({
              'bg-gray-300 text-white hover:border-gray-300 cursor-default': !readIAN,
              'bg-white text-black hover:border-gray-300': readIAN,
            })}
            onClick={() => setReadIAN(false)}
          >
            未完成
          </Button>
          <Button
            className={classNames({
              'bg-gray-300 text-white hover:border-gray-300 cursor-default': readIAN,
              'bg-white text-black hover:border-gray-300 hover:text-opacity-70': !readIAN,
            })}
            onClick={() => setReadIAN(true)}
          >
            全部
          </Button>
        </Space.Compact>
        <Select
          className="w-52"
          placeholder="项目筛选"
          allowClear
          options={projects.map(item => ({
            label: (
              <>
                <Badge
                  className="-mt-0.5"
                  size="small"
                  color="blue"
                  count={item.total}
                />
                <span className="ml-1">
                  {item.title}
                </span>
              </>
            ),
            value: item.id,
          }))}
          value={projectId}
          onChange={(value) => setProjectId(value)}
        />
      </div>
      <Divider className="my-4" />
      <ThSpinWithEmpty
        loading={loading}
        empty={{
          description: (
            <div className="text-black text-opacity-25 mt-4">
              {loading ? '数据加载中' : '暂无待办'}
            </div>
          )
        }}
        active={data && data.length > 0}
      >
        <List
          rowKey="wpId"
          dataSource={data}
          size="small"
          renderItem={item => (
            <List.Item className={classNames('px-6', { 'bg-stone-50': item.total === 0 })}>
              <List.Item.Meta
                description={(
                  <div>
                    <div className="text-gray-500">
                      <Tag color={getStatusColor(item.wpStatusId)} style={{ color: '#333333' }}>
                        {item.wpStatusTitle}
                      </Tag>
                      <span className={classNames({ 'font-bold': item.total > 0 })}>
                        ID: {item.wpId}
                      </span>
                      <span>&nbsp;-&nbsp;</span>
                      <span
                        className={classNames('hover:underline cursor-pointer', { 'font-bold': item.total > 0 })}
                        onClick={() => handleJumpToProject(item.projectId)}
                      >
                        {item.projectTitle}
                      </span>
                      <span>&nbsp;-&nbsp;</span>
                      <span>{item.reasons.join(',')}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-bold" style={{ color: getTypeColor(item.wpTypeId) }}>
                        {item.wpTypeName}
                      </span>
                      <span
                        className={classNames('ml-2 hover:underline cursor-pointer', { 'font-bold': item.total > 0 })}
                        onClick={() => handleJumpToWpDetail(item.wpId, item.projectId)}
                      >
                        {item.wpTitle}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span>
                        {dayjs(item.createdAt).fromNow()},
                      </span>
                      <span className="ml-2">
                        {item.actors.join(',')}
                      </span>
                    </div>
                  </div>
                )}
              />
              {item.total > 0 && (
                <div className="flex items-center">
                  <Badge count={item.total} color="#00A3FF" />
                  <Button
                    type="link"
                    title="标记为已读"
                    className="text-gray-500"
                    disabled={readLoading}
                    onClick={() => runRead(item.notificationIds, item.wpId)}
                  >
                    <CheckCircleFilled />
                  </Button>
                </div>
              )}
            </List.Item>
          )}
        />
      </ThSpinWithEmpty>      
    </Card>
  );
};

export default PpmNotification;
