import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const ToolList: React.FC = () => {
  const sites = [
    { key: 'ppt', title: 'PPT', description: '天华PPT', cover: 'https://picsum.photos/seed/ppt/100', link: 'https://www.baidu.com' },
    { key: 'kuzhan', title: '酷站', description: '天华酷站', cover: 'https://picsum.photos/seed/kuzhan/100', link: 'https://www.baidu.com' },
    { key: 'xiaotianshu', title: '小天书', description: '天华小天书', cover: 'https://picsum.photos/seed/xiaotianshu/100', link: 'https://www.baidu.com' },
  ];
  return (
    <div>
      <div className="flex justify-center items-center">
        <img
          className="w-16"
          src="/twlogo.png"
          alt=""
        />
        <Input
          className="ml-5 h-14 text-lg rounded-[28px] px-5 w-[700px]"
          placeholder="天问一下"
          suffix={(
            <SearchOutlined />
          )}
        />
      </div>
      <div className="bg-white p-8 rounded mt-20 min-h-[30rem] flex justify-center gap-4">
        {sites.map(item => (
          <a
            key={item.key}
            className="w-[246px] h-[110px] bg-[#F5F6F8] flex items-center rounded-[10px] px-6"
            href={item.link}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="w-12 h-12 object-cover rounded-full"
              src={item.cover}
              alt=""
            />
            <div className="ml-2">
              <div className="text-[#101820] font-bold text-xl">{item.title}</div>
              <div className="text-[#9CA3AF] text-lg">{item.description}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ToolList;
