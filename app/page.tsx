"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger, SplitText } from "gsap/all";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Home() {
  useGSAP(() => {
    const linksSplit = SplitText.create("#hero-title", {
      type: "lines, words",
    });

    const tl = gsap.timeline();
    tl.from(linksSplit.lines, { stagger: 0.3, opacity: 0, yPercent: 20 }).from(
      "#hero-ayat",
      { yPercent: 30, opacity: 0 },
    );
  });
  return (
    <>
      <div className='h-dvh flex flex-col-reverse md:flex-row items-center justify-around px-10 gap-10 md:gap-5 not-md:pt-10'>
        <div className='h-[40vh] w-[70vw] md:w-[40vw]'>
          <div id='hero-title'>
            <span className='text-text-secondary font-bold'>
              Gereja Kristen Indonesia
            </span>
            <h1 className='font-extrabold text-5xl'>Perumahan Citra 1</h1>
          </div>

          <p className='not-md:hidden mt-4' id='hero-ayat'>
            <span className='font-bold italic'>1 Timotius 4:12</span>{" "}
            &quot;Jangan seorang pun menganggap engkau rendah karena engkau
            muda. Jadilah teladan bagi orang-orang percaya, dalam perkataanmu,
            dalam tingkah lakumu, dalam kasihmu, dalam kesetiaanmu dan dalam
            kesucianmu.&quot;
          </p>
        </div>
        <Image
          width={450}
          height={450}
          src='/cross.png'
          alt=''
          className='rounded-full not-md:w-75 not-md:h-75'
        />
      </div>
    </>
  );
}
