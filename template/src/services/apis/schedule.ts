import request from '../request';

type GetSchedulesParams = {
  startTime: number;
  endTime: number;
};

/**
 * 获取日程列表
 */
export const getSchedules = async (params: GetSchedulesParams): Promise<API.ListData<API.SCHEDULE.ListItem>> => {
  return await request.get('/workbenchApi/calendars/schedules', {
    params
  });
};

/**
 * 获取日程详情
 */
export const getSchedule = async (id: number): Promise<API.SCHEDULE.Detail> => {
  return await request.get(`/workbenchApi/calendars/schedules/${id}`);
};

/**
 * 创建日程
 */
export const createSchedule = async (params: Partial<API.SCHEDULE.Detail>): Promise<string> => {
  return await request.post('/workbenchApi/calendars/schedules', params);
};

/**
 * 更新日程
 */
export const updateSchedule = async (id: number, params: Partial<API.SCHEDULE.Detail>, modifyScheduleType = 0, modifyTime = 0): Promise<string> => {
  return await request.put(`/workbenchApi/calendars/schedules/${id}`, params, {
    params: {
      modifyScheduleType,
      modifyTime,
    },
  });
};

/**
 * 删除日程
 */
export const removeSchedule = async (id: number, modifyScheduleType = 0, modifyTime = 0): Promise<string> => {
  return await request.delete(`/workbenchApi/calendars/schedules/${id}`, {
    params: {
      modifyScheduleType,
      modifyTime,
    },
  });
};

/**
 * 获取outlook日程参与者
 */
export const getScheduleOutlookAttendees = async (id: number): Promise<string[]> => {
  return await request.get(`/workbenchApi/calendars/schedules/${id}/outlook_attendees`);
};
