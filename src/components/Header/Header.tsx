import { AppShell } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import classes from "./Header.module.css";

export const APP_HEADER_OUTLET_NAME = "APP_HEADER_OUTLET";

export const AppHeaderOutlet = () => (
  <div id={APP_HEADER_OUTLET_NAME} style={{ flexGrow: 2 }} />
);

export const AppHeaderContent = ({ children }: PropsWithChildren) => {
  const element = document.getElementById(
    APP_HEADER_OUTLET_NAME
  ) as HTMLElement;
  return element && createPortal(children, element);
};

export default function Header() {
  const [scroll] = useWindowScroll();
  return (
    <AppShell.Header
      withBorder={false}
      className={classes.header + " " + (scroll.y > 5 && classes.scrolled)}
    >
    </AppShell.Header>
  );
}
