import { useSse } from "@/hooks";
import PpmNotification from "./PpmNotification";
import Schedule from "./Schedule";

const Home: React.FC = () => {
  useSse();

  return (
    <div className="flex">
      <div className="flex-none w-90 xl:w-100">
        <Schedule />
      </div>
      <div className="flex-1 ml-8">
        <PpmNotification />
      </div>
    </div>
  );
};

export default Home;
