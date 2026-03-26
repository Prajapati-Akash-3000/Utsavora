import { Outlet } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";
import MarketingFooter from "./MarketingFooter";

export default function MarketingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <MarketingHeader />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
}
