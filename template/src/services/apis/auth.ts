import request from '../request';

type AuthJwtLoginParams = {
  ithJwt: string;
};

/**
 * JWT登录
 */
export const authJwtLogin = async (params: AuthJwtLoginParams): Promise<API.AUTH.Jwt> => {
  return await request.post('/workbenchApi/auth/sessions', params);
};

type AuthEmailLoginParams = {
  email: string;
};

/**
 * 邮箱登录
 */
export const authEmailLogin = async (params: AuthEmailLoginParams): Promise<API.AUTH.Email> => {
  return await request.post('/workbenchApi/auth/token', params);
};
