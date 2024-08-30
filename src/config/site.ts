export const siteConfig = {
  name: "Electra",
  url: process.env.NEXT_PUBLIC_BASEURL as string,
  ogImage: `${process.env.NEXT_PUBLIC_BASEURL}/img/logo.jpg`,
  description: "La première application de rencontre entre cinéphiles.",
  links: {
    twitter: "https://twitter.com/untilsw",
    github: "https://github.com/younes101020/Electra-v2",
  },
};

export type SiteConfig = typeof siteConfig;