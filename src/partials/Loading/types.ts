import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface LoadingPropsType extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  color?: string;
  loaderClass: string;
  strokeWidth?: string;
}

export type SplashScreenPropsType = {
  visible: boolean;
};
