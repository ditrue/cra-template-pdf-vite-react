import React, { useEffect, useId, useState } from "react";
import { Link, generatePath } from "react-router-dom";
import { App, Button, Card, Col, Divider, Dropdown, Modal, Popover, Row, Tooltip } from "antd";
import { ArrowRightOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, FileProtectOutlined, FileTextOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import { scheduleUtil } from "@/utils";
import { PPMService, getScheduleOutlookAttendees, removeSchedule } from "@/services";
import { dispatchScheduleFilesModalOpenEvent, dispatchScheduleListRefreshEvent, dispatchScheduleProjectModalOpenEvent, dispatchScheduleUpdateModalOpenEvent } from "./events";

const LabelContentRow: React.FC<React.PropsWithChildren & { label: string; }> = (props) => {
  const { label, children } = props;
  return (
    <Row align="top" className="mt-3">
      <Col className="w-16 flex-none">{label}</Col>
      <Col flex={1} className="w-0">
        {children}
      </Col>
    </Row>
  );
};

const FieldsGroup: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="border-0 border-t border-solid border-stone-200 mt-3">
      {children}
    </div>
  );
};

type Props = React.PropsWithChildren & {
  schedule: API.SCHEDULE.ListItem;
  date: dayjs.Dayjs;
  onHide?: () => void;
};

