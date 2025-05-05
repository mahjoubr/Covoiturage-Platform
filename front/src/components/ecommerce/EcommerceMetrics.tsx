import {
  UserIcon,
  PageIcon,
  ChatIcon,
  CheckCircleIcon,
  BoltIcon,
  AlertIcon,
} from "../../icons";
import Badge, { BadgeColor } from "../ui/badge/Badge";

type Metric = {
  label: string;
  count: number;
  badgeColor: BadgeColor;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

export default function EcommerceMetrics() {
  const metrics: Metric[] = [
    { label: "Users", count: 3782, badgeColor: "success", Icon: UserIcon },
    { label: "Posts", count: 5359, badgeColor: "error", Icon: PageIcon },
    { label: "Comments", count: 2150, badgeColor: "warning", Icon: ChatIcon },
    { label: "Reviews", count: 987, badgeColor: "success", Icon: CheckCircleIcon },
    { label: "Rides", count: 1230, badgeColor: "error", Icon: BoltIcon },
    { label: "Reports", count: 56, badgeColor: "light", Icon: AlertIcon },
  ];

  return (
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 md:gap-y-8">
        {metrics.map((metric) => (
            <div
                key={metric.label}
                className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
                <metric.Icon className="text-gray-800 size-6 dark:text-white/90" />
              </div>

              <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Badge color={metric.badgeColor}>{metric.label}</Badge>
          </span>

              <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.count}
              </h4>
            </div>
        ))}
      </div>
  );
}
