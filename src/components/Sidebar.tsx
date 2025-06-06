import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Settings,
  Mail,
  FileText,
  LogOut,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface SidebarProps {
  items?: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

const defaultItems: SidebarItem[] = [
  { id: "home", label: "Home", icon: <Home size={20} /> },
  { id: "profile", label: "Profile", icon: <User size={20} /> },
  { id: "documents", label: "Documents", icon: <FileText size={20} /> },
  { id: "messages", label: "Messages", icon: <Mail size={20} /> },
  { id: "settings", label: "Settings", icon: <Settings size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  items = defaultItems,
  collapsed: controlledCollapsed,
  onToggle,
  className = "",
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.onClick) {
      item.onClick();
    } else {
      console.log(`Clicked ${item.label}`);
    }
  };

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col fixed z-50 h-screen ${
        isCollapsed ? "w-16" : "w-64"
      } ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h2 className="text-xl font-bold">Dashboard</h2>
          </div>
        )}
        <button
          onClick={handleToggle}
          className="p-1 rounded-md hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-left ${
                  isCollapsed ? "justify-center" : ""
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => console.log("Logout clicked")}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition-colors text-left ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
