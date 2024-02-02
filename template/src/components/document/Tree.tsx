import { useCallback, useMemo, useState } from "react";
import { Tree } from "antd";
import type { DirectoryTreeProps, TreeProps } from "antd/es/tree";
import { DownCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useMount, useRequest } from "ahooks";
import update from 'immutability-helper';
import { getDocuments } from "@/services";
import { useAntStyles } from "../styles";

const defaultParams = {
  page: 1,
  pageSize: 50,
};

type DocumentProps = API.DOCUMENT.ListItem & { pid?: number };

type PaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
};

type Props = {
  folderId?: number;
  folderTitle?: string;
  firstIsAll?: boolean,
  onFolderChange?: (id: number, title?: string) => void;
};

export const DocumentTree: React.FC<Props> = (props) => {
  const { folderId = 0, folderTitle, firstIsAll = false, onFolderChange } = props;

  const styles = useAntStyles();

  const [documents, setDocuments] = useState<DocumentProps[]>([]);
  const [documentsPagination, setDocumentsPagination] = useState<Record<number, PaginationProps>>({});

  const { run: runGetDocuments } = useRequest(getDocuments, {
    manual: true,
    debounceWait: 300,
    onBefore: ([id]) => {
      setDocumentsPagination((dtsPg) => {
        return update(dtsPg, {
          [id]: {
            $set: {
              ...(dtsPg[id] || { total: 0, ...defaultParams }),
              loading: true,
            }
          },
        });
      });
    },
    onSuccess: (data, [id, { page = defaultParams.page, pageSize = defaultParams.pageSize }]) => {
      const list = data.list || [];
      setDocumentsPagination((dtsPg) => {
        return update(dtsPg, {
          [id]: {
            $set: {
              total: data.total,
              page,
              pageSize,
              loading: false,
            }
          },
        });
      });
      setDocuments((dts) => {
        return update(dts, {
          $push: list.map(item => ({
            ...item,
            pid: id,
          })),
        });
      });
    },
    onError: (_e, [id]) => {
      setDocumentsPagination((dtsPg) => {
        return update(dtsPg, {
          [id]: {
            $set: {
              ...(dtsPg[id] || { total: 0, ...defaultParams }),
              loading: false,
            }
          },
        });
      });
    },
  });

  useMount(() => {
    if (folderId) {
      onFolderChange?.(folderId, folderTitle);
    }
  });

  const documentsToTreeData = useCallback((pid: number) => {
    const dts = documents.filter(item => item.pid === pid);
    const arr: DirectoryTreeProps['treeData'] = [];
    dts.forEach(item => {
      if (item.isFile) return;
      arr.push({
        key: item.ID,
        title: item.name,
        children: documentsToTreeData(item.ID),
      });
    });
    const pg = documentsPagination[pid];
    if (pg && pg.page * pg.pageSize < pg.total) {
      arr.push({
        key: `${pid}-LoadMore`,
        title: '加载更多',
        icon: pg.loading ? (<LoadingOutlined />) : (<DownCircleOutlined />),
        isLeaf: true,
        disabled: pg.loading,
      });
    }
    return arr;
  }, [documents, documentsPagination]);

  const treeData = useMemo(() => {
    if (firstIsAll) {
      return documentsToTreeData(0);
    } else if (folderId) {
      return documentsToTreeData(folderId);
    }
    return [];
  }, [documentsToTreeData, firstIsAll, folderId]);

  useMount(() => {
    if (documents.length === 0) {
      if (firstIsAll) {
        runGetDocuments(0, { ...defaultParams, page: 1 });
      } else if (folderId) {
        runGetDocuments(folderId, { ...defaultParams, page: 1 });
      }
    }
  });

  const handleExpanded: TreeProps['onExpand'] = (_keys, info) => {
    const { node, expanded } = info;
    if (expanded) {
      const pid = node.key as number;
      const pg = documentsPagination[pid];
      if (!pg) {
        runGetDocuments(node.key as number, { ...defaultParams, page: 1 });
      }
    }
  };

  const handleClick: TreeProps['onClick'] = (_e, node) => {
    if (Number.isInteger(node.key)) {
      onFolderChange?.(node.key as number, node.title?.toString());
    } else if (String(node.key).endsWith('-LoadMore')) {
      if (node.disabled) return;
      const id = Number((node.key as string).split('-')[0]);
      const pg = documentsPagination[id];
      runGetDocuments(id, { page: pg.page + 1, pageSize: pg.pageSize });
    }
  };

  return (
    <Tree.DirectoryTree
      className={styles.tree}
      height={600}
      treeData={treeData}
      selectable={false}
      onExpand={handleExpanded}
      onClick={handleClick}
    />
  );
};
