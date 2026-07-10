export type County = {
  slug: string;
  name: string;
};

export const counties: County[] = [
  { slug: "alachua", name: "Alachua County" },
  { slug: "marion", name: "Marion County" },
  { slug: "citrus", name: "Citrus County" },
  { slug: "hernando", name: "Hernando County" },
  { slug: "sumter", name: "Sumter County" },
  { slug: "lake", name: "Lake County" },
  { slug: "levy", name: "Levy County" },
  { slug: "orange", name: "Orange County" },
  { slug: "seminole", name: "Seminole County" },
  { slug: "osceola", name: "Osceola County" },
  { slug: "volusia", name: "Volusia County" },
  { slug: "brevard", name: "Brevard County" },
];

export type City = {
  slug: string;
  name: string;
  zips: string[];
};

export const cities: City[] = [
  {
    slug: "orlando",
    name: "Orlando",
    zips: [
      "32801","32802","32803","32804","32805","32806","32807","32808","32809",
      "32810","32811","32812","32813","32814","32815","32816","32817","32818",
      "32819","32820","32821","32822","32823","32824","32825","32826","32827",
      "32828","32829","32830","32831","32832","32833","32834","32835","32836",
      "32837","32839","32853","32854","32855","32856","32857","32859","32860","32872",
    ],
  },
  {
    slug: "daytona-beach",
    name: "Daytona Beach",
    zips: ["32114","32115","32116","32117","32118","32119","32120","32124","32127","32128"],
  },
  {
    slug: "melbourne",
    name: "Melbourne",
    zips: ["32901","32902","32903","32904","32905","32906","32907","32908","32909","32934","32935"],
  },
  {
    slug: "gainesville",
    name: "Gainesville",
    zips: ["32601","32602","32603","32604","32605","32606","32607","32608","32609","32611","32612","32641","32653"],
  },
  {
    slug: "ocala",
    name: "Ocala",
    zips: ["34470","34471","34472","34473","34474","34475","34476","34479","34480","34481","34482"],
  },
  {
    slug: "kissimmee",
    name: "Kissimmee",
    zips: ["34741","34742","34743","34744","34745","34746","34747","34758","34759"],
  },
  {
    slug: "sanford",
    name: "Sanford",
    zips: ["32771","32772","32773"],
  },
  {
    slug: "leesburg",
    name: "Leesburg",
    zips: ["34748","34749"],
  },
  {
    slug: "clermont",
    name: "Clermont",
    zips: ["34711","34712","34713","34714","34715","34736"],
  },
  {
    slug: "spring-hill",
    name: "Spring Hill",
    zips: ["34606","34607","34608","34610","34611"],
  },
  {
    slug: "brooksville",
    name: "Brooksville",
    zips: ["34601","34602","34603","34604","34605","34609","34613","34614"],
  },
  {
    slug: "crystal-river",
    name: "Crystal River",
    zips: ["34423","34428","34429"],
  },
];

export type BoardType = "static" | "digital";

export type Board = {
  id: string;
  board_number: string;
  board_type: BoardType;
  weekly_impressions: number;
  size: string;
  county: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  spots: number | null;
  loop_seconds: number | null;
  location_description: string | null;
  operator: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export function countyName(slug: string): string {
  return counties.find((c) => c.slug === slug)?.name ?? slug;
}

export function cityForZip(zip: string): City | undefined {
  return cities.find((c) => c.zips.includes(zip));
}
