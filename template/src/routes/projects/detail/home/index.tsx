import { ProjectHalSource } from "@/halSources";
import ProjectTimeline from './Timeline';

type Props = {
  project?: ProjectHalSource;
};

const ProjectMeeting: React.FC<Props> = (props) => {
  const { project } = props;

  return (
    <div style={{ padding: '32px 0', minHeight: 520 }}>
      <ProjectTimeline
        projectId={project?.id}
      />
    </div>
  );
};

export default ProjectMeeting;
