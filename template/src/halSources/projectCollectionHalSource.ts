import { CollectionHalSource, CollectionHalSourceProps } from './collectionHalSource';
import { LinkProps } from './halSource';
import { ProjectHalSource, ProjectHalSourceProps, ProjectProps } from './projectHalSource';

export type ProjectCollectionEmbedded = {
  elements: ProjectHalSourceProps[];
}

export type ProjectCollectionLinks = {
  changeSize: LinkProps;
  jumpTo: LinkProps;
  representations: LinkProps[];
  self: LinkProps;
}

export type ProjectCollectionHalSourceProps = CollectionHalSourceProps<{
  _embedded: ProjectCollectionEmbedded;
  _links: ProjectCollectionLinks;
}>

export class ProjectCollectionHalSource extends CollectionHalSource<ProjectCollectionHalSourceProps> {
  links: ProjectCollectionLinks;
  list: ProjectHalSource[];
  treeList?: ProjectHalSource[];

  constructor(props: ProjectCollectionHalSourceProps) {
    super(props);
    const { _embedded, _links } = props;
    this.links = _links;
    this.list = _embedded.elements.map(project => new ProjectHalSource(project));
    this.setTreeList(_embedded.elements);
  }

  setTreeList(elements: ProjectHalSourceProps[]) {
    const list = elements.map(item => new ProjectHalSource(item));
    const dList = [...list];
    const treeList = [];
    let project = list.shift();
    while (project) {
      if (project.ancestorIds.length === 0) {
        treeList.push(project);
      } else {
        // eslint-disable-next-line no-loop-func
        const inList = dList.some(item => {
          if (project?.parentId === item.id) {
            if (!item.children) item.children = [];
            item.children.push(project);
            return true;
          }
          return false;
        });
        if (!inList) treeList.push(project);
      }
      project = list.shift();
    }
    this.treeList = this.sortBy(treeList, 'createdAt');
  }

  sortBy(list: ProjectHalSource[], attrName: keyof Omit<ProjectProps, 'description' | 'statusExplanation' | 'profile'>) {
    const newList = list.sort((a, b) => {
      if (a[attrName] > b[attrName]) return 1;
      if (a[attrName] < b[attrName]) return -1;
      return 0;
    });
    newList.forEach(item => {
      if (item.children) item.children = this.sortBy(item.children, attrName);
    });
    return newList;
  }
}
