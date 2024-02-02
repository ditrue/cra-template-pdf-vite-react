import { FormatTable, LinkProps } from './halSource';
import { SingleHalSource, SingleHalSourceProps } from './singleHalSource';

export type ActivityLinks = {
  self: LinkProps;
  update: LinkProps;
  user: LinkProps;
  workPackage: LinkProps;
}

export type ActivityProps = {
  id: number;
  version: number;
  comment: FormatTable;
  details: FormatTable[];
  createdAt: string;
  updatedAt: string;
}

export type ActivityHalSourceProps = SingleHalSourceProps<{
  _links: ActivityLinks;
} & ActivityProps>

export class ActivityHalSource extends SingleHalSource<ActivityHalSourceProps> implements ActivityProps {
  links: ActivityLinks;

  constructor(props: ActivityHalSourceProps) {
    super(props);
    const { _links } = props;
    this.links = _links;
  }

  get id() {
    return this.source.id;
  }

  get version() {
    return this.source.version;
  }

  get comment() {
    return this.source.comment;
  }

  get details() {
    return this.source.details;
  }

  get createdAt() {
    return this.source.createdAt;
  }

  get updatedAt() {
    return this.source.updatedAt;
  }
}
