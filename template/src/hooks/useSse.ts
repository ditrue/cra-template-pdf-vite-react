import { useEffect } from "react";
import { notification } from "antd";
import { dispatchCalendarListRefreshEvent, dispatchScheduleListRefreshEvent } from "@/components";
import { dispatchPpmNotificationsRefreshEvent } from "@/halSources";

const OutlookUpdateEvent = 'outlookUpdate';
const WxworkUpdateEvent = 'weComScheduleUpdate';
const WxworkCalendarDelete = 'weComCalendarDelete';
const OpTodoUpdateEvent = 'openProjectToDoUpdate';
const MessageEvent = 'message';

export const useSse = () => {
  useEffect(() => {
    const source = new EventSource('/workbenchApi/ithSse');
    source.addEventListener(OutlookUpdateEvent, (e) => {
      if (e.data === 'true') {
        dispatchScheduleListRefreshEvent();
        notification.info({
          key: 'SchedulesUpdate',
          message: '日程更新通知',
          description: '您的Outlook日程有更新',
          duration: 3,
        });
      }
    });
    source.addEventListener(WxworkUpdateEvent, (e) => {
      if (e.data === 'true') {
        dispatchScheduleListRefreshEvent();
        notification.info({
          key: 'SchedulesUpdate',
          message: '日程更新通知',
          description: '您的微信日程有更新',
          duration: 3,
        });
      }
    });
    source.addEventListener(WxworkCalendarDelete, (e) => {
      if (e.data === 'true') {
        dispatchCalendarListRefreshEvent();
      }
    });
    source.addEventListener(OpTodoUpdateEvent, (e) => {
      if (e.data === 'true') {
        dispatchPpmNotificationsRefreshEvent();
        notification.info({
          message: 'PPM待办更新通知',
          description: '您的PPM待办有更新',
          duration: 3,
        });
      }
    });
    source.addEventListener(MessageEvent, (e) => {
      if (e.data) {
        notification.info({
          message: '通知',
          description: e.data,
          duration: 3,
        });
      }
    });
    return () => source.close();
  }, []);
};
