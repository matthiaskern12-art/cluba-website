import type { Translations } from "../lib/i18n";

const de: Translations = {
  meta: {
    title: "CLUBA \u2014 Mehr als Sch\u00e4rfe. Definiert durch Herkunft.",
    description:
      "Ganze getrocknete Chilis aus einer einzigen Herkunft. Beschriftet nach Region, Art und Erntejahr. Jede Schote spiegelt Boden, H\u00f6he und Trocknungsmethode.",
  },

  skipLink: "Zum Inhalt springen",

  nav: {
    collection: "Kollektion",
    process: "Methode",
    reserve: "Vormerken",
    langToggle: "EN",
  },

  hero: {
    tagline: "Mehr als Sch\u00e4rfe. Definiert durch Herkunft.",
    archiveNumbers:
      "2025\u2013MX\u2013OAX\u2013GUA\u00a0\u00a0\u00b7\u00a0\u00a02025\u2013MX\u2013PUE\u2013ANC\u00a0\u00a0\u00b7\u00a0\u00a02025\u2013MX\u2013JAL\u2013ARB",
    archiveAriaLabel:
      "Archivnummern: 2025\u2013MX\u2013OAX\u2013GUA, 2025\u2013MX\u2013PUE\u2013ANC, 2025\u2013MX\u2013JAL\u2013ARB",
  },

  waitlistEarned: {
    label: "Drei Landschaften",
    headline: "Du hast gerade 3.800 H\u00f6henmeter zur\u00fcckgelegt.",
    body: "Die meisten getrockneten Chilis kommen alt an. Keine Herkunft. Kein Erntejahr. Kein Feld.\nDas hier ist das Gegenteil \u2014 ganz, geschmeidig, bis zur Quelle beschriftet.\nDie ersten Schoten werden in dieser Saison verschickt.",
    placeholder: "du@domain.de",
    button: "Vormerken",
    finePrint:
      "Limitiert auf die Ernte 2025. Einzelherkunft. Ganz getrocknet.",
    success:
      "Notiert. Du h\u00f6rst von uns, bevor die Schoten verschickt werden.",
  },

  collection: {
    heading: "Die Kollektion \u2014 Ernte 2025",
    subheading:
      "Ganze Schoten. Beschriftet nach Region, Art und Erntejahr. Keine Mischungen.",
    available: "Verf\u00fcgbar",
    imageAltSuffix: "getrocknete Chilischoten",
  },

  chilies: [
    {
      name: "Guajillo",
      region: "Hochland von Oaxaca",
      country: "Mexiko",
      species: "Capsicum annuum",
      harvestYear: "2025",
      notes: ["Getrocknete Kirsche", "Kakaoh\u00fclse", "Schwarzer Tee"],
      drying:
        "Auf Schilfmatten in der Hochlandsonne getrocknet. Die Haut zieht sich \u00fcber zehn bis vierzehn Tage fest.",
      use: "Saucen, Br\u00fchen, langsame Schmorgerichte",
      heat: { min: 2500, max: 5000, descriptor: "Sanfte W\u00e4rme" },
      archiveNo: "2025\u2013MX\u2013OAX\u2013GUA",
      available: true,
      image: "/images/chilies/guajillo.png",
    },
    {
      name: "Ancho",
      region: "Hochland von Puebla",
      country: "Mexiko",
      species: "Capsicum annuum",
      harvestYear: "2025",
      notes: ["Rosine", "Dunkle Schokolade", "Getrocknete Pflaume"],
      drying:
        "Im Schatten in offenen Schuppen getrocknet. Die Textur bleibt geschmeidig. Der Geschmack \u00fcberdauert die Sch\u00e4rfe.",
      use: "Mole, Eintöpfe, geschmortes Gem\u00fcse",
      heat: { min: 1000, max: 2000, descriptor: "Milde W\u00e4rme" },
      archiveNo: "2025\u2013MX\u2013PUE\u2013ANC",
      available: true,
      image: "/images/chilies/ancho.png",
    },
    {
      name: "Chipotle",
      region: "Sierra Norte",
      country: "Mexiko",
      species: "Capsicum annuum",
      harvestYear: "2025",
      notes: ["Holzrauch", "Tamarinde", "Tabak"],
      drying:
        "Tagelang \u00fcber Pekannuss und Mesquite ger\u00e4uchert. Der Rauch wird Teil des Fleisches.",
      use: "Bohnen, Marinaden, langgegarte Saucen",
      heat: { min: 2500, max: 8000, descriptor: "Gleichm\u00e4\u00dfige W\u00e4rme" },
      archiveNo: "2025\u2013MX\u2013SNO\u2013CHP",
      image: "/images/chilies/chipotle.png",
    },
    {
      name: "Chile de \u00c1rbol",
      region: "Jalisco",
      country: "Mexiko",
      species: "Capsicum annuum",
      harvestYear: "2025",
      notes: ["Leuchtende rote Frucht", "Ger\u00f6steter Samen", "Scharfer Abgang"],
      drying:
        "Vor der Ernte am Ast getrocknet. Die Sch\u00e4rfe ist sauber und linear.",
      use: "Salsas, Chili\u00f6le, abschlie\u00dfende Sch\u00e4rfe",
      heat: { min: 15000, max: 30000, descriptor: "Direkte Sch\u00e4rfe" },
      archiveNo: "2025\u2013MX\u2013JAL\u2013ARB",
      image: "/images/chilies/arbol.png",
    },
  ],

  carousel: {
    prev: "Vorherige",
    next: "N\u00e4chste",
  },

  modal: {
    label: "Ernte-Eintrag",
    archiveNoLabel: "Archiv-Nr.",
    speciesLabel: "Art",
    harvestLabel: "Ernte",
    heatLabel: "Sch\u00e4rfe",
    successTitle: "Notiert. Danke.",
    successBody: "Wir melden uns, wenn diese Ernte bereit ist.",
    formIntro: "Zur Warteliste f\u00fcr diese Ernte.",
    placeholder: "du@domain.de",
    button: "Platz sichern",
  },

  origins: [
    {
      id: "oaxaca",
      chili: "Guajillo",
      region: "Hochland von Oaxaca",
      elevation: "1.800\u202fm",
      archiveNo: "2025\u2013MX\u2013OAX\u2013GUA",
      fieldNote:
        "Der Guajillo h\u00e4ngt in B\u00fcscheln wie getrocknete Koralle. Im Hochland von Oaxaca verdünnt sich die Luft vor Mittag, und die Schoten brauchen Wochen, um ihren endg\u00fcltigen Bernstein zu erreichen. Was die H\u00f6he nimmt \u2014 Feuchtigkeit, Weichheit \u2014 konzentriert die Frucht zu etwas Lederartigem, weit entfernt von Feuer.",
      imagePath: "/images/chilies/landscape-oaxaca.png",
      imageAlt: "Chilisch\u00e4ucher im Hochland von Oaxaca bei D\u00e4mmerung",
      objectPosition: "center 60%",
      accentColor: "#8B3A2A",
    },
    {
      id: "puebla",
      chili: "Ancho",
      region: "Hochland von Puebla",
      elevation: "2.100\u202fm",
      archiveNo: "2025\u2013MX\u2013PUE\u2013ANC",
      fieldNote:
        "Der Ancho Poblano beginnt als Poblano-Pfeffer \u2014 breitschultrig, dunkelgr\u00fcn, gewachsen in den hohen T\u00e4lern \u00f6stlich des Vulkans. Getrocknet nimmt er die Farbe von gealtertem Mahagoni an und riecht schwach nach getrockneter Pflaume. Die Sch\u00e4rfe ist gering. Der Geschmack ist entscheidend.",
      imagePath: "/images/chilies/landscape-puebla.png",
      imageAlt: "Felder im Tal von Puebla mit dem Popocatépetl im Hintergrund",
      objectPosition: "center 40%",
      accentColor: "#5C3D1E",
    },
    {
      id: "jalisco",
      chili: "Chile de \u00c1rbol",
      region: "Jalisco",
      elevation: "1.400\u202fm",
      archiveNo: "2025\u2013MX\u2013JAL\u2013ARB",
      fieldNote:
        "Chile de \u00c1rbol bedeutet \u2018Baumchili\u2019 \u2014 die Pflanze w\u00e4chst holzig, aufrecht, fast trotzig. In Jalisco trocknen die Schoten vor der Ernte am Ast. Sie kommen klein, leuchtend rot an und tragen eine saubere, lineare Sch\u00e4rfe, die sich ohne die Rauchigkeit ihrer Cousins aus dem Norden aufbaut.",
      imagePath: "/images/chilies/landscape-jalisco.png",
      imageAlt: "Hochland von Jalisco mit \u00c1rbol-Chilipflanzen",
      objectPosition: "center 50%",
      accentColor: "#7A2B1A",
    },
  ],

  processes: [
    {
      method: "Sonne",
      mark: "\u25cb",
      description:
        "Guajillo und \u00c1rbol werden auf Schilfmatten unter direkter Hochlandsonne ausgelegt. Die Trocknung dauert 10\u201314\u00a0Tage. Die Haut zieht sich fest. Die Zucker konzentrieren sich ohne Eingriff.",
    },
    {
      method: "Schatten",
      mark: "\u25d0",
      description:
        "Der Ancho trocknet langsam in \u00fcberdachten Schuppen mit offenen Seiten. Langsamer als Sonne h\u00e4lt die Textur die Geschmeidigkeit. Der Geschmack entwickelt Komplexit\u00e4t, die direkte Hitze verbrennen w\u00fcrde.",
    },
    {
      method: "Rauch",
      mark: "\u25ce",
      description:
        "Chipotle ist Jalape\u00f1o, der tagelang \u00fcber Pekannuss- und Mesquite-Rauch gehalten wird. Die Sch\u00e4rfe vergeht nie. Der Rauch wird untrennbar vom Fleisch. Er kommt an mit dem Geschmack von Erinnerung.",
    },
  ],

  processHeading: "Vom Feld zur Schote",

  kitchen: {
    label: "In deiner K\u00fcche",
    body: "Ein Guajillo aus Oaxaca, in ein Schmorgericht gegeben, ist keine Hintergrundnote. Es ist das Schmorgericht. Es hebt das Fett, definiert die Farbe und hinterl\u00e4sst etwas auf dem Boden des Topfes, das dir sagt, woher es kommt. Das ist es, was benannte Herkunft mit einem Gericht macht. Die Quelle wird lesbar.",
    quote: "\u201eDie Schote ist das Dokument. Das Gericht ist das Zuh\u00f6ren.\u201c",
  },

  close: {
    heading: "An einem Ort gewachsen. Benannt. Nummeriert. Deins.",
    packaging:
      "Papierr\u00f6hre. Kein Plastik. Die Schoten kommen ganz, geschmeidig und f\u00fcr die Saison versiegelt an.",
    newsletterLabel:
      "Field Notes \u2014 gelegentliche Berichte aus den Herkunftsregionen",
    placeholder: "du@domain.de",
    button: "Abonnieren",
    success: "Notiert. Danke.",
    colophon: "CLUBA \u00b7 Mexiko \u00b7 Ernte 2025 \u00b7 cluba.com",
    tagline: "Mehr als Sch\u00e4rfe. Definiert durch Herkunft.",
  },
};

export default de;
