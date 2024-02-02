import { LinkProps } from './halSource';
import { SingleHalSource, SingleHalSourceProps } from './singleHalSource';

export type StatusLinks = {
  self: LinkProps;
}

export type StatusProps = {
  id: number;
  name: string;
  color: string;
  position: number;
  defaultDoneRatio?: number;
  isClosed: boolean;
  isDefault: boolean;
  isReadonly: boolean;
}

export type StatusHalSourceProps = SingleHalSourceProps<{
  _links: StatusLinks;
} & StatusProps>

export class StatusHalSource extends SingleHalSource<StatusHalSourceProps> implements StatusProps {
  links: StatusLinks;

  constructor(props: StatusHalSourceProps) {
    super(props);

    const { _links } = props;
    this.links = _links;    
  }

  get id() {
    return this.source.id;
  }
  get name() {
    return this.source.name;
  }
  get color() {
    return this.source.color;
  }
  get position() {
    return this.source.position;
  }
  get defaultDoneRatio() {
    return this.source.defaultDoneRatio;
  }
  get isClosed() {
    return this.source.isClosed;
  }
  get isDefault() {
    return this.source.isDefault;
  }
  get isReadonly() {
    return this.source.isReadonly;
  }
}
