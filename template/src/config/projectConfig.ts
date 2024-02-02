export const projectConfig = {
  types: [
    { id: 1, title: '设计总包项目—总项目' },
    { id: 2, title: '设计总包项目—分包项目' },
    { id: 3, title: '普通项目' },
  ],
  statusColors: {
    not_set: '#cccccc',
    on_track: '#00D12D',
    at_risk: '#ff8030',
    off_track: '#e73e3d',
    not_started: '#84d6e5',
    finished: '#007528',
    discontinued: '#006e8f',
  } as Record<string, string>,
};
