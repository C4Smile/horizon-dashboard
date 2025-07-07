import { useRef, useEffect, useContext, createContext } from "react";
import { CSSTransition as ReactCSSTransition } from "react-transition-group";

// types
import { CSSTransitionPropsType, TransitionPropsType } from "./types";

const TransitionContext = createContext({
  parent: {} as CSSTransitionPropsType,
});

/**
 * useIsInitialRender
 * @returns Initial render state
 */
function useIsInitialRender() {
  const isInitialRender = useRef(true);
  useEffect(() => {
    isInitialRender.current = false;
  }, []);
  return isInitialRender.current;
}

/**
 * CSSTransition
 * @param {object} props - Props
 * @returns React component
 */
function CSSTransition(props: CSSTransitionPropsType) {
  const {
    show,
    enter = "",
    enterStart = "",
    enterEnd = "",
    leave = "",
    leaveStart = "",
    leaveEnd = "",
    appear,
    unmountOnExit,
    tag = "div",
    children,
    ...rest
  } = props;

  const enterClasses = enter.split(" ").filter((s) => s.length);
  const enterStartClasses = enterStart.split(" ").filter((s) => s.length);
  const enterEndClasses = enterEnd.split(" ").filter((s) => s.length);
  const leaveClasses = leave.split(" ").filter((s) => s.length);
  const leaveStartClasses = leaveStart.split(" ").filter((s) => s.length);
  const leaveEndClasses = leaveEnd.split(" ").filter((s) => s.length);
  const removeFromDom = unmountOnExit;

  function addClasses(node: HTMLElement, classes: string[]) {
    if (classes.length) node.classList.add(...classes);
  }

  function removeClasses(node: HTMLElement, classes: string[]) {
    if (classes.length) node.classList.remove(...classes);
  }

  const nodeRef = useRef(null);
  const Component = tag;

  return (
    <ReactCSSTransition
      appear={appear}
      nodeRef={nodeRef}
      unmountOnExit={removeFromDom}
      in={show}
      addEndListener={(done: EventListenerOrEventListenerObject) => {
        if (nodeRef.current)
          (nodeRef.current as Node).addEventListener(
            "transitionend",
            done,
            false
          );
      }}
      onEnter={() => {
        if (!removeFromDom && nodeRef.current) {
          (nodeRef.current as HTMLElement).style.display = "";
          addClasses(nodeRef.current, [...enterClasses, ...enterStartClasses]);
        }
      }}
      onEntering={() => {
        if (nodeRef.current) {
          removeClasses(nodeRef.current, enterStartClasses);
          addClasses(nodeRef.current, enterEndClasses);
        }
      }}
      onEntered={() => {
        if (nodeRef.current)
          removeClasses(nodeRef.current, [...enterEndClasses, ...enterClasses]);
      }}
      onExit={() => {
        if (nodeRef.current)
          addClasses(nodeRef.current, [...leaveClasses, ...leaveStartClasses]);
      }}
      onExiting={() => {
        if (nodeRef.current) {
          removeClasses(nodeRef.current, leaveStartClasses);
          addClasses(nodeRef.current, leaveEndClasses);
        }
      }}
      onExited={() => {
        if (!removeFromDom && nodeRef.current) {
          (nodeRef.current as HTMLElement).style.display = "none";
          removeClasses(nodeRef.current, [...leaveEndClasses, ...leaveClasses]);
        }
      }}
    >
      <Component
        ref={nodeRef}
        {...rest}
        style={{ display: !removeFromDom ? "none" : null }}
      >
        {children}
      </Component>
    </ReactCSSTransition>
  );
}

/**
 * Transition
 * @param props - Props
 * @returns React component
 */
export function Transition(props: TransitionPropsType) {
  const { show, appear, ...rest } = props;

  const { parent } = useContext(TransitionContext);
  const isInitialRender = useIsInitialRender();
  const isChild = show === undefined;

  if (isChild) {
    return (
      <CSSTransition
        appear={parent.appear || !parent.isInitialRender}
        show={parent.show}
        {...rest}
      />
    );
  }

  return (
    <TransitionContext.Provider
      value={{
        parent: {
          show,
          isInitialRender,
          appear,
        },
      }}
    >
      <CSSTransition appear={appear} show={show} {...rest} />
    </TransitionContext.Provider>
  );
}
