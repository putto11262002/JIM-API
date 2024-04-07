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
          href: "/model/women/in-town",
        },
        {
          label: "Direct Booking",
          href: "/model/women/direct-booking",
        },
        {
          label: "Local",
          href: "/model/women/local",
        },
      ],
    },
    {
      label: "Men",
      children: [
        {
          label: "In Town",
          href: "/model/men/in-town",
        },
        {
          label: "Direct Booking",
          href: "/model/men/direct-booking",
        },
        {
          label: "Local",
          href: "/model/men/local",
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
    href: "/model",
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