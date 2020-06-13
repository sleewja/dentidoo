// grid entities:
// . = empty cell
// # = wall
// £ = spring
// * = cloud
// S = start
// E = end
// c = candy
// h = chocolate
// l = lollypop
// T = toothbrush
// g = gift

var standardLevels = [
  {
    name: "Edition spéciale 14 juin 2020",
    grid: [
      "##########",
      "#..£#...##",
      "#.#.#.#.##",
      "#...#...##",
      "#.###.#£##",
      "##########",
      "#£..#...##",
      "#.#.#.#.##",
      "#...#..g##",
      "#S###.#E##",
    ],
    gift: "Bonne fête papa!"
  },
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
  {
    name: "It takes two to tango",
    grid: [
      "lll.....EE",
      "llll...lll",
      "lllll....l",
      "lllllll..l",
      "lllll....l",
      "ll..T...ll",
      "l....lllll",
      "l........l",
      "Tlll....ll",
      "SSl....lll",
    ],
  },
  {
    name: "Tom & Jerry",
    grid: [
      "S.........",
      "..........",
      ".......E..",
      "..........",
      "....##....",
      "....##....",
      "..........",
      "..E.......",
      "..........",
      ".........S",
    ],
  },
  {
    name: "Romeo & Juliet",
    grid: [
      ".......lll",
      "........ll",
      "..#......l",
      "T###......",
      "#####hh...",
      ".....c....",
      "EETc#Sc...",
      "######....",
      "#.#.#...hh",
      "#.#.#...hS",
    ],
  },
  {
    name: "Météo belge",
    grid: [
      "..*.....*E",
      ".l..h.h...",
      "lhh.hhhh..",
      "h**h**Th..",
      ".h***c**h.",
      "..h*h***hh",
      "...hhh**Th",
      "..*..h**h.",
      ".*....hh..",
      "S.**...h..",
    ],
  },
  {
    name: "Roger Rabbit",
    grid: [
      "TTTTTTTTTE",
      "..........",
      ".ccccccc..",
      ".c£££££c..",
      ".c£...£c..",
      ".c£.S.£c..",
      ".c£...£c..",
      ".c£££££c..",
      ".ccccccc..",
      "..........",
    ],
  },
  {
    name: "the Daltons",
    grid: [
      "S..#...*.S",
      "...h..**ll",
      "£..#.l***£",
      "#######ccc",
      "...#EE#...",
      "...#EE#.T.",
      "...#TT#...",
      "...####ccc",
      "....£.h...",
      "S.....h..S",
    ],
  },
];

