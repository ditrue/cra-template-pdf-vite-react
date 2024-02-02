import { CollectionHalSource, CollectionHalSourceProps } from "./collectionHalSource";
import { LinkProps } from "./halSource";
import { TypeHalSource, TypeHalSourceProps } from "./typeHalSource";

export type TypeCollectionEmbedded = {
  elements: TypeHalSourceProps[];
}

export type TypeCollectionLinks = {
  self: LinkProps;
}

export type TypeCollectionHalSourceProps = CollectionHalSourceProps<{
  _embedded: TypeCollectionEmbedded;
  _links: TypeCollectionLinks;
}>

export class TypeCollectionHalSource extends CollectionHalSource {
  links: TypeCollectionLinks;
  list: TypeHalSource[];

  constructor(props: TypeCollectionHalSourceProps) {
    super(props);
    const { _embedded, _links } = props;
    this.links = _links;
    this.list = _embedded.elements.map(project => new TypeHalSource(project));
  }
}
