import { CollectionHalSource, CollectionHalSourceProps } from "./collectionHalSource";
import { LinkProps } from "./halSource";
import { WorkPackageHalSource, WorkPackageHalSourceProps } from "./workPackageHalSource";

export type WorkPackageCollectionEmbedded = {
  elements: WorkPackageHalSourceProps[];
}

export type WorkPackageCollectionLinks = {
  changeSize: LinkProps;
  jumpTo: LinkProps;
  self: LinkProps;
}

export type WorkPackageCollectionHalSourceProps = CollectionHalSourceProps<{
  _embedded: WorkPackageCollectionEmbedded;
  _links: WorkPackageCollectionLinks;
}>

export class WorkPackageCollectionHalSource extends CollectionHalSource {
  links: WorkPackageCollectionLinks;
  list: WorkPackageHalSource[];

  constructor(props: WorkPackageCollectionHalSourceProps) {
    super(props);
    const { _embedded, _links } = props;
    this.links = _links;
    this.list = _embedded.elements.map(project => new WorkPackageHalSource(project));
  }
}
