import { View, Text, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export interface StatusCardProps extends ViewProps {
  title: string;
  status: "success" | "warning" | "error" | "info";
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

const statusColors = {
  success: "border-success bg-success/10",
  warning: "border-warning bg-warning/10",
  error: "border-error bg-error/10",
  info: "border-primary bg-primary/10",
};

const statusTextColors = {
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-primary",
};

/**
 * StatusCard component for displaying status information
 * 
 * Usage:
 * ```tsx
 * <StatusCard
 *   title="Build Status"
 *   status="success"
 *   description="Latest build completed successfully"
 * />
 * ```
 */
export function StatusCard({
  title,
  status,
  description,
  icon,
  className,
  ...props
}: StatusCardProps) {
  return (
    <View
      className={cn(
        "rounded-2xl p-4 border-2",
        statusColors[status],
        className
      )}
      {...props}
    >
      <View className="flex-row items-center gap-3">
        {icon && <View>{icon}</View>}
        <View className="flex-1">
          <Text className={cn("text-lg font-semibold", statusTextColors[status])}>
            {title}
          </Text>
          {description && (
            <Text className="text-sm text-muted mt-1 leading-relaxed">
              {description}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