const SchedulePopoverContent: React.FC<Props> = (props) => {
  const { schedule, date, onHide } = props;

  const [organizer, setOrganizer] = useState<string>();
  const [participants, setParticipants] = useState<string[]>([]);

  const { message } = App.useApp();

  const { runAsync: runRemove, loading: removeLoading } = useRequest(removeSchedule, {
    manual: true,
    debounceWait: 300,
    onSuccess: () => {
      onHide?.();
      dispatchScheduleListRefreshEvent();
    },
  });

  const { run: getAttendees } = useRequest(getScheduleOutlookAttendees, {
    manual: true,
    debounceWait: 300,
    onSuccess: (data) => {
      if (data) {
        setParticipants(data);
        setOrganizer(data[0]);
      }
    },
  });

  const { data: project } = useRequest(async () => {
    return schedule.projectID ? await PPMService.getProject(schedule.projectID) : undefined;
  }, {
    debounceWait: 300,
    refreshDeps: [schedule.projectID],
  });

  useEffect(() => {
    if (schedule) {
      if (schedule.accountType === 'outlook') {
        getAttendees(schedule.ID);
      } else {
        if (schedule.attendeUsers && schedule.attendeUsers.length > 0) {
          setParticipants(schedule.attendeUsers.map(item => item.chineseName));
        }
        if (schedule.organizer) {
          setOrganizer(schedule.organizer.chineseName);
        }
      }
    }
  }, [schedule, getAttendees]);

  const canEdit = schedule.permissions && schedule.permissions.includes('edit');
  const canRemove = schedule.permissions && schedule.permissions.includes('remove');

  const handleEdit = (modifyType = 0) => {
    onHide?.();
    dispatchScheduleUpdateModalOpenEvent({
      id: schedule.ID,
      modifyTime: date.unix(),
      modifyType,
    });
  };

  const handleRemove = (modifyType = 0) => {
    Modal.confirm({
      title: '确定要删除么？',
      zIndex: 2000,
      okButtonProps: {
        loading: removeLoading,
      },
      cancelButtonProps: {
        disabled: removeLoading,
      },
      onOk: async () => {
        return await runRemove(schedule.ID, modifyType, date.unix());
      },
    })
  };

  const handleTimelineEdit = (id: number, title: string) => {
    if (!id) return message.error('缺少timelineID');
    onHide?.();
    dispatchScheduleProjectModalOpenEvent({
      id,
      title,
    });
  };

  const handleOpenFiles = (id: number, title: string) => {
    onHide?.();
    dispatchScheduleFilesModalOpenEvent({
      id,
      title,
    });
  };

  return (
    <div className="w-96">
      <div className="p-4">
        <div className="text-base font-bold">
          {schedule.summary}
        </div>
        <div className="text-xs mt-3">
          {scheduleUtil.getTimeDescription(schedule, date)}
        </div>
        {schedule.reminder && !!schedule.reminder.isRepeat && (
          <div className="text-xs text-gray-400 mt-3">
            {scheduleUtil.getRepeatDescription(schedule)}
          </div>
        )}
        {schedule.location && (
          <LabelContentRow
            label="地点"
          >
            {schedule.location}
          </LabelContentRow>
        )}
        {project && (
          <Card
            size="small"
            bordered={false}
            className="bg-stone-100 mt-4"
          >
            <Row>
              <Col span={5}>
                项目名
              </Col>
              <Col span={19} className="flex justify-between">
                <Link
                  to={generatePath('/projects/:id/information', { id: project.id.toString() })}
                  className="hover:underline text-inherit"
                >
                  {project.name}
                </Link>
                <Link
                  to={generatePath('/projects/:id/meeting', { id: project.id.toString() })}
                  className="text-inherit hover:text-blue-500 ml-2"
                  title="项目会议管理"
                >
                  <ArrowRightOutlined />
                </Link>
              </Col>
              {project.profile?.code && (
                <>
                  <Col span={5}>
                    项目号
                  </Col>
                  <Col span={19}>
                    {project.profile.code}
                  </Col>
                </>
              )}
            </Row>
          </Card>
        )}
        <Row
          className="px-4 py-2 mt-4"
          align="middle"
          style={{
            border: '1px solid #ECB5C8',
            borderRadius: 8,
            background: '#FFF2F7',
          }}
        >
          <Col
            span={24}
            className="flex justify-between text-sm rounded-lg pb-1"
            style={{
              color: '#EC598C',
            }}
          >
            <span>
              会议管理
            </span>
            {project ? null : (
              <Tooltip title="还未绑定项目">
                <ExclamationCircleOutlined />
              </Tooltip>
            )}
          </Col>
          <Col flex={1}>
            <Button
              type="text"
              block
              icon={<FileProtectOutlined />}
              onClick={() => handleTimelineEdit(schedule.timelineID, `绑定项目 - ${schedule.summary}`)}
            >
              绑定项目
            </Button>
          </Col>
          <Col className="flex items-center">
            <Divider type="vertical" />
          </Col>
          <Col flex={1}>
            <Button
              type="text"
              block
              icon={<FileTextOutlined />}
              onClick={() => handleOpenFiles(schedule.timelineID, `会议文件 - ${schedule.summary}`)}
            >
              会议文件
            </Button>
          </Col>
        </Row>
        <FieldsGroup>
          {organizer && (
            <LabelContentRow
              label="组织者"
            >
              {organizer}
            </LabelContentRow>
          )}
          {participants.length > 0 && (
            <LabelContentRow
              label="参与者"
            >
              <Row gutter={8} style={{ maxHeight: 70 }} className="overflow-hidden hover:overflow-auto">
                {participants.map((item, index) => (
                  <Col key={index} style={{ width: 120 }}>
                    {item}
                  </Col>
                ))}
              </Row>
            </LabelContentRow>
          )}
        </FieldsGroup>
        {schedule.description && (
          <FieldsGroup>
            <LabelContentRow
              label="描述"
            >
              {schedule.description}
            </LabelContentRow>
          </FieldsGroup>
        )}
        {schedule.reminder && !!schedule.reminder.isRemind && (
          <FieldsGroup>
            <LabelContentRow
              label="提醒"
            >
              {scheduleUtil.getRemindDescription(schedule, date)}
            </LabelContentRow>
          </FieldsGroup>
        )}
      </div>
      {(canEdit || canRemove) && (
        <Row className="px-4 py-3 bg-stone-100">
          {canEdit && (
            <Col flex={1}>
              {schedule.reminder && schedule.reminder.isRepeat ? (
                <Dropdown
                  placement="top"
                  trigger={['click']}
                  menu={{
                    items: [
                      {
                        key: 1,
                        label: '此日程',
                        onClick: () => handleEdit(1),
                      },
                      {
                        key: 2,
                        label: '此日程及后续日程',
                        onClick: () => handleEdit(2),
                      }
                    ],
                  }}
                >
                  <Button
                    type="text"
                    block
                    icon={(<EditOutlined />)}
                  >
                    编辑
                  </Button>
                </Dropdown>
              ) : (
                <Button
                  type="text"
                  block
                  icon={(<EditOutlined />)}
                  onClick={() => handleEdit()}
                >
                  编辑
                </Button>
              )}
            </Col>
          )}
          {canRemove && (
            <Col flex={1}>
              {schedule.reminder && schedule.reminder.isRepeat ? (
                <Dropdown
                  placement="top"
                  trigger={['click']}
                  menu={{
                    items: [
                      {
                        key: 1,
                        label: '此日程',
                        onClick: () => handleRemove(1),
                      },
                      {
                        key: 2,
                        label: '此日程及后续日程',
                        onClick: () => handleRemove(2),
                      },
                      {
                        key: 3,
                        label: '所有',
                        onClick: () => handleRemove(0),
                      }
                    ],
                  }}
                >
                  <Button
                    type="text"
                    block
                    icon={(<DeleteOutlined />)}
                  >
                    删除
                  </Button>
                </Dropdown>
              ) : (
                <Button
                  type="text"
                  block
                  icon={(<DeleteOutlined />)}
                  onClick={() => handleRemove()}
                >
                  删除
                </Button>
              )}
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

type OpenEventDetail = {
  id: string;
};

const OpenEventName = 'SchedulePopoverOpen';

export const SchedulePopover: React.FC<Props> = (props) => {
  const { children, schedule, date } = props;
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (open) {
      const handle = (e: CustomEvent<OpenEventDetail>) => {
        if (id !== e.detail.id) setOpen(false);
      };
      window.addEventListener(OpenEventName, handle);
      return () => {
        window.removeEventListener(OpenEventName, handle);
      };
    }
  }, [open, id]);

  const handleHide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      const event = new CustomEvent<OpenEventDetail>(OpenEventName, {
        detail: {
          id,
        },
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <Popover
      content={(
        <SchedulePopoverContent
          schedule={schedule}
          date={date}
          onHide={handleHide}
        />
      )}
      trigger={['click']}
      overlayInnerStyle={{
        padding: 0,
        overflow: 'hidden',
      }}
      open={open}
      placement="left"
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};
