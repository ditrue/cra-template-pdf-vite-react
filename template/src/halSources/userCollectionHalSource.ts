import { CollectionHalSource, CollectionHalSourceProps } from "./collectionHalSource";
import { LinkProps } from "./halSource";
import { UserHalSource, UserHalSourceProps } from "./userHalSource";

export type UserCollectionEmbedded = {
  elements: UserHalSourceProps[];
}

export type UserCollectionLinks = {
  changeSize: LinkProps;
  jumpTo: LinkProps;
  self: LinkProps;
}

export type UserCollectionHalSourceProps = CollectionHalSourceProps<{
  _embedded: UserCollectionEmbedded;
  _links: UserCollectionLinks;
}>

export class UserCollectionHalSource extends CollectionHalSource<UserCollectionHalSourceProps> {
  links: UserCollectionLinks;
  list: UserHalSource[];

  constructor(props: UserCollectionHalSourceProps) {
    super(props);
    const { _links, _embedded } = props;
    this.links = _links;
    this.list = _embedded.elements.map(item => new UserHalSource(item));
  }
}
