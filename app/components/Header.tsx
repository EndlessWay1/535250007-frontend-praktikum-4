"use client";
import Link from "next/link";
import Image from "next/image";
import { useDarkMode } from "../context/darkmode/DarkModeContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../hook/useUser";
import { useCsrf } from "../context/csrf/CsrfContext";

type navLinkType = {
  id: string | number;
  href: string;
  Name: string;
};

gsap.registerPlugin(ScrollTrigger);

function Header() {
  const { user, loading } = useUser();

  const router = useRouter();

  const { csrfToken } = useCsrf();

  const navLink: navLinkType[] = [
    {
      id: "1",
      href: "/",
      Name: "Home",
    },
    {
      id: "2",
      href: "/event",
      Name: "Events",
    },
    {
      id: "3",
      href: "/contact",
      Name: "Contact Us",
    },
    {
      id: "5",
      href: "/post",
      Name: "Post Events",
    },
    {
      id: "4",
      href: "/signin",
      Name: "Log in",
    },
  ];

  const { isDark } = useDarkMode();
  const [isDrop, setIsDrop] = useState(false);

  const navsLoc = usePathname(); // replaces the useState + useEffect entirely

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#header-scroll",
          start: "top top",
          end: "bottom top",
          toggleActions: "play none none reverse",
          //   markers: true,
        },
      });

      gsap.from(".nav-link", {
        yPercent: 50,
        opacity: 0,
        duration: 0.3,
        stagger: 0.3,
      });

      tl.to("header", {
        backgroundColor: isDark ? "#121212cb" : "#efefefcb",
        ease: "power1.inOut",
        duration: 0.2,
      });
    },
    { dependencies: [isDark], revertOnUpdate: true },
  );

  const signOut = async () => {
    try {
      const response = await fetch("/api/signout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      if (!response.ok) {
        console.error("Failed to sign out");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Sign-out request failed:", error);
    }
  };

  return (
    <>
      <div id='header-scroll' className='h-10 absolute top-0 translate-5' />
      <header>
        <div id='header-title'>
          <Image
            src='/logo_gkis.png'
            alt={""}
            width={24}
            height={24}
            className={`grayscale ${isDark ? "invert" : ""}`}
          />
          <h1>GKI Perumahan Citra 1</h1>
        </div>
        <nav className={isDrop ? "inline" : "not-md:hidden"}>
          <ul>
            {navLink.map(({ id, href, Name }) => {
              if (loading && (id === "4" || id === "5")) {
                return null;
              }

              if (id === "4" && user) {
                return (
                  <li key={id} className='nav-link'>
                    <button onClick={signOut}>Sign Out</button>
                  </li>
                );
              }

              if (id === "5" && !user) {
                return null;
              }

              return (
                <li
                  key={id}
                  className={`nav-link ${href === navsLoc ? "font-bold" : ""}`}
                >
                  <Link href={href}>{Name}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          onClick={() => setIsDrop(!isDrop)}
          className='inline md:hidden absolute left-0 top-0 translate-x-4 translate-y-2'
        >
          <Image
            src='/3bar-black.png'
            width={24}
            height={24}
            alt=''
            className={isDark ? "invert" : ""}
          />
        </button>
      </header>
    </>
  );
}
export default Header;
