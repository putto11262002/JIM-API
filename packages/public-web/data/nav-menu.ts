export type NavMenuItem =
| {
    label: string;
    href: string;
  }
| {
    label: string;
    children: Extract<NavMenuItem, { label: string; href: string }>[];
  };
export const headerNavItems: NavMenuItem[] = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Women",
      href: "/model/women",
      children: [
        {
          label: "In Town",
          href: "/models/women/in-town",
        },
        {
          label: "Direct Booking",
          href: "/models/women/direct-booking",
        },
        {
          label: "Local",
          href: "/models/women/local",
        },
      ],
    },
    {
      label: "Men",
      children: [
        {
          label: "In Town",
          href: "/models/men/in-town",
        },
        {
          label: "Direct Booking",
          href: "/models/men/direct-booking",
        },
        {
          label: "Local",
          href: "/models/men/local",
        },
      ],
    },
    {
      label: "Kids",
      href: "/model/kids",
    },
    {
      label: "Diversity",
      href: "/model/diversity",
    },
    {
      label: "Contact",
      href: "/contact",
    },
    {
      label: "About",
      href: "/about",
    },
  ];


export const footerNavItems: Extract<NavMenuItem, {href: string}>[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Models",
    href: "/models",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Join Us",
    href: "/join",
  }
    
]