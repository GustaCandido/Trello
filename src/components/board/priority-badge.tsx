import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PRIORITY_META, type Priority } from "@/lib/types";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

/** Badge colorida que representa a prioridade de uma tarefa. Componente puro. */
export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const meta = PRIORITY_META[priority];
  return (
    <Badge
      className={cn("border-transparent font-semibold", meta.badgeClass, className)}
    >
      {meta.label}
    </Badge>
  );
}
