import { Link } from 'react-router-dom';
import { Button, Empty, Typography } from 'antd';
import useNotFoundStyles from './NotFound.styles';

const { Paragraph, Title } = Typography;

type Props = {
  hideBack?: boolean;
}

const NotFound: React.FC<Props> = (props) => {
  const { hideBack = false } = props;

  const styles = useNotFoundStyles();

  const description = (
    <div>
      <Title level={4}>404</Title>
      <Paragraph>对不起，你访问的页面不存在。</Paragraph>
      {!hideBack && (
        <Link to="/">
          <Button type="primary">返回首页</Button>
        </Link>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <Empty
        description={description}
      />
    </div>
  );
};

export default NotFound;
