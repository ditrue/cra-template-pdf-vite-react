export type SourceConfigProps = {
  title: string;
  name: string;
  styles: {
    primary: string;
  };
};

export const defaultSourceConfig: SourceConfigProps = {
  title: '默认',
  name: 'default',
  styles: {
    primary: '#D9D9D9',
  },
};

export const sourceConfigs: (SourceConfigProps[]) = [
  // {
  //   title: 'PPT',
  //   name: 'ppt',
  //   styles: {
  //     primary: '#99D6EA',
  //   },
  // },
  {
    title: '工作台',
    name: 'workbench',
    styles: {
      primary: '#FF6F6C',
    },
  },
  {
    title: '企业微信',
    name: 'wxwork',
    styles: {
      primary: '#3975c6',
    },
  },
];
