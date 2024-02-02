// 日历列表刷新
export const CalendarListRefreshEventName = 'CalendarListRefresh';

export const dispatchCalendarListRefreshEvent = () => {
  const event = new CustomEvent(CalendarListRefreshEventName);
  window.dispatchEvent(event);
};

// 日历创建模态框打开
export const CalendarCreateModalOpenEventName = 'CalendarCreateModalOpen';

export type CalendarCreateModalOpenEventDetail = {
  accountId: number;
  title?: string;
  color?: string;
};

export const dispatchCalendarCreateModalOpenEvent = (detail: CalendarCreateModalOpenEventDetail) => {
  const event = new CustomEvent(CalendarCreateModalOpenEventName, {
    detail,
  });
  window.dispatchEvent(event);
};

// 日历更新模态框打开
export const CalendarUpdateModalOpenEventName = 'CalendarUpdateModalOpen';

export type CalendarUpdateModalOpenEventDetail = {
  id: number;
  title?: string;
};

export const dispatchCalendarUpdateModalOpenEvent = (detail: CalendarUpdateModalOpenEventDetail) => {
  const event = new CustomEvent(CalendarUpdateModalOpenEventName, {
    detail,
  });
  window.dispatchEvent(event);
};

// 日历账户创建模态框打开
export const CalendarAccountCreateModalOpenEventName = 'CalendarAccountCreateModalOpen';

export const dispatchCalendarAccountCreateModalOpenEvent = () => {
  const event = new CustomEvent(CalendarAccountCreateModalOpenEventName);
  window.dispatchEvent(event);
};

// 日历账户更新模态框打开
export const CalendarAccountUpdateModalOpenEventName = 'CalendarAccountUpdateModalOpen';

export type CalendarAccountUpdateModalOpenEventDetail = {
  id: number;
  title?: string;
};

export const dispatchCalendarAccountUpdateModalOpenEvent = (detail: CalendarAccountUpdateModalOpenEventDetail) => {
  const event = new CustomEvent(CalendarAccountUpdateModalOpenEventName, {
    detail,
  });
  window.dispatchEvent(event);
};
