"use client";
import Link from "next/link";
import Image from "next/image";
import { useDarkMode } from "../context/darkmode/DarkModeContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useState } from "react";
import { usePathname } from "next/navigation";

type navLinkType = {
  id: string | number;
  href: string;
  Name: string;
};

gsap.registerPlugin(ScrollTrigger);

function Header() {
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
            {navLink.map(({ id, href, Name }) => (
              <li
                key={id}
                className={`nav-link ${href === navsLoc ? "font-bold" : ""}`}
              >
                <Link href={href}>{Name}</Link>
              </li>
            ))}
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
