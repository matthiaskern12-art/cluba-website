import type { Translations } from "../lib/i18n";

const en: Translations = {
  meta: {
    title: "CLUBA — Beyond Heat. Defined by Origin.",
    description:
      "Single-origin whole dried chilies. Labeled by region, species, and harvest year. Each pod reflects soil, altitude, and drying method.",
  },

  skipLink: "Skip to content",

  nav: {
    collection: "Collection",
    process: "Process",
    reserve: "Reserve",
    langToggle: "DE",
  },

  hero: {
    tagline: "Beyond Heat. Defined by Origin.",
    archiveNumbers:
      "2025\u2013MX\u2013OAX\u2013GUA\u00a0\u00a0\u00b7\u00a0\u00a02025\u2013MX\u2013PUE\u2013ANC\u00a0\u00a0\u00b7\u00a0\u00a02025\u2013MX\u2013JAL\u2013ARB",
    archiveAriaLabel:
      "Archive numbers: 2025\u2013MX\u2013OAX\u2013GUA, 2025\u2013MX\u2013PUE\u2013ANC, 2025\u2013MX\u2013JAL\u2013ARB",
  },

  waitlistEarned: {
    label: "Three Landscapes",
    headline: "You\u2019ve just traveled 3,800 meters of altitude.",
    body: "Most dried chiles arrive stale. No origin. No harvest year. No field.\nThese are the opposite \u2014 whole, pliable, labeled to the source.\nThe first pods ship this season.",
    placeholder: "your@email.com",
    button: "Reserve a Pod",
    finePrint: "Limited to the 2025 harvest. Single-origin. Whole dried.",
    success: "Noted. You\u2019ll hear from us before the pods ship.",
  },

  collection: {
    heading: "The Collection \u2014 2025 Harvest",
    subheading:
      "Whole pods. Labeled by region, species, and harvest year. No blends.",
    available: "Available",
    imageAltSuffix: "dried chili pods",
  },

  chilies: [
    {
      name: "Guajillo",
      region: "Oaxaca Highlands",
      country: "Mexico",
      species: "Capsicum annuum",
      harvestYear: "2025",
      notes: ["Dried cherry", "Cocoa husk", "Black tea"],
      drying:
        "Laid on reed mats in highland sun. The skin tightens over ten to fourteen days.",
      use: "Sauces, broths, slow braises",
      heat: { min: 2500, max: 5000, descriptor: "Gentle warmth" },
      archiveNo: "2025\u2013MX\u2013OAX\u2013GUA",
      available: true,
      image: "/images/chilies/guajillo.png",
    },
    {
      name: "Ancho",
      region: "Puebla Highlands",
      country: "Mexico",
      species: "Capsicum annuum",
      harvestYear: "2025",
      notes: ["Raisin", "Dark chocolate", "Dried plum"],
      drying:
        "Shade-dried in open sheds. The texture stays supple. The flavor outlasts the heat.",
      use: "Moles, stews, braised vegetables",
      heat: { min: 1000, max: 2000, descriptor: "Mild warmth" },
      archiveNo: "2025\u2013MX\u2013PUE\u2013ANC",
      available: true,
      image: "/images/chilies/ancho.png",
    },
    {
      name: "Chipotle",
      region: "Sierra Norte",
      country: "Mexico",
      species: "Capsicum annuum",
      harvestYear: "2025",
      notes: ["Wood smoke", "Tamarind", "Tobacco"],
      drying:
        "Smoked over pecan and mesquite for days. The smoke becomes part of the flesh.",
      use: "Beans, marinades, long-cooked sauces",
      heat: { min: 2500, max: 8000, descriptor: "Steady warmth" },
      archiveNo: "2025\u2013MX\u2013SNO\u2013CHP",
      image: "/images/chilies/chipotle.png",
    },
    {
      name: "Chile de \u00c1rbol",
      region: "Jalisco",
      country: "Mexico",
      species: "Capsicum annuum",
      harvestYear: "2025",
      notes: ["Bright red fruit", "Toasted seed", "Sharp finish"],
      drying:
        "Dried on the branch before harvest. The heat is clean and linear.",
      use: "Salsas, chili oils, finishing heat",
      heat: { min: 15000, max: 30000, descriptor: "Direct heat" },
      archiveNo: "2025\u2013MX\u2013JAL\u2013ARB",
      image: "/images/chilies/arbol.png",
    },
  ],

  carousel: {
    prev: "Previous",
    next: "Next",
  },

  modal: {
    label: "Harvest Record",
    archiveNoLabel: "Archive No.",
    speciesLabel: "Species",
    harvestLabel: "Harvest",
    heatLabel: "Heat",
    successTitle: "Noted. Thank you.",
    successBody: "We\u2019ll reach out when this harvest is ready.",
    formIntro: "Join the waitlist for this harvest.",
    placeholder: "you@domain.com",
    button: "Reserve my place",
  },

  origins: [
    {
      id: "oaxaca",
      chili: "Guajillo",
      region: "Oaxaca Highlands",
      elevation: "1,800m",
      archiveNo: "2025\u2013MX\u2013OAX\u2013GUA",
      fieldNote:
        "The guajillo hangs in clusters like dried coral. In the Oaxacan highlands, the air thins before noon and the pods take weeks to reach their final amber. What the altitude removes \u2014 moisture, softness \u2014 the fruit concentrates into something close to leather and distant from fire.",
      imagePath: "/images/chilies/landscape-oaxaca.png",
      imageAlt: "Oaxaca highlands chili fields at dusk",
      objectPosition: "center 60%",
      accentColor: "#8B3A2A",
    },
    {
      id: "puebla",
      chili: "Ancho",
      region: "Puebla Highlands",
      elevation: "2,100m",
      archiveNo: "2025\u2013MX\u2013PUE\u2013ANC",
      fieldNote:
        "The ancho poblano begins as a poblano pepper \u2014 wide-shouldered, dark green, grown in the high valleys east of the volcano. Dried, it turns the color of aged mahogany and smells faintly of dried plum. The heat is low. The flavor is the point.",
      imagePath: "/images/chilies/landscape-puebla.png",
      imageAlt: "Puebla valley fields with Popocatépetl in distance",
      objectPosition: "center 40%",
      accentColor: "#5C3D1E",
    },
    {
      id: "jalisco",
      chili: "Chile de \u00c1rbol",
      region: "Jalisco",
      elevation: "1,400m",
      archiveNo: "2025\u2013MX\u2013JAL\u2013ARB",
      fieldNote:
        "Chile de \u00e1rbol means \u2018tree chili\u2019 \u2014 the plant grows woody, upright, almost defiant. In Jalisco the pods dry on the branch before harvest. They arrive small, bright red, and carrying a clean, linear heat that builds without the smokiness of their cousins from the north.",
      imagePath: "/images/chilies/landscape-jalisco.png",
      imageAlt: "Jalisco highlands with árbol chili plants",
      objectPosition: "center 50%",
      accentColor: "#7A2B1A",
    },
  ],

  processes: [
    {
      method: "Sun",
      mark: "\u25cb",
      description:
        "Guajillo and \u00e1rbol are laid on reed mats in direct highland sun. The drying takes 10\u201314 days. The skin pulls tight. The sugars concentrate without intervention.",
    },
    {
      method: "Shade",
      mark: "\u25d0",
      description:
        "The ancho dries slowly in covered sheds with open sides. Slower than sun, the texture stays supple. The flavor develops complexity that direct heat would burn away.",
    },
    {
      method: "Smoke",
      mark: "\u25ce",
      description:
        "Chipotle is jalape\u00f1o held over pecan and mesquite smoke for days. The heat never leaves. The smoke becomes inseparable from the flesh. It arrives tasting like memory.",
    },
  ],

  processHeading: "Field to Pod",

  kitchen: {
    label: "In Your Kitchen",
    body: "A guajillo from Oaxaca dropped into a braise is not a background note. It is the braise. It lifts the fat, defines the color, and leaves something in the bottom of the pot that tells you where it came from. This is what named origin does to a dish. It makes the source legible.",
    quote: "\u201cThe pod is the record. The dish is the listening.\u201d",
  },

  close: {
    heading: "Grown in one place. Named. Numbered. Yours.",
    packaging:
      "Paper tube. No plastic. The pods arrive whole, pliable, and sealed to the season.",
    newsletterLabel: "Field Notes \u2014 occasional dispatches from origin",
    placeholder: "your@email.com",
    button: "Subscribe",
    success: "Noted. Thank you.",
    colophon: "CLUBA \u00b7 Mexico \u00b7 2025 Harvest \u00b7 cluba.com",
    tagline: "Beyond Heat. Defined by Origin.",
  },
};

export default en;
