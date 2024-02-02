import { HalSource, HalSourceProps } from './halSource';

export type SingleHalSourceProps<D> = HalSourceProps & D;

export class SingleHalSource<D = {}> extends HalSource {
  source: SingleHalSourceProps<D>;

  constructor(props: SingleHalSourceProps<D>) {
    super(props);
    this.source = props;
  }
}
