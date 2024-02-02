import { LinkProps } from './halSource';
import { SingleHalSource, SingleHalSourceProps } from './singleHalSource';

export type TypeLinks = {
  self: LinkProps;
}

export type TypeProps = {
  id: number;
  name: string;
  color: string;
  position: number;
  defaultDoneRatio?: number;
  isClosed: boolean;
  isDefault: boolean;
  isReadonly: boolean;
}

export type TypeHalSourceProps = SingleHalSourceProps<{
  _links: TypeLinks;
} & TypeProps>

export class TypeHalSource extends SingleHalSource<TypeHalSourceProps> implements TypeProps {
  links: TypeLinks;

  static colors: Record<string, string> = {
    5: '#E0E0E0',
    6: '#FCDEA2',
    7: '#BDCAF1',
    8: '#D4F0F9',
    9: '#FAB3B3',
  }

  constructor(props: TypeHalSourceProps) {
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
