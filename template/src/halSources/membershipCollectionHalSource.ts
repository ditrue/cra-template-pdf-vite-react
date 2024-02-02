import { CollectionHalSource, CollectionHalSourceProps } from "./collectionHalSource";
import { LinkProps } from "./halSource";
import { MembershipHalSource, MembershipHalSourceProps } from "./membershipHalSource";

export type MembershipCollectionEmbedded = {
  elements: MembershipHalSourceProps[];
}

export type MembershipCollectionLinks = {
  changeSize: LinkProps;
  jumpTo: LinkProps;
  self: LinkProps;
}

export type MembershipCollectionHalSourceProps = CollectionHalSourceProps<{
  _embedded: MembershipCollectionEmbedded;
  _links: MembershipCollectionLinks;
}>

export class MembershipCollectionHalSource extends CollectionHalSource {
  links: MembershipCollectionLinks;
  list: MembershipHalSource[];

  constructor(props: MembershipCollectionHalSourceProps) {
    super(props);
    const { _embedded, _links } = props;
    this.links = _links;
    this.list = _embedded.elements.map(project => new MembershipHalSource(project));
  }

  get principalNames() {
    return this.list.map(item => item.principal?.name || item.links.principal.title);
  }
}
