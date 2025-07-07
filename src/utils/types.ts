import { ElementType, ReactNode } from "react";

export type CSSTransitionPropsType = {
  show: boolean;
  enter?: string;
  enterStart?: string;
  enterEnd?: string;
  leave?: string;
  leaveStart?: string;
  leaveEnd?: string;
  appear?: boolean;
  unmountOnExit?: boolean;
  tag?: ElementType;
  children?: ReactNode;
  isInitialRender?: boolean;
  className?: string;
};

export type TransitionPropsType = CSSTransitionPropsType;
