/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function NavbarCustom() {
  const { push } = useRouter();
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="https://flowbite-react.com">
        <span className="self-center whitespace-nowrap text-xl font-semibold text-black dark:text-white">
          BookStore
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} href="/mybook">
          My Book
        </Navbar.Link>
        <Navbar.Link
          href="#"
          onClick={() => {
            localStorage.removeItem("token");
            push("/login");
          }}
        >
          Logout
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
