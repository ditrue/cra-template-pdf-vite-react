// 刷新列表
export const ScheduleListRefreshEventName = 'ScheduleListRefresh';

export const dispatchScheduleListRefreshEvent = () => {
  const event = new CustomEvent(ScheduleListRefreshEventName);
  window.dispatchEvent(event);
};

// 创建模态框打开
export const ScheduleCreateModalOpenEventName = 'ScheduleCreateModalOpen';

export type ScheduleCreateModalOpenEventDetail = {
  /**
   * YYYY-MM-DD HH:mm:ss
   */
  date?: string;
};

export const dispatchScheduleCreateModalOpenEvent = (detail: ScheduleCreateModalOpenEventDetail = {}) => {
  const event = new CustomEvent(ScheduleCreateModalOpenEventName, {
    detail,
  });
  window.dispatchEvent(event);
};

// 更新模态框打开
export const ScheduleUpdateModalOpenEventName = 'ScheduleUpdateModalOpen';

export type ScheduleUpdateModalOpenEventDetail = {
  id: number;
  modifyType: number;
  modifyTime: number;
};

export const dispatchScheduleUpdateModalOpenEvent = (detail: ScheduleUpdateModalOpenEventDetail) => {
  const event = new CustomEvent(ScheduleUpdateModalOpenEventName, {
    detail,
  });
  window.dispatchEvent(event);
};

// 项目模态框打开

export const ScheduleProjectModalOpenEventName = 'ScheduleProjectModalOpen';

export type ScheduleProjectModalOpenEventDetail = {
  id: number;
  title?: string;
};

export const dispatchScheduleProjectModalOpenEvent = (detail: ScheduleProjectModalOpenEventDetail) => {
  const event = new CustomEvent(ScheduleProjectModalOpenEventName, {
    detail,
  });
  window.dispatchEvent(event);
};

// 文件模态框打开

export const ScheduleFilesModalOpenEventName = 'ScheduleFilesModalOpen';

export type ScheduleFilesModalOpenEventDetail = {
  id: number;
  title?: string;
};

export const dispatchScheduleFilesModalOpenEvent = (detail: ScheduleFilesModalOpenEventDetail) => {
  const event = new CustomEvent(ScheduleFilesModalOpenEventName, {
    detail,
  });
  window.dispatchEvent(event);
};
