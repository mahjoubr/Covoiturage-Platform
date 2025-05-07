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

interface Props {
  stats: {
    userCount: number;
    rideCount: number;
    postCount: number;
    reviewCount: number;
    reportCount: number;
    commentCount: number;
  };
}

export default function EcommerceMetrics({ stats }: Props) {
  if (!stats) {
    return <div className="p-4 text-gray-500 dark:text-gray-400">No stats available</div>;
  }

  const metricsConfig: Metric[] = [
    { label: "Users", count: stats.userCount ?? 0, badgeColor: "success", Icon: UserIcon },
    { label: "Posts", count: stats.postCount ?? 0, badgeColor: "error", Icon: PageIcon },
    { label: "Comments", count: stats.commentCount ?? 0, badgeColor: "warning", Icon: ChatIcon },
    { label: "Reviews", count: stats.reviewCount ?? 0, badgeColor: "success", Icon: CheckCircleIcon },
    { label: "Rides", count: stats.rideCount ?? 0, badgeColor: "error", Icon: BoltIcon },
    { label: "Reports", count: stats.reportCount ?? 0, badgeColor: "light", Icon: AlertIcon },
  ];

  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
        {metricsConfig.map((metric) => (
            <div
                key={metric.label}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
            >
              <div className="flex items-start justify-between">
                {/* Text Content */}
                <div className="space-y-3">
                  <Badge color={metric.badgeColor}>{metric.label}</Badge>
                  <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
                    {metric.count?.toLocaleString() ?? "N/A"}
                  </h3>
                </div>

                {/* Icon Container */}
                <div className={`rounded-lg p-2 transition-colors duration-300 ${
                    metric.badgeColor === "success"
                        ? "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/20" :
                        metric.badgeColor === "error"
                            ? "bg-red-100/50 text-red-600 dark:bg-red-500/20" :
                            metric.badgeColor === "warning"
                                ? "bg-amber-100/50 text-amber-600 dark:bg-amber-500/20" :
                                "bg-gray-100/50 text-gray-600 dark:bg-gray-800"
                }`}>
                  <metric.Icon className="h-6 w-6" />
                </div>
              </div>

              {/* Subtle hover effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-gray-800/20" />
            </div>
        ))}
      </div>
  );
}