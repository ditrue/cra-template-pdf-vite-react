import { Button, Space, theme } from "antd";

type Props = {
  value?: number[];
  onChange?: (value?: number[]) => void;
};

const options = new Array(31).fill(null).map((_, index) => ({
  label: index + 1,
  value: index + 1,
}));

const DayOfMonth: React.FC<Props> = (props) => {
  const { value = [], onChange } = props;

  const { token } = theme.useToken();

  const handleChange = (v: number, active: boolean) => {
    const newValue = active ? [...value, v] : value.filter(item => item !== v);
    if (newValue.length === 0) return;
    onChange?.(newValue);
  };

  return (
    <Space className="flex-wrap" size={0}>
      {options.map(item => {
        const active = value.includes(item.value);
        return (
          <Button
            key={item.value}
            value={item.value}
            className="rounded-none w-10 px-0"
            onClick={() => handleChange(item.value, !active)}
            style={active ? {
              borderColor: token.colorPrimary,
              color: token.colorPrimaryActive,
            } : undefined}
          >
            {item.label}
          </Button>
        );
      })}
    </Space>
  );
};

export default DayOfMonth;
