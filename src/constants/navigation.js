import {
  Home,
  Package,
  ShoppingCart,
  Users,
  MessageCircle,
} from "lucide-react";

// Single source of truth for the app's navigation.
// Both the desktop Sidebar and the mobile tab bar read from this list.
export const NAV_ITEMS = [
  { label: "Dashboard", icon: Home },
  { label: "Products", icon: Package },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Messages", icon: MessageCircle },
];

export const NAV_LABELS = NAV_ITEMS.map((item) => item.label);
