import { NotificationCollectionHalSource, NotificationCollectionHalSourceProps } from "@/halSources";
import request from "../request";

export const getNotificationCountByProject = async (): Promise<{ id: number; title: string; total: number; }[]> => {
  const result: any = await request.get('/workbenchApi/api/v3/notifications', {
    params: {
      groupBy: 'project',
      pageSize: 100,
      filters: [
        {
          read_ian: {
            operator: '=',
            values: ['f'],
          },
        }
      ],
    },
  });
  return result.groups.map((item: any) => {
    const id = item._links.valueLink[0].href.match(/^\/api\/v3\/projects\/(\d+)/)?.[1];
    return {
      id: Number(id),
      title: item.value,
      total: item.count,
    };
  });
};

export const getNotifications = async (params?: any) => {
  const result: NotificationCollectionHalSourceProps = await request.get('/workbenchApi/api/v3/notifications', {
    params,
  });
  return new NotificationCollectionHalSource(result);
};

export const readNotifications = async (ids: number[]) => {
  const filters = [
    {
      id: {
        operator: '=',
        values: ids,
      }
    }
  ];

  await request.post(`/workbenchApi/api/v3/notifications/read_ian?filters=${encodeURIComponent(JSON.stringify(filters))}`);
};
