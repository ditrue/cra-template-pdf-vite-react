import request from "../request";

/**
 * 获取文档列表
 */
export const getDocuments = async (id: number, params: API.PaginationParams): Promise<API.ListData<API.DOCUMENT.ListItem>> => {
  if (id) return await request.get(`/workbenchApi/documents/${id}`, { params });
  return await request.get(`/workbenchApi/documents`, { params });
};
