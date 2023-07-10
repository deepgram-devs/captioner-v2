import NavBarWithLogo from "../ui/NavBarWithLogo";
import StreamBanner from "../ui/StreamBanner";

type EventLayout = {
  children?: React.ReactNode;
  eventName?: string;
  type?: "broadcast" | "viewer";
};

const EventLayout = ({ eventName, type, children }: EventLayout) => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="w-full">
      <NavBarWithLogo/>
      {(type === "broadcast") &&<StreamBanner streamName={eventName}/> }
      </div>
      <div className="w-full h-full bg-black">
        <div>
          <main className="px-8 pt-3 h-[80vh] max-w-none">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default EventLayout;
