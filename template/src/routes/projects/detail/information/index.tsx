import { Button, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ProjectHalSource } from '@/halSources';
import { ProjectStatus, dispatchPpmProjectUpdateModalOpenEvent } from '@/components';
import { documentUtil, onIthAnchorClick } from '@/utils';
import { getTypeTitle } from './ThProjectTypeField';

type Props = {
  project?: ProjectHalSource;
};

const ProjectInformation: React.FC<Props> = (props) => {
  const { project } = props;

  const handleUpdate = (id: number) => {
    dispatchPpmProjectUpdateModalOpenEvent({ id });
  };

  return (
    <Descriptions
      title={project?.links?.updateImmediately ? (
        <div className="flex justify-end">
          <a
            href={documentUtil.getPpmProjectSettingPath(project.id)}
            target="_blank"
            rel="noreferrer"
            onClick={onIthAnchorClick}
          >
            <Button type="primary">
              编辑
            </Button>
          </a>
        </div>
      ) : null}
      bordered
      column={1}
      labelStyle={{ width: '15%' }}
      contentStyle={{ width: '85%' }}
    >
      <Descriptions.Item label="名称">
        {project?.name}
      </Descriptions.Item>
      <Descriptions.Item label="描述">
        <div dangerouslySetInnerHTML={{ __html: project?.description.html || '' }} />
      </Descriptions.Item>
      <Descriptions.Item label="公开">
        {project?.public ? '是' : '否'}
      </Descriptions.Item>
      <Descriptions.Item label="状态">
        {project?.status && (
          <ProjectStatus
            status={project.status.code}
            title={project.status.title}
          />
        )}
      </Descriptions.Item>
      <Descriptions.Item label="状态描述">
        <div dangerouslySetInnerHTML={{ __html: project?.statusExplanation.html || '' }} />
      </Descriptions.Item>
      <Descriptions.Item label="父项目">
        {project?.parent ? project.parent.name : '无'}
      </Descriptions.Item>
      {project?.profile && (
        <>
          <Descriptions.Item label="天华项目类型">
            {getTypeTitle(project.profile.typeId)}
            {!!project.links.updateImmediately && (
              <EditOutlined
                className="text-blue-400 cursor-pointer ml-2"
                title="编辑"
                onClick={() => handleUpdate(project.id)}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="天华项目名称">
            {project.profile.name}
            {!!project.links.updateImmediately && (
              <EditOutlined
                className="text-blue-400 cursor-pointer ml-2"
                title="编辑"
                onClick={() => handleUpdate(project.id)}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="天华项目编号">
            {project.profile.code}
            {!!project.links.updateImmediately && (
              <EditOutlined
                className="text-blue-400 cursor-pointer ml-2"
                title="编辑"
                onClick={() => handleUpdate(project.id)}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="天华项目文档">
            {project.profile.docLink}
            {!!project.links.updateImmediately && (
              <EditOutlined
                className="text-blue-400 cursor-pointer ml-2"
                title="编辑"
                onClick={() => handleUpdate(project.id)}
              />
            )}
          </Descriptions.Item>
        </>
      )}
    </Descriptions>
  );
};

export default ProjectInformation;
