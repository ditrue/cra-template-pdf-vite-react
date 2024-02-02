import { useState } from "react";
import { DocumentTree, DocumentList as DocumentListC } from "@/components";

const DocumentList: React.FC = () => {
  const [currentFolderId, setCurrentFolderId] = useState<number>();
  const [currentFolderTitle, setCurrentFolderTitle] = useState<string>();

  const handleFolderChange = (id: number, title?: string) => {
    setCurrentFolderId(id);
    setCurrentFolderTitle(title);
  };

  return (
    <div className="flex bg-white p-4">
      <div className="w-64 flex-1 py-2 border-0 border-r border-solid border-gray-200">
        <DocumentTree
          firstIsAll
          onFolderChange={handleFolderChange}
        />
      </div>
      <div style={{ width: 'calc(100% - 256px)' }}>
        <DocumentListC
          folderId={currentFolderId}
          folderTitle={currentFolderTitle}
        />
      </div>
    </div>
  );
};

export default DocumentList;
