import { View, Text, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export interface InfoRowProps extends ViewProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * InfoRow component for displaying key-value information
 * 
 * Usage:
 * ```tsx
 * <InfoRow
 *   label="Project Name"
 *   value="yanbao-eas-build"
 * />
 * ```
 */
export function InfoRow({
  label,
  value,
  icon,
  className,
  ...props
}: InfoRowProps) {
  return (
    <View
      className={cn("flex-row items-center py-3 border-b border-border", className)}
      {...props}
    >
      {icon && <View className="mr-3">{icon}</View>}
      <View className="flex-1">
        <Text className="text-sm text-muted mb-1">{label}</Text>
        <Text className="text-base text-foreground font-medium">{value}</Text>
      </View>
    </View>
  );
}
