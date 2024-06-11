import Header from "@/app/ui/header";
import ToolList from "./ui/toolList";

export default function Template({ children }: { children: React.ReactNode }) {

    return (
        <div className="drawer lg:drawer-open">
            <input id="jugg-global-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center bg-primary-content">
                {/* Page content here */}
                <Header />
                <main className="w-full h-full overflow-auto">
                    {children}
                </main>
            </div>
            <div className="drawer-side border-r">
                <label htmlFor="jugg-global-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ToolList />
            </div>
        </div>
    )
}