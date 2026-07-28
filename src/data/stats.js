import { MessageCircle, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

// TODO: replace with a real API call (e.g. GET /api/dashboard/stats)
export const dashboardStats = [
  {
    title: "Total Revenue",
    value: "₦4,250",
    icon: TrendingUp,
    hide: true,
  },
  {
    title: "Orders",
    value: "0",
    subtitle: "0 pending",
    icon: ShoppingCart,
    hide: false,
  },
  {
    title: "Customers",
    value: "8",
    icon: Users,
    hide: false,
  },
  {
    title: "Products",
    value: "0",
    icon: Package,
    hide: false,
  },
];

export const newMessagesIcon = MessageCircle;
export const newMessagesCount = 0;
