import { LinkProps } from "./halSource";
import { SingleHalSource, SingleHalSourceProps } from "./singleHalSource";

export type RoleLinks = {
  self: LinkProps;
}

export type RoleProps = {
  id: number;
  name: string;
}

export type RoleHalSourceProps = SingleHalSourceProps<RoleProps & {
  _links: RoleLinks;
}>

export class RoleHalSource extends SingleHalSource<RoleHalSourceProps> implements RoleProps {
  links: RoleLinks;

  constructor(props: RoleHalSourceProps) {
    super(props);
    const { _links } = props;
    this.links = _links;
  }

  get id() {
    return this.source.id;
  }

  get name() {
    return  this.source.name;
  }
}
