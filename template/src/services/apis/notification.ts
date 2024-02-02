import request from "../request";

type GetNotificationsParams = API.PaginationParams<{
  source?: string;
}>;

/**
 * 获取通知列表
 */
export const getNotifications = async (params: GetNotificationsParams): Promise<API.ListData<API.NOTIFICATION.ListItem>> => {
  return await request.get(`/workbenchApi/notifications`, { params });
};
