import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const ContentContainer = ({ children }: Props) => {
  return <div className="container">{children}</div>;
};
