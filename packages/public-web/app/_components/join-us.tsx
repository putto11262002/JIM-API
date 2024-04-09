"use client";
import { useScroll, motion, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

function JoinUs() {
  const sectionRef = useRef<HTMLSelectElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start center", "end end"],
    target: sectionRef,
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  const imageOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.6, 0.2]
  );
  const buttonOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  return (
    <section ref={sectionRef} className="h-[300vh] relative overflow-clip">
      <motion.div className="sticky top-14 h-screen w-screen bg-red z-10 overflow-hidden">
        <div className="relative h-full w-full">
          <motion.div
            style={{ opacity: imageOpacity, scale }}
            className="absolute h-full w-full flex flex-col justify-center items-center bg-red"
          >
            <motion.div className="relative h-full w-screen">
              <Image
                src={"/cover.jpeg"}
                alt="Join Us"
                className="opacity-70 object-cover"
                fill
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ opacity: buttonOpacity }}
            className="absolute h-full w-full flex flex-col justify-center items-center bg-red"
          >
            <h2 className="text-bold text-xl">Unleash your true potential</h2>
            <button className="mt-3 py-3 px-8 bg-primary rounded-3xl text-white font-medium hover:bg-white hover:text-primary hover:scale-105 transition-transform duration-75 delay-75">
              Join Us
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default JoinUs;
