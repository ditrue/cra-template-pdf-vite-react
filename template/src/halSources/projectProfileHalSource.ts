import { LinkProps } from "./halSource";
import { SingleHalSource, SingleHalSourceProps } from "./singleHalSource";

export type ProjectProfileProps = {
  id: number;
  project_id?: number;
  code: string;
  name: string;
  docLink: string;
}

export type ProjectProfileLinks = {
  self: LinkProps;
}

export type ProjectProfileHalSourceProps = SingleHalSourceProps<ProjectProfileProps & {
  _links: ProjectProfileLinks;
}>

export class ProjectProfileHalSource extends SingleHalSource<ProjectProfileHalSourceProps> implements ProjectProfileProps {
  links: ProjectProfileLinks;
  
  constructor(props: ProjectProfileHalSourceProps) {
    super(props);

    const { _links } = props;
    this.links = _links;
  }

  get id() {
    return this.source.id;
  }

  get project_id() {
    return this.source.project_id;
  }

  get code() {
    return this.source.code;
  }

  get name() {
    return this.source.name;
  }

  get docLink() {
    return this.source.docLink;
  }
}
