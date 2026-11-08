/* The head term, and we are not pretending otherwise.
 *
 * "Fly fishing for beginners" is owned by Orvis, every shop in the country and
 * a wall of YouTube. This article is not going to outrank them on authority,
 * and it is not trying to: it is the HUB that answers the whole question
 * briefly and routes to the pages on this site that answer each part properly.
 * That is the honest shape for a head term on a young domain, and it does a
 * second job regardless of ranking — somebody who lands anywhere on this site
 * and is new has one page that orients them.
 *
 * NO PRICES ANYWHERE. A beginner's first question is what it costs, and the
 * answer changes by the season and the shop. Everything here points at the
 * gear articles rather than naming a figure that would be wrong within a year
 * and that nobody here has verified.
 */
export const meta = {
  slug: 'fly-fishing-for-beginners',
  title: 'Fly Fishing for Beginners',
  question: 'How do I start fly fishing?',
  description:
    'What you need, what to learn first, and what to ignore for now. An honest starting point for fly fishing, with the detail on each part a click away.',
  answer:
    'Start with a rod, reel and line bought as a matched outfit, a tapered leader, a spool of tippet, a dozen fly patterns and a licence. Learn to cast badly but consistently, to tie two knots, and to read moving water. Everything else can wait a season.',
  topic: 'basics',
  date: '2026-11-07',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'Is fly fishing hard to learn?',
      a: 'It is harder to start than spin fishing and not hard to be adequate at. Casting is the part that looks difficult and takes a few hours to become passable. The part that actually takes years is reading water and presenting a fly without drag, and nobody needs that to catch a first fish.',
    },
    {
      q: 'What do I need to start fly fishing?',
      a: 'A rod, reel and line bought together as an outfit, a tapered leader, a spool of tippet, a small box of flies, nippers, forceps and a licence for the state you are fishing. Waders are optional on most trout water in summer and are the easiest thing to defer.',
    },
    {
      q: 'Can I teach myself fly fishing?',
      a: 'Yes, and most people do. A single lesson or a half day with a guide early on is the best shortcut available, because the two mistakes beginners make — a cast that tries too hard and a fly dragging across the current — are both obvious to someone watching and invisible to the person making them.',
    },
    {
      q: 'What is the biggest mistake beginners make?',
      a: 'Fishing a dry fly because it is more fun to watch, when nothing is rising. Trout take most of their food under the surface. A beginner who fishes a weighted nymph through deeper water on an ordinary day will out-fish one waiting for a hatch that may not come.',
    },
  ],
  howTo: null,
  related: ['what-flies-do-i-need-to-start', 'how-to-set-up-a-fly-rod', 'how-to-read-water-fly-fishing'],
  relatedFlies: ['parachute-adams', 'elk-hair-caddis', 'hares-ear-nymph', 'woolly-bugger'],
  sources: [
    {
      label: 'Gink and Gasoline — 10 Types of Water That Always Hold Trout',
      url: 'https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/',
    },
    {
      label: 'Hatch Magazine — Understanding Leaders and Tippets',
      url: 'https://www.hatchmag.com/articles/understanding-leaders-and-tippets/7711248',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Buy the rod, reel and line as one matched outfit. Matching them yourself is a problem you do not need in week one.',
      'Two knots will get you fishing. A third is a luxury.',
      'A dozen fly patterns, in a few sizes each, covers a first season anywhere in North America.',
      'Nothing rising does not mean nothing feeding. Most of a trout’s food is underwater, and so is most of the fishing.',
      'The licence is not optional and the rules are not the same in two states. Check before you go, not at the car park.',
    ])}

    ${b.section('What do you actually need to start?', `
      <p>
        Less than the shop will show you, and the list has not changed much in fifty years. A rod,
        a reel, a line, something to join the line to the fly, some flies, and permission to fish.
      </p>
      ${b.table(
        ['What', 'Why', 'Can it wait?'],
        [
          ['Rod, reel and line', 'Bought together as an "outfit", already matched and often already strung', 'No'],
          ['Tapered leader', 'Steps the thick line down to something a fish will not notice', 'No'],
          ['Tippet', 'The last section, replaced as it is used up, so the leader lasts', 'No'],
          ['A dozen fly patterns', 'A few sizes of each beats a hundred patterns in one size', 'No'],
          ['Nippers and forceps', 'Cutting tippet and getting hooks out. Cheap and constantly used', 'No'],
          ['Licence', 'Required everywhere, and the rules differ by state', 'No'],
          ['Waders', 'Only needed when the water is cold or deep', '<strong>Yes</strong>'],
          ['A net', 'Kinder to the fish, and one more thing to carry', '<strong>Yes</strong>'],
          ['A vest or pack', 'A jacket with pockets works for a season', '<strong>Yes</strong>'],
        ],
      )}
      <p>
        The outfit is the one place not to improvise. A rod, reel and line that were designed to go
        together cast far better than three good pieces that were not, and a beginner cannot tell
        the difference between a bad cast and badly matched tackle. Our guide to
        <a href="/blog/what-weight-fly-rod-for-trout/">what weight rod to buy for trout</a> covers
        the one decision you do have to make, and
        <a href="/blog/how-to-set-up-a-fly-rod/">setting it up</a> covers what to do when the box
        arrives.
      </p>
      ${b.note(`
        Deferring waders is the single easiest way to start cheaper. On most trout water in summer
        you can fish from the bank or wet-wade in old trainers. See
        <a href="/blog/do-i-need-waders/">do I need waders</a> before you spend.
      `)}
    `)}

    ${b.section('What should you learn first?', `
      <p>
        In this order, because each one makes the next one easier.
      </p>
      ${b.steps([
        {
          name: 'A cast that is consistent rather than long',
          text: 'Thirty feet, repeatable, is enough to catch fish for a year. Distance is the thing beginners chase and the thing that matters least — almost all trout are caught closer than people expect.',
        },
        {
          name: 'Two knots',
          text: 'One to join tippet to leader and one to tie the fly on. That is genuinely all you need on the water, because the other junctions are tied once and left. See <a href="/blog/topics/knots/">which knot for which job</a>.',
        },
        {
          name: 'Where the fish are',
          text: 'Trout sit where food arrives and the current does not cost them anything — seams, drop-offs, the edges of fast water. <a href="/blog/how-to-read-water-fly-fishing/">Reading water</a> is the skill that separates people who catch fish from people who cast well.',
        },
        {
          name: 'A drift without drag',
          text: 'A fly pulled unnaturally across the current is refused by everything. Mending line fixes it, and it is the first genuinely technical thing worth learning.',
        },
        {
          name: 'Which fly, roughly',
          text: 'Roughly is enough. Size and depth matter more than pattern — see <a href="/blog/what-flies-do-i-need-to-start/">what flies a beginner needs</a>, or answer <a href="/what-fly-to-use/">three questions about the water</a> and we will narrow it.',
        },
      ])}
    `)}

    ${b.section('How long before you catch something?', `
      <p>
        Honestly: it depends far more on where you go than on how good you are. A stocked river in
        spring will give a beginner fish on day one. A hard wild trout stream can take a season, and
        plenty of people quit on one of those believing the problem was them.
      </p>
      <p>
        If you can arrange it, go somewhere easy first. The point of the first few trips is to learn
        what a take feels like and what a fish does when it is hooked, and you cannot learn either
        on water that does not produce.
      </p>
      ${b.warn(`
        A half day with a guide early is worth more than any piece of gear at the same price. The
        two mistakes beginners make — trying to force the cast, and letting the fly drag — are both
        obvious from the bank and invisible to the person making them.
      `)}
    `)}

    ${b.section('What can you safely ignore for now?', `
      <p>
        Fly tying. Rod actions. Line tapers beyond "weight-forward floating". Anything described as
        a system. Arguments about knot strength percentages. Every one of these is a real subject
        and none of them is between you and a fish this month.
      </p>
      <p>
        The one thing not to ignore is the <a href="/blog/do-i-need-a-fishing-license/">licence</a>.
        Rules, seasons and limits differ by state and sometimes by river, and ignorance is not a
        defence anywhere. Our <a href="/fly-fishing-by-state/">state guides</a> cover what each one
        requires, what lives there and when to go.
      </p>
    `)}

    ${b.section('Where to go from here', `
      <p>
        If you want the whole of it in order, the <a href="/blog/">Virtual Guide</a> is organised by
        topic: gear, technique, knots, seasons and the practical business of licences and handling
        fish. If you would rather start with the flies, the
        <a href="/flies/">Fly-brary</a> has all 54 patterns with what each one imitates, and
        <a href="/best-flies-for-trout/">the twelve that come up most often</a> is the shortest
        useful list we can give you.
      </p>
    `)}
  `;
}
