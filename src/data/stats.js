import { MessageCircle, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

export const dashboardStats = [
  {
    title: "Total Revenue",
    value: "₦4,250",
    subtitle: "Updated from backend",
    icon: TrendingUp,
    hide: true,
  },
  {
    title: "Orders",
    value: "12",
    subtitle: "3 pending",
    icon: ShoppingCart,
    hide: false,
  },
  {
    title: "Customers",
    value: "18",
    icon: Users,
    hide: false,
  },
  {
    title: "Products",
    value: "9",
    icon: Package,
    hide: false,
  },
];

export const newMessagesIcon = MessageCircle;
export const newMessagesCount = 3;
