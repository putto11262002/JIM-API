import Image from "next/image";
import Link from "next/link";
import { Users2 } from "lucide-react";

type PortfolioItem = {
  medias: Media[];
  title: string;
  description: string;
  models: Model[];
};

type Media = {
  type: "image" | "video";
  url: string;
  main?: boolean;
  profile?: boolean;
};

type Model = {
  name: string;
  id: string;
  medias: Media[];
};
const items: PortfolioItem[] = [
  {
    medias: [
      {
        type: "image",
        url: "/project1.webp",
        profile: true,
      },
    ],
    title: "Project 1",
    description: "This is a project description",
    models: [
      {
        name: "John Doe",
        id: "1",
        medias: [
          {
            type: "image",
            url: "/model1.jpeg",
            profile: true,
          },
        ],
      },
    ],
  },
  {
    medias: [
      {
        type: "image",
        url: "/project2.webp",
        profile: true,
      },
    ],
    title: "Project 2",
    description: "This is a project description",
    models: [
      {
        name: "John Doe",
        id: "2",
        medias: [
          {
            type: "image",
            url: "/model1.jpeg",
            profile: true,
          },
        ],
      },
    ],
  },
  {
    medias: [
      {
        type: "image",
        url: "/project2.webp",
        profile: true,
      },
    ],
    title: "Project 3",
    description: "This is a project description",
    models: [
      {
        name: "John Doe",
        id: "2",
        medias: [
          {
            type: "image",
            url: "/model1.jpeg",
            profile: true,
          },
        ],
      },
      {
        name: "John Doe",
        id: "2",
        medias: [
          {
            type: "image",
            url: "/model1.jpeg",
            profile: true,
          },
        ],
      },
    ],
  },
  {
    medias: [
      {
        type: "image",
        url: "/project2.webp",
        profile: true,
      },
    ],
    title: "Project 4",
    description: "This is a project description",
    models: [
      {
        name: "John Doe",
        id: "2",
        medias: [
          {
            type: "image",
            url: "/model1.jpeg",
            profile: true,
          },
        ],
      },
    ],
  },
];

function PortfolioItem(item: PortfolioItem) {
  return (
    <div className="h-[28vh] md:h-[50vh] w-[80vw] md:w-[40vw] relative rounded-2xl overflow-hidden shadow group ">
      <div className="flex flex-col justify-end absolute z-10 inset-0 w-full h-full p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-100 group-hover:bg-gradient-to-bl group-hover:from-white/0 group-hover:to-black/60">
        <h3 className="font-semibold text-lg text-white">{item.title}</h3>
        <div className="flex items-center text-gray-300 font-medium text-sm mt-1">
          <Users2 className="mr-2 w-4 h-4" />
          <p>
            {item.models.map((model, index) => (
              <>
                <Link
                  className="underline"
                  key={index}
                  href={`/model/profile/${model.id}`}
                >
                  {model.name}
                </Link>
                {index < item.models.length - 1 && <span className="">, </span>}
              </>
            ))}
          </p>
        </div>
      </div>
      <Image
        src={item.medias.find((item) => item.profile)?.url || "/project1.jpeg"}
        alt={item.title}
        fill
        className="object-cover "
      />
    </div>
  );
}

function Portfolio() {
  return (
    <section className="py-10 pt-20">
    <div className="container">
    <h2 className="text-2xl font-bold">Portfolio</h2>
      <h3 className="text-muted-foreground">Explore Our Diverse Collection of Work</h3>
    </div>
      <div className="overflow-hidden flex slide-animation-container space-x-4 mt-6">
        <div className="flex w-max slide-animation gap-4">
          {items.map((item, index) => (
            <PortfolioItem {...item} key={index} />
          ))}
        </div>
        <div className=" flex w-max slide-animation gap-4">
          {items.map((item, index) => (
            <PortfolioItem {...item} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
