import { HalSource, HalSourceProps } from './halSource';

export type CollectionHalSourceProps<D> = HalSourceProps & {
  count: number;
  offset: number;
  pageSize: number;
  total: number;
} & D

export class CollectionHalSource<D = {}> extends HalSource {
  count: number;
  offset: number;
  pageSize: number;
  total: number;

  constructor(props: CollectionHalSourceProps<D>) {
    super(props);
    const { count, offset, pageSize, total } = props;
    this.count = count;
    this.offset = offset;
    this.pageSize = pageSize;
    this.total = total;
  }
}
