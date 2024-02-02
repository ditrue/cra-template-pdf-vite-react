import { EmptyProps, Spin, SpinProps } from "antd";
import { ThEmpty } from "./ThEmpty";

type Props = {
  spin?: SpinProps;
  empty?: EmptyProps;
  loading?: boolean;
  active?: boolean;
  minHeight?: number;
}

export const ThSpinWithEmpty: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {
    spin,
    empty,
    loading,
    active,
    children,
    minHeight = 320,
  } = props;

  return (
    <Spin {...spin} spinning={loading}>
      {active ? children : (
        <div
          className="flex justify-center items-center"
          style={{ height: minHeight }}
        >
          <ThEmpty
            {...empty}
          />
        </div>
      )}
    </Spin>
  );
};
