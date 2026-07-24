import { cn } from "@/utils/cn";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
