// 刷新列表
export const PpmProjectListRefreshEventName = 'PpmProjectListRefresh';

export const dispatchPpmProjectListRefreshEvent = () => {
  const event = new CustomEvent(PpmProjectListRefreshEventName);
  window.dispatchEvent(event);
};

// 更新模态框打开
export const PpmProjectUpdateModalOpenEventName = 'PpmProjectUpdateModalOpen';

export type PpmProjectUpdateModalOpenEventDetail = {
  id: number;
  fields?: string[],
};

export const dispatchPpmProjectUpdateModalOpenEvent = (detail: PpmProjectUpdateModalOpenEventDetail) => {
  const event = new CustomEvent(PpmProjectUpdateModalOpenEventName, {
    detail,
  });
  window.dispatchEvent(event);
};
