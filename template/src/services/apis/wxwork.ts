import request from "../request";

/**
 * 获取企业微信组织架构
 */
export const getWxworkOrgs = async (): Promise<API.WXWORK.Org[]> => {
  return await request.get('/workbenchApi/wxwork/orgs');
};

/**
 * 获取单个组织下的用户
 */
export const getWxworkOrgUsers = async (orgId: number): Promise<API.WXWORK.OrgUser[]> => {
  return await request.get(`/workbenchApi/wxwork/orgs/${orgId}/users`);
};

/**
 * 获取所有企业微信用户
 */
export const getWxworkUsers = async (): Promise<API.WXWORK.OrgUser[]> => {
  return await request.get('/workbenchApi/wxwork/users');
};
