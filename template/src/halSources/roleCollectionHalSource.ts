import { CollectionHalSource, CollectionHalSourceProps } from "./collectionHalSource";
import { LinkProps } from "./halSource";
import { RoleHalSource, RoleHalSourceProps } from "./roleHalSource";

export type RoleCollectionEmbedded = {
  elements: RoleHalSourceProps[];
}

export type RoleCollectionLinks = {
  changeSize: LinkProps;
  jumpTo: LinkProps;
  self: LinkProps;
}

export type RoleCollectionHalSourceProps = CollectionHalSourceProps<{
  _embedded: RoleCollectionEmbedded;
  _links: RoleCollectionLinks;
}>

export class RoleCollectionHalSource extends CollectionHalSource<RoleCollectionHalSourceProps> {
  links: RoleCollectionLinks;
  list: RoleHalSource[];

  constructor(props: RoleCollectionHalSourceProps) {
    super(props);
    const { _links, _embedded } = props;
    this.links = _links;
    this.list = _embedded.elements.map(item => new RoleHalSource(item));
  }
}
