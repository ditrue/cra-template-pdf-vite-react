import request from "../request";

type GetProjectStagesParams = API.PaginationParams & {
  projectID?: number;
};

/**
 * 获取项目下的商务节点
 */
export const getProjectStages = async (params: GetProjectStagesParams): Promise<API.ListData<API.PROJECT.STAGE.ListItem>> => {
  return await request.get('/workbenchApi/projectStages', {
    params,
  });
};

/**
 * 获取单个项目商务节点
 */
export const getProjectStage = async (id: number): Promise<API.PROJECT.STAGE.ListItem> => {
  return await request.get(`/workbenchApi/projectStages/${id}`);
};

type CreateProjectStageParams = {
  projectID: number;
  name: string;
  startTime: string;
};

/**
 * 创建项目商务节点
 */
export const createProjectStage = async (params: CreateProjectStageParams): Promise<any> => {
  return await request.post('/workbenchApi/projectStages', params);
};

type UpdateProjectStageParams = {
  name?: string;
  startTime?: string;
};

/**
 * 更新项目商务节点
 */
export const updateProjectStage = async (id: number, params: UpdateProjectStageParams) => {
  return await request.patch(`/workbenchApi/projectStages/${id}`, params);
};

/**
 * 删除项目商务节点
 */
export const removeProjectStage = async (id: number) => {
  return await request.delete(`/workbenchApi/projectStages/${id}`);
};
