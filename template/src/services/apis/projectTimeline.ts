import request from "../request";

type GetProjectTimelinesParams = API.PaginationParams & {
  projectID?: number;
};

/**
 * 获取时间线列表
 */
export const getProjectTimelines = async (params: GetProjectTimelinesParams): Promise<API.ListData<API.PROJECT.TIMELINE.ListItem>> => {
  return await request.get('/workbenchApi/projects/timelines', {
    params,
  });
};

/**
 * 获取时间线详情
 */
export const getProjectTimeline = async (id: number): Promise<API.PROJECT.TIMELINE.Detail> => {
  return await request.get(`/workbenchApi/projects/timelines/${id}`);
};

export type CreateProjectTimelineParams = {
  projectID?: number;
  name?: string;
  startTime?: number;
  endTime?: number;
  stageDesc?: string;
};

/**
 * 创建时间线
 */
export const createProjectTimeline = async (params: CreateProjectTimelineParams): Promise<any> => {
  return await request.post('/workbenchApi/projects/timelines', params);
};

export type UpdateProjectTimelineParams = {
  projectID?: number;
  name?: string;
  startTime?: number;
  endTime?: number;
  stageDesc?: string;
};

/**
 * 更新时间线
 */
export const updateProjectTimeline = async (id: number, params: UpdateProjectTimelineParams): Promise<any> => {
  return await request.put(`/workbenchApi/projects/timelines/${id}`, params);
}

/**
 * 删除时间线
 */
export const removeProjectTimeline = async (id: number): Promise<any> => {
  return await request.delete(`/workbenchApi/projects/timelines/${id}`);
};
