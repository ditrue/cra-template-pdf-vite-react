import request from '../request';

type GetProjectsParams = API.PaginationParams<{
  keywords?: string;
  projectName?: string;
  projectCode?: string;
}>;

/**
 * 获取项目列表
 */
export const getProjects = async (params: GetProjectsParams): Promise<API.ListData<API.PROJECT.ListItem>> => {
  return await request.get('/workbenchApi/projects', {
    params
  });
};

/**
 * 获取项目详情
 */
export const getProject = async (code: string): Promise<API.PROJECT.Detail> => {
  return await request.get(`/workbenchApi/projects/${code}`);
};
