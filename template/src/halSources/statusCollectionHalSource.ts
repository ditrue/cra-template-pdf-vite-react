import { CollectionHalSource, CollectionHalSourceProps } from "./collectionHalSource";
import { LinkProps } from "./halSource";
import { StatusHalSource, StatusHalSourceProps } from "./statusHalSource";

export type StatusCollectionEmbedded = {
  elements: StatusHalSourceProps[];
}

export type StatusCollectionLinks = {
  self: LinkProps;
}

export type StatusCollectionHalSourceProps = CollectionHalSourceProps<{
  _embedded: StatusCollectionEmbedded;
  _links: StatusCollectionLinks;
}>

export class StatusCollectionHalSource extends CollectionHalSource {
  links: StatusCollectionLinks;
  list: StatusHalSource[];

  constructor(props: StatusCollectionHalSourceProps) {
    super(props);
    const { _embedded, _links } = props;
    this.links = _links;
    this.list = _embedded.elements.map(project => new StatusHalSource(project));
  }
}
