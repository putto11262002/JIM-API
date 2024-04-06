import Image from "next/image";
import ImageSlider from "./_components/hero";
import Portfolio from "./_components/portfolio";
import JoinUs from "./_components/join-us";
import "./_components/index.css"
import AboutUs from "./_components/about-us";

export default function Home() {
  return (
    <main>
      <ImageSlider/>
      <AboutUs/>
      <Portfolio/>
     <JoinUs/>
    </main>
  );
}
