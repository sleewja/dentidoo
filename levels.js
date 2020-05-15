// grid entities:
// . = empty cell
// # = wall
// S = start
// E = end
// c = candy
// h = chocolate
// l = lollypop
// T = toothbrush

var levels = [
/*
  {
    name: "It takes two to tango",
    grid: [
      ".........E",
      "..........",
      "..h.......",
      "..S.......",
      "..........",
      "....T.....",
      "..........",
      "c......l..",
      ".c........",
      "S.c.......",
    ],
  },
  */
  {
    name: "Un bon début",
    grid: [
      ".........E",
      "..........",
      "..h.......",
      "..........",
      "..........",
      "....T.....",
      "..........",
      "c......l..",
      ".c........",
      "S.c.......",
    ],
  },
  {
    name: "On s'échauffe",
    grid: [
      "........hE",
      "........hh",
      "..........",
      "...llll...",
      "...lTTl...",
      "...llll...",
      "..........",
      "..........",
      "..........",
      "S.........",
    ],
  },
  {
    name: "Un poil plus dur",
    grid: [
      "lchlchlchl",
      "hlchlchlch",
      "chTThlchlc",
      "lThTThlchl",
      "hlcTTEhlch",
      "cTlchlchlc",
      "lchlchlchl",
      "hlchlchlch",
      "chlchlchlc",
      "Schlchlchl",
    ],
  },
  {
    name: "Symétrie",
    grid: [
      "TTllcclETT",
      "TTllccllTT",
      "llllccllll",
      "llllccllll",
      "llllTTllll",
      "llllTTllll",
      "llllccllll",
      "llllccllll",
      "TTllccllTT",
      "STllccllTT",
    ],
  },
  {
    name: "Si près du but...",
    grid: [
      ".......llE",
      ".......Sll",
      ".........l",
      "..........",
      "...ccc....",
      "..ccTcc...",
      "..cTlTc...",
      "..ccTcc....",
      "...ccc....",
      "..........",
    ],
  },
  {
    name: "chocolate-addict",
    grid: [
      "hhhhhhhhhE",
      "hhhhhhhhhh",
      "hhhTTTThhh",
      "hhTThhhhhh",
      "hhThhhhhhh",
      "hhThhhhhhh",
      "hhTThhhhhh",
      "hhhTTTThhh",
      "hhhhhhhhhh",
      "Shhhhhhhhh",
    ],
  },
  {
    name: "aller-retour",
    grid: [
      "S..llllllE",
      "...lllllll",
      "...lllllll",
      "...lllllll",
      "...lllllll",
      "...lllllll",
      "...lllllll",
      "..........",
      "TTT.......",
      "TTT.......",
    ],
  },
  {
    name: "c'est le bocson",
    grid: [
      "TclTchllcE",
      "ccTTclcThl",
      "cTllchlcTl",
      "hTlcTlchlc",
      "lhlcTlTTll",
      "lTchllclhc",
      "clccclTclh",
      "llTchclTch",
      "hhhhclccTc",
      "SchTlTcThl",
    ],
  },
  {
    name: "Alcatraz",
    grid: [
      ".........E",
      "##h#######",
      "##.......#",
      "##.#####.#",
      "##.#lST#.#",
      "##.#lll#.#",
      "##.##T##.#",
      "##.......#",
      "#######h##",
      "######ThT#",
    ],
  },
  {
    name: "le fil d'Ariane",
    grid: [
      "........lE",
      ".########l",
      ".#cccTTT#.",
      ".hc#c#TT#.",
      "##c#.#T##.",
      "ccc#S#cch.",
      "T###.#c#h#",
      "T##Tccc#h.",
      "cTcc##h##.",
      "#####T....",
    ],
  },
];

