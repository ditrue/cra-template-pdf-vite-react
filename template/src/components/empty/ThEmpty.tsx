import { Empty, EmptyProps } from "antd";
import imgUrl from './empty.svg';

const defaultImage = (
  <img
    src={imgUrl}
    alt=""
  />
);

export const ThEmpty: React.FC<EmptyProps> = (props) => {
  const { image = defaultImage, style, imageStyle, ...otherProps } = props;

  return (
    <Empty
      {...otherProps}
      style={{ margin: 0, ...style }}
      imageStyle={{ height: 120, ...imageStyle }}
      image={image}
    />
  );
};
