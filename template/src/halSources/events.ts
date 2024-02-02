// 刷新通知列表
export const PpmNotificationsRefreshEventName = 'PpmNotificationsRefresh';

export const dispatchPpmNotificationsRefreshEvent = () => {
  const event = new CustomEvent(PpmNotificationsRefreshEventName);
  window.dispatchEvent(event);
};
