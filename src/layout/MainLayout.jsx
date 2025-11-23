import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import "./Sidebar.css";

const CollapsibleGroup = ({ title, group, openGroup, onToggle, children }) => {
  const isOpen = openGroup === group;

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(group);
    }
  };

  return (
    <>
      <div
        className="nav-title collapsible"
        onClick={() => onToggle(group)}
        onKeyDown={handleKeyPress}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-controls={`nav-group-${group}`}
      >
        <span className="nav-text">{title}</span>
        <span className={`arrow ${isOpen ? "open" : ""}`} aria-hidden="true">
          ▸
        </span>
      </div>
      <div
        id={`nav-group-${group}`}
        className={`collapse ${isOpen ? "show" : ""}`}
        role="region"
        aria-label={`${title} submenu`}
      >
        {children}
      </div>
    </>
  );
};

const NavLinkCustom = ({ to, children, isSubItem = false, onClick }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to || location.pathname.startsWith(to + "/");
  const linkClass = `nav-item ${isSubItem ? "sub-item" : ""} ${
    isActive ? "active" : ""
  }`;
  return (
    <Link
      className={linkClass}
      to={to}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <span className="nav-text">{children}</span>
    </Link>
  );
};

// Navigation configs
const navigationConfig = {
  dashboard: { title: "Dashboard", items: [{ label: "Home", path: "/" }] },
  devices: {
    title: "Connected Devices",
    items: [
      { label: "Connected Devices", path: "/connected-devices" },
      { label: "Mikrotiks", path: "/connected-devices/mikrotiks" },
      { label: "Add Station", path: "/connected-devices/add-station" },
    ],
  },
  hotspot: {
    title: "Hotspot",
    items: [
      { label: "Hotspot Stations", path: "/hotspot/stations" },
      { label: "Modify Hotspot", path: "/hotspot/modify-packages" },
      { label: "Compensate Clients", path: "/hotspot/compensate" },
      { label: "Generate Voucher", path: "/hotspot/compensate/generate-voucher" },
      { label: "Add Voucher Time", path: "/hotspot/compensate/add-voucher-time" },
      { label: "Update Voucher Time", path: "/hotspot/compensate/update-voucher-time" },
    ],
  },
  pppoe: {
    title: "PPPoE",
    items: [
      { label: "PPPoE", path: "/pppoe" },
      { label: "Update Time", path: "/pppoe/update-time" },
      { label: "Remove PPPoE", path: "/pppoe/remove" },
      { label: "Add PPPoE", path: "/pppoe/add" },
    ],
  },
  dtnpay: {
    title: "DTN Pay",
    items: [
      { label: "DTN Pay", path: "/dtnpay" },
      { label: "Link Account", path: "/dtnpay/link-account" },
      { label: "Add Account", path: "/dtnpay/link-account/add" },
      { label: "Remove Account", path: "/dtnpay/link-account/remove" },
      { label: "Added Accounts", path: "/dtnpay/link-account/list" },
      { label: "Test Wallet", path: "/dtnpay/test-wallet" },
      { label: "Test Payment", path: "/dtnpay/test-wallet/test" },
      { label: "API Key", path: "/dtnpay/test-wallet/apikey" },
    ],
  },
};

const staticNavigation = {
  bulksms: { title: "Bulk SMS", items: [{ label: "Bulk SMS", path: "/bulksms" }] },
  account: {
    title: "My Account",
    items: [
      { label: "Invoices", path: "/account/invoices" },
      { label: "My Profile", path: "/account/profile" },
    ],
  },
  settings: { title: "Settings", items: [{ label: "Settings", path: "/settings" }] },
};

export default function MainLayout() {
  const [openGroup, setOpenGroup] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const location = useLocation();

  // Auto-detect and open the correct navigation group based on current route
  useEffect(() => {
    const path = location.pathname;
    
    // Find which group this path belongs to
    const allGroups = { ...navigationConfig, ...staticNavigation };
    const currentGroup = Object.keys(allGroups).find(group => 
      allGroups[group].items.some(item => 
        path === item.path || path.startsWith(item.path + '/')
      )
    );
    
    setOpenGroup(currentGroup || null);
  }, [location.pathname]);

  const toggleGroup = (group) => {
    setOpenGroup((prev) => (prev === group ? null : group));
  };

  // Desktop hover behavior
  const handleMouseEnter = () => {
    if (window.innerWidth > 1024) {
      setIsSidebarVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 1024) {
      setIsSidebarVisible(false);
    }
  };

  // Mobile toggle behavior
  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarVisible((prev) => !prev);
    }
  };

  // Close sidebar when a link is clicked (for mobile)
  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarVisible(false);
    }
  };

  // Close sidebar when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const toggleButton = document.querySelector('.sidebar-toggle');
      
      if (
        window.innerWidth <= 1024 &&
        isSidebarVisible &&
        sidebar &&
        !sidebar.contains(event.target) &&
        toggleButton &&
        !toggleButton.contains(event.target)
      ) {
        setIsSidebarVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarVisible]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        // On desktop, sidebar should be visible on hover only
        setIsSidebarVisible(false);
      } else {
        // On mobile, ensure sidebar is hidden by default
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Set initial state based on screen size
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="app-shell">
      {/* Toggle button - only show when sidebar is hidden on mobile, or always on desktop for hover */}
      {(window.innerWidth <= 1024 || !isSidebarVisible) && (
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          onMouseEnter={handleMouseEnter}
          aria-label="Toggle sidebar"
          aria-expanded={isSidebarVisible}
        >
          ☰
        </button>
      )}

      <aside
        className={`sidebar ${isSidebarVisible ? "visible" : "hidden"}`}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="sidebar-nav" aria-label="Main navigation">
          <div className="nav-group">
            {/* Render collapsible groups from navigationConfig */}
            {Object.entries(navigationConfig).map(([key, config]) => (
              <CollapsibleGroup
                key={key}
                title={config.title}
                group={key}
                openGroup={openGroup}
                onToggle={toggleGroup}
              >
                {config.items.map((item, idx) => (
                  <NavLinkCustom
                    key={`${key}-${idx}`}
                    to={item.path}
                    isSubItem={true}
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </NavLinkCustom>
                ))}
              </CollapsibleGroup>
            ))}
            
            {/* Render static navigation groups */}
            {Object.entries(staticNavigation).map(([key, config]) => (
              <CollapsibleGroup
                key={key}
                title={config.title}
                group={key}
                openGroup={openGroup}
                onToggle={toggleGroup}
              >
                {config.items.map((item, idx) => (
                  <NavLinkCustom
                    key={`${key}-${idx}`}
                    to={item.path}
                    isSubItem={true}
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </NavLinkCustom>
                ))}
              </CollapsibleGroup>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}