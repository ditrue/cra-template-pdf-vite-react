import { useEffect, useState } from "react";
import { Button, Select, Space } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { projectConfig } from "@/config";

type Props = {
  typeId: number;
  loading?: boolean;
  onConfirm?: (value: number) => void;
}

export const getTypeTitle = (id?: number) => {
  const type = projectConfig.types.find(item => item.id === id);
  return type?.title || '';
};

const ThProjectTypeField: React.FC<Props> = (props) => {
  const { typeId, loading = false, onConfirm } = props;

  const [currentValue, setCurrentValue] = useState<number>();

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing) {
      setCurrentValue(typeId);
    }
  }, [editing, typeId]);

  useEffect(() => {
    if (editing && !loading) {
      const handle = (e: KeyboardEvent) => {
        if (e.code.toLowerCase() === 'escape') {
          setEditing(false);
        }
      };
      window.addEventListener('keydown', handle);
      return () => window.removeEventListener('keydown', handle);
    }
  }, [editing, loading]);

  const handleSubmit = () => {
    if (currentValue && typeId !== currentValue) onConfirm?.(currentValue);
  };

  const title = getTypeTitle(typeId);

  return (
    <span>
      {editing ? (
        <Select
          style={{ width: 200 }}
          size="small"
          value={currentValue}
          placeholder="请选择项目类型"
          options={projectConfig.types.map(item => ({
            label: item.title,
            value: item.id,
          }))}
          onChange={v => setCurrentValue(v)}
          disabled={loading}
        />
      ) : (
        <span>{title}</span>
      )}
      {!editing && (
        <Button
          type="link"
          shape="circle"
          size="small"
          onClick={() => setEditing(true)}
        >
          <EditOutlined />
        </Button>
      )}
      {editing && (
        <Space className="ml-4">
          <Button
            type="link"
            shape="circle"
            size="small"
            title="提交"
            disabled={!currentValue || typeId === currentValue}
            loading={loading}
            icon={(<CheckOutlined />)}
            onClick={handleSubmit}
          />
          <Button
            type="text"
            shape="circle"
            size="small"
            title="关闭"
            disabled={loading}
            onClick={() => setEditing(false)}
          >
            <CloseOutlined />
          </Button>
        </Space>
      )}
    </span>
  );
};

export default ThProjectTypeField;
