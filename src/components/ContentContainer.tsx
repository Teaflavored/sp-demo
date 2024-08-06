import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export const ContentContainer = ({ children, className }: Props) => {
  return <div className={clsx("container", className)}>{children}</div>;
};
