export const documentUtil = {
  /**
   * 天华云地址前缀
   */
  edocPrefix: 'https://edoc.thape.com.cn:8022/index.html#doc/enterprise/',

  /**
   * 根据ID获取天华云地址
   */
  getEdocPathById: (id: number) => {
    return `${documentUtil.edocPrefix}${id}`;
  },

  /**
   * PPM地址前缀
   */
  ppmPrefix: 'https://ppm.thape.com.cn',

  /**
   * 根据ID获取PPM项目地址
   */
  getPpmProjectPath: (id: number) => {
    return `${documentUtil.ppmPrefix}/projects/${id}`;
  },

  /**
   * 根据项目ID获取PPM项目工作包链接
   */
  getPpmProjectWorkPackagesPath: (id: number) => {
    return `${documentUtil.ppmPrefix}/projects/${id}/work_packages`;
  },
  
  /**
   * 根据项目ID和工作包ID获取工作包详情链接
  */
  getPpmProjectWorkPackagePath: (id: number, projectId: number) => {
    return `${documentUtil.ppmPrefix}/projects/${projectId}/work_packages/${id}/activity`;
  },
  
  /**
   * 根据项目ID获取项目设置页链接
  */
 getPpmProjectSettingPath: (id: number) => {
    return `${documentUtil.ppmPrefix}/projects/${id}/settings/general/`;
  },
};
