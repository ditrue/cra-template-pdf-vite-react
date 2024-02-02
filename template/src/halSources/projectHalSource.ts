import { LinkProps } from './halSource';
import { SingleHalSource, SingleHalSourceProps } from './singleHalSource';

export type ProjectLinks = {
  self: LinkProps;
  createWorkPackage: LinkProps;
  createWorkPackageImmediately: LinkProps;
  workPackages: LinkProps;
  categories: LinkProps;
  versions: LinkProps;
  memberships: LinkProps;
  types: LinkProps;
  update?: LinkProps;
  updateImmediately?: LinkProps;
  delete: LinkProps;
  schema: LinkProps;
  status: LinkProps;
  ancestors: LinkProps[];
  parent: LinkProps;
}

export type ProjectProps = {
  id: number;
  identifier: string;
  name: string;
  active: boolean;
  public: boolean;
  description: {
    format: string;
    html: string;
    raw: string;
  };
  createdAt: string;
  updatedAt: string;
  statusExplanation: {
    format: string;
    html: string;
    raw: string;
  };
  profile?: {
    code: string;
    docLink: string;
    name: string;
    typeId: number;
  };
}

export type ProjectHalSourceProps = SingleHalSourceProps<{
  _links: ProjectLinks;
  _embedded?: ProjectEmbedded;
} & ProjectProps>;

export type ProjectEmbedded = {
  parent: ProjectHalSourceProps;
}

export class ProjectHalSource extends SingleHalSource<ProjectHalSourceProps> implements ProjectProps {
  links: ProjectLinks;
  parent?: ProjectHalSource;
  children?: ProjectHalSource[];

  constructor(props: ProjectHalSourceProps) {
    super(props);
    const { _links, _embedded } = props;
    this.links = _links;
    if (_embedded?.parent) {
      this.parent = new ProjectHalSource(_embedded.parent);
    }
  }

  get id() {
    return this.source.id;
  }

  get identifier() {
    return this.source.identifier;
  }

  get name() {
    return this.source.name;
  }

  get active() {
    return this.source.active;
  }

  get public() {
    return this.source.public;
  }

  get description() {
    return this.source.description;
  }

  get createdAt() {
    return this.source.createdAt;
  }

  get updatedAt() {
    return this.source.updatedAt;
  }

  get statusExplanation() {
    return this.source.statusExplanation;
  }

  get profile() {
    return this.source.profile;
  }

  get statusCode() {
    if (!this.links.status || !this.links.status.href) return 'no_set';
    const words = this.links.status.href.split('/');
    return words.pop();
  }

  get statusTitle() {
    return this.links.status?.title || '';
  }

  get status() {
    return {
      code: this.statusCode,
      title: this.statusTitle,
    };
  }

  get parentId() {
    const id = this.links.parent?.href?.match(/^\/api\/v3\/projects\/(\d+)/)?.[1];
    if (!id) return null;
    return Number(id);
  }

  get ancestorIds() {
    const ids: number[] = [];
    if (Array.isArray(this.links.ancestors)) {
      this.links.ancestors.forEach(item => {
        const id = item.href.match(/^\/api\/v3\/projects\/(\d+)/)?.[1];
        if (id) ids.push(Number(id));
      });
    }
    return ids;
  }
}
