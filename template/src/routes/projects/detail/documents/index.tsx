import { useState } from "react";
import { DocumentList, DocumentTree } from "@/components";

type Props = {
  project?: API.PROJECT.Detail;
};

const ProjectDocuments: React.FC<Props> = (props) => {
  const { project } = props;

  const [currentFolderId, setCurrentFolderId] = useState<number>();
  const [currentFolderTitle, setCurrentFolderTitle] = useState<string>();

  const handleFolderChange = (id: number, title?: string) => {
    setCurrentFolderId(id);
    setCurrentFolderTitle(title);
  };

  return (
    <div className="flex border border-solid border-gray-200">
      <div className="w-64 flex-1 py-2 border-0 border-r border-solid border-gray-200">
        <DocumentTree
          folderId={project?.workspaceID}
          folderTitle={project?.projectName}
          onFolderChange={handleFolderChange}
        />
      </div>
      <div style={{ width: 'calc(100% - 256px)' }}>
        <DocumentList
          folderId={currentFolderId}
          folderTitle={currentFolderTitle}
        />
      </div>
    </div>
  );
};

export default ProjectDocuments;
