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
        "rounded-xl border border-border p-4 shadow-lg flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/20">
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold leading-tight">{title}</h2>
          <p className="text-sm dark:text-zinc-400">{description}</p>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Link href={href}>
          <Button variant={buttonVariant}>{buttonText}</Button>
        </Link>
      </div>
    </div>
  );
}
