import { LinkProps } from "./halSource";
import { ProjectHalSource, ProjectHalSourceProps } from "./projectHalSource";
import { RoleHalSource, RoleHalSourceProps } from "./roleHalSource";
import { SingleHalSource, SingleHalSourceProps } from "./singleHalSource";
import { UserHalSource, UserHalSourceProps } from "./userHalSource";

export type MembershipProps = {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export type MembershipEmbedded = {
  principal: UserHalSourceProps;
  project: ProjectHalSourceProps;
  roles: RoleHalSourceProps[];
}

export type MembershipLinks = {
  principal: LinkProps;
  project: LinkProps;
  roles: LinkProps[];
  schema: LinkProps;
  self: LinkProps;
  update: LinkProps;
  updateImmediately: LinkProps;
}

export type MembershipHalSourceProps = SingleHalSourceProps<MembershipProps & {
  _links: MembershipLinks;
  _embedded: MembershipEmbedded;
}>

export class MembershipHalSource extends SingleHalSource<MembershipHalSourceProps> implements MembershipProps {
  links: MembershipLinks;
  principal?: UserHalSource;
  project?: ProjectHalSource;
  roles?: RoleHalSource[];

  constructor(props: MembershipHalSourceProps) {
    super(props);
    const { _links, _embedded } = props;
    this.links = _links;
    if (_embedded?.principal) this.principal = new UserHalSource(_embedded.principal);
    if (_embedded?.project) this.project = new ProjectHalSource(_embedded.project);
    if (_embedded?.roles) this.roles = _embedded.roles.map(item => new RoleHalSource(item));
  }

  get id() {
    return this.source.id;
  }

  get createdAt() {
    return this.source.createdAt;
  }

  get updatedAt() {
    return this.source.updatedAt;
  }
}
