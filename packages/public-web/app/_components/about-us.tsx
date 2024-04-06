import Image from "next/image";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

function AboutUs() {
  return (
    <section className="py-20 pb-10">
      <div className="container">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">About Us</h2>
            <p className="text-muted-foreground">Our mission</p>
          </div>
          <Link
            className="hidden underline items-center md:flex text-sm "
            href="/about"
          >
            Read more <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-6 md:gap-3 md:border-t">
          <div className="py-5  px-5 border-l">
            <p className="font-semibold">Nutures</p>
            <p className="mt-2 text-muted-foreground">
              We nurtures a diverse range of talent, from fresh faces to
              seasoned professionals, embracing the unique beauty of each
              individual.
            </p>
          </div>

          <div className="py-6  px-5 border-l border-t md:border-t-0">
            <p className="font-semibold">Personalize</p>
            <p className="mt-2 text-muted-foreground">
              With a tailored and personalized approach, the agency forges
              lasting relationships to meet the unique needs of both models and
              clients.
            </p>
          </div>

          <div className="py-5 2 px-5 border-l border-t md:border-t-0">
            <p className="font-semibold">Propel</p>
            <p className="mt-2 text-muted-foreground">
              propels modeling careers to new heights, unlocking doors and
              opportunities through its exceptional commitment and global reach.
            </p>
          </div>
        </div>
        <div className=" mt-6">
          <Link
            className="flex underline items-center md:hidden text-sm "
            href="/about"
          >
            Read more <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
