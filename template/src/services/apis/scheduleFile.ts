import request from "../request";

type GetScheduleFilesParams = API.PaginationParams & {
  timelineID?: number;
};

/**
 * 获取日程文件列表
 */
export const getScheduleFiles = async (params: GetScheduleFilesParams): Promise<API.ListData<API.SCHEDULE.File>> => {
  return await request.get('/workbenchApi/scheduleMinutes', {
    params,
  });
};

export type CreateScheduleFileParams = {
  timelineID: number;
  fileID: number;
  fileName: string;
};

/**
 * 新增日程文件
 */
export const createScheduleFile = async (params: CreateScheduleFileParams): Promise<any> => {
  return await request.post('/workbenchApi/scheduleMinutes', params);
};

/**
 * 删除日程文件
 */
export const removeScheduleFile = async (id: number): Promise<any> => {
  return await request.delete(`/workbenchApi/scheduleMinutes/${id}`);
};
