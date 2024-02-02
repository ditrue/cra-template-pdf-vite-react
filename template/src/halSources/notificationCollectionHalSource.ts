import { CollectionHalSource, CollectionHalSourceProps } from "./collectionHalSource";
import { LinkProps } from "./halSource";
import { NotificationHalSource, NotificationHalSourceProps } from "./notificationHalSource";

export type NotificationCollectionEmbedded = {
  elements: NotificationHalSourceProps[];
}

export type NotificationCollectionLinks = {
  changeSize: LinkProps;
  jumpTo: LinkProps;
  self: LinkProps;
}

export type NotificationCollectionHalSourceProps = CollectionHalSourceProps<{
  _embedded: NotificationCollectionEmbedded;
  _links: NotificationCollectionLinks;
}>

export class NotificationCollectionHalSource extends CollectionHalSource {
  links: NotificationCollectionLinks;
  list: NotificationHalSource[];

  constructor(props: NotificationCollectionHalSourceProps) {
    super(props);
    const { _embedded, _links } = props;
    this.links = _links;
    this.list = _embedded.elements.map(project => new NotificationHalSource(project));
  }

  get ids() {
    if (!this.list) return [];
    return this.list.map(item => item.id);
  }

  get workPackageIds() {
    if (!this.list) return [];
    const ids = new Set<number>();
    this.list.forEach(item => {
      if (item.wpId) {
        ids.add(item.wpId);
      }
    });
    return Array.from(ids);
  }
}
