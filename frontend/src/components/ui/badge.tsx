import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:opacity-60",
  {
    variants: {
      variant: {
        default: "border-border/60 bg-secondary text-foreground shadow-[inset_rgba(255,255,255,0.06)_0px_1px_0px_0px]",
        secondary: "border-[hsla(202,100%,67%,0.25)] bg-[hsla(202,100%,67%,0.15)] text-primary",
        destructive: "border-[hsla(0,100%,69%,0.25)] bg-[hsla(0,100%,69%,0.15)] text-destructive",
        outline: "border-border/60 bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
