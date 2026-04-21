import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rounded-full bg-transparent text-foreground shadow-ray-button hover:opacity-60",
        cta: "rounded-full bg-[hsla(0,0%,100%,0.815)] text-[#18191a] shadow-ray-button transition-colors hover:bg-white",
        destructive:
          "rounded-full border border-[hsla(0,100%,69%,0.25)] bg-[hsla(0,100%,69%,0.15)] text-[hsl(var(--destructive))] shadow-ray-button hover:opacity-60",
        outline: "rounded-md border border-white/10 bg-transparent text-foreground shadow-ray-button hover:opacity-60",
        secondary: "rounded-md border border-white/10 bg-transparent text-foreground hover:opacity-60",
        ghost:
          "rounded-full bg-transparent text-muted-foreground shadow-[inset_rgba(255,255,255,0.1)_0px_1px_0px_0px] hover:text-foreground hover:opacity-60",
        link: "text-primary underline-offset-4 hover:underline hover:opacity-60",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
