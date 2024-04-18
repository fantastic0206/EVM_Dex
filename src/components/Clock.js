import FlipCountdown from "@rumess/react-flip-countdown";
import useAppContext from "context/AppContext";

const MyClock = () => {
  const { isDark } = useAppContext();
  return (
    <div className="flex flex-col gap-2">
      {/* <span className="text-xl text-neutral-50">
        We will launch our site within
      </span>
      <FlipCountdown
        titlePosition="bottom"
        theme={isDark ? "dark" : "light"}
        hideYear
        hideMonth
        endAt={"2023-11-25 17:00:00 UTC"} // Date/Time
      /> */}
    </div>
  );
};

export default MyClock;
