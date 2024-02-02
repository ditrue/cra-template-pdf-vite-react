import request from "../request";

/**
 * 上传文件
 */
export const uploadFile = async (file: File): Promise<{ file: API.FILE.File }> => {
  const formData = new FormData();
  formData.append('file', file);
  return await request.post('/workbenchApi/uploads', formData);
};
