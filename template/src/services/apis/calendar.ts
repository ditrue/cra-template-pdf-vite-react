import request from '../request';

/**
 * 获取日历账户
 */
export const getCalendarAccounts = async (): Promise<API.CALENDAR.CalendarAccount[]> => {
  return await request.get('/workbenchApi/calendars/accounts');
};

/**
 * 获取日历账户详情
 */
export const getCalendarAccount = async (id: number): Promise<API.CALENDAR.CalendarAccount> => {
  return await request.get(`/workbenchApi/calendars/accounts/${id}`);
}

/**
 * 添加日历账户
 */
export const createCalendarAccount = async (params: any) => {
  return await request.post('/workbenchApi/calendars/accounts', params);
};

/**
 * 修改日历账户
*/
export const updateCalendarAccount = async (id: number, params: any) => {
  return await request.patch(`/workbenchApi/calendars/accounts/${id}`, params);
};

/**
 * 删除日历账户
*/
export const removeCalendarAccount = async (id: number) => {
  return await request.delete(`/workbenchApi/calendars/accounts/${id}`);
};

/**
 * 获取日历列表
 */
export const getCalendars = async (): Promise<API.CALENDAR.Calendar[]> => {
  return await request.get('/workbenchApi/calendars');
};

/**
 * 获取日历详情
 */
export const getCalendar = async (id: number): Promise<API.CALENDAR.Calendar> => {
  return await request.get(`/workbenchApi/calendars/${id}`);
};

type CreateCalendarParams = {
  name?: string;
  color?: string;
  description?: string;
  default?: boolean;
  accountID: number;
}

/**
 * 创建日历
 */
export const createCalendar = async (params: CreateCalendarParams) => {
  return await request.post('/workbenchApi/calendars', params);
};

/**
 * 更新日历
 */
export const updateCalendar = async (id: number, params: Partial<CreateCalendarParams>) => {
  return await request.patch(`/workbenchApi/calendars/${id}`, params);
};

/**
 * 删除日历
 */
export const removeCalendar = async (id: number) => {
  return await request.delete(`/workbenchApi/calendars/${id}`);
};
