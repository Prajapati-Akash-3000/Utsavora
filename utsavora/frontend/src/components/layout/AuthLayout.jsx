import { Outlet } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";

export default function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <MarketingHeader />
      <main className="flex-1 w-full relative overflow-hidden">
        <div className="relative flex items-center justify-center p-6 sm:p-10 min-h-[calc(100dvh-72px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
