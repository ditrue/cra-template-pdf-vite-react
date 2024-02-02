import { createUseStyles } from 'react-jss';

const useAntStyles = createUseStyles({
  tree: {
    '&.ant-tree .ant-tree-list .ant-tree-list-holder .ant-tree-list-holder-inner .ant-tree-treenode': {
      '& .ant-tree-indent,.ant-tree-switcher': {
        flex: 'none',
      },
      '& .ant-tree-node-content-wrapper': {
        display: 'flex',
        width: 0,
        flex: 1,
        '& .ant-tree-iconEle': {
          flex: 'none',
        },
        '& .ant-tree-title': {
          width: 0,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },

      }
    }
  }
});

export default useAntStyles;
