import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Variants reproduce the GhanaComps button language (uppercase, tracked, gold)
// on top of the shared theme tokens, so shadcn Buttons match the site design.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap uppercase font-medium tracking-[0.16em] rounded-lg transition-all cursor-pointer shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-[var(--gold-hi)] hover:-translate-y-px",
        outline:
          "border border-border text-muted-foreground hover:border-foreground hover:text-foreground",
        ghost:
          "border border-[rgb(var(--gold-rgb)/0.35)] text-primary hover:bg-primary hover:text-primary-foreground",
        solid:
          "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
      },
      size: {
        default: "text-[0.62rem] px-5 py-2.5",
        sm: "text-[0.62rem] px-3.5 py-1.5",
        lg: "text-[0.65rem] px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
