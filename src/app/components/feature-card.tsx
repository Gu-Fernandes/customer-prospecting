import Link from "next/link";
import { Button } from "@/components/button/button";
import { icons, type IIcons } from "@/components/icons";
import { cn } from "@/libs/cn";

type FeatureCardProps = {
  icon: IIcons;
  title: string;
  description: string;
  href: string;
  buttonText: string;
  buttonVariant?: "default" | "outline" | "ghost" | "destructive" | "icon";
  className?: string;
};

export function FeatureCard({
  icon,
  title,
  description,
  href,
  buttonText,
  buttonVariant = "default",
  className,
}: FeatureCardProps) {
  const Icon = icons[icon];

  return (
    <div
      className={cn(
        "rounded-xl border border-border p-6 shadow-lg flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold leading-tight">{title}</h2>
          <p className="text-sm dark:text-zinc-400">{description}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link href={href}>
          <Button variant={buttonVariant}>{buttonText}</Button>
        </Link>
      </div>
    </div>
  );
}
