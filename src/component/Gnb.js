'use client'
import { useRouter } from "next/navigation";
import { Menu } from "semantic-ui-react";

export default function Gnb() {
  const router = useRouter();
  let activeItem;

  if (router.pathname === "/") {
    activeItem = "home";
  } else if (router.pathname === "/about") {
    activeItem = "about";
  } else if (router.pathname === "/admin") {
    activeItem = "admin";
  }
  function goLink(e, data) {
    if (data.name === "home") {
      router.push("/");
    } else if (data.name === "about") {
      router.push("/about");
    }
  }
  return (
    <Menu inverted>
      <Menu.Item name="home" active={activeItem === "home"} onClick={goLink} />
      <Menu.Item
        name="Board"
        active={activeItem === "Board"}
        onClick={() => {
          router.push("/Board");
        }}
      />
      <Menu.Item
        name="Reaserve"
        active={activeItem === "Reserve"}
        onClick={() => {
          router.push("/Reserve");
        }}
      />
      <Menu.Item
        name="Manage User"
        active={activeItem === "ManagerUser"}
        onClick={() => {
          router.push("/ManagerUser");
        }}
      />
    </Menu>
  );
}