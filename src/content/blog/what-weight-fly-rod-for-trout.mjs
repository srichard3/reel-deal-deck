export const meta = {
  slug: 'what-weight-fly-rod-for-trout',
  title: 'What Weight Fly Rod for Trout?',
  question: 'What weight fly rod do I need for trout?',
  description:
    'A 9-foot 5-weight covers most trout fishing in North America. Here is when to go lighter, when to go heavier, and what rod length actually changes.',
  answer:
    'A 9-foot 5-weight is the standard trout rod in North America and the right first buy for almost everyone. Drop to a 3- or 4-weight for small streams and delicate dry flies; step up to a 6- or 7-weight for heavy streamers, steady wind, or bass. Buy the 5-weight first.',
  topic: 'gear',
  date: '2026-07-28',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'Is a 5-weight good for beginners?',
      a: 'Yes. A 9-foot 5-weight is the most forgiving all-round trout rod: heavy enough to turn over a weighted nymph rig or a small streamer, light enough to fish a size 16 dry fly without smashing it onto the water.',
    },
    {
      q: 'Can I use a 5-weight for bass or panfish?',
      a: 'Panfish, easily. Smallmouth bass, within reason — a 5-weight will land them but struggles to cast the bulky, wind-resistant poppers and streamers that bass fishing usually calls for. A 7- or 8-weight is the honest answer for bass.',
    },
    {
      q: 'Does rod weight have to match line weight?',
      a: 'Match them as a default: a 5-weight rod with a 5-weight line. Some anglers over-line by one weight to load the rod faster at short range, which helps on small streams. Under-lining is a specialist choice, not a beginner one.',
    },
    {
      q: 'Is a 9-foot rod too long for small creeks?',
      a: 'Often, yes. On brushy water where casts are under 25 feet and you are fishing beneath overhanging cover, a 7-foot-6-inch to 8-foot-6-inch rod is easier to work with. On open rivers, the extra length of a 9-footer helps you mend and control line.',
    },
  ],
  howTo: null,
  related: ['leader-vs-tippet', 'how-to-set-up-a-fly-rod', 'what-flies-do-i-need-to-start'],
  relatedFlies: ['woolly-bugger', 'adams', 'clouser-deep-minnow', 'griffiths-gnat'],
  sources: [
    {
      label: 'University of Kentucky — A Beginner’s Guide to Rods, Reels, and Lines',
      url: 'https://www.uky.edu/~agrdanny/flyfish/newfaq.htm',
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
      'A 9-foot 5-weight is the default trout rod in North America. If you buy one rod, buy that.',
      'Line weight is a measure of line mass, not rod stiffness. The number on the rod tells you which line it is built to cast.',
      'Go lighter (3wt&ndash;4wt) for small water and small dry flies. Go heavier (6wt&ndash;7wt) for wind, big streamers, and bigger fish.',
      'Length changes line control more than it changes power. Nine feet is the compromise almost every river rewards.',
    ])}

    ${b.section('What does "weight" actually mean on a fly rod?', `
      <p>
        The number is a line rating, not a measure of how strong or stiff the rod is. Fly line
        weights are standardised by the mass of the first 30 feet of line, so a 5-weight line
        weighs a specified amount and a 5-weight rod is built to bend correctly under that mass.
        In fly casting the line is the weight you are throwing &mdash; the fly is almost weightless,
        which is the opposite of spin fishing, where the lure carries the cast.
      </p>
      <p>
        That has a practical consequence worth internalising early: matching the numbers matters
        more than brand or price. A modest 5-weight rod with the correct 5-weight line casts well.
        An expensive rod with the wrong line does not.
      </p>
    `)}

    ${b.section('What weight fly rod should a beginner buy for trout?', `
      <p>
        A <strong>9-foot 5-weight</strong>, in a medium or medium-fast action. It is the most common
        trout setup in North America, which means it is also the setup every shop, every casting
        lesson, and every piece of advice you will read assumes you are holding.
      </p>
      <p>
        The 5-weight is a compromise, and that is exactly why it is right first. It will throw a
        size 18 dry fly on 6X tippet without wrecking the presentation, and it will still turn over
        a beadhead ${b.flyLink('woolly-bugger')} with a split shot on the leader. Neither job is what
        it does best. Both are jobs it does well enough that you can spend a season working out what
        you actually enjoy before you spend money on a second rod.
      </p>
      ${b.note(
        'If your fishing is genuinely all small brushy creeks, a 4-weight is a defensible first rod. If it is genuinely all big western rivers in wind, a 6-weight is. For anyone unsure, the 5-weight is the answer.'
      )}
    `)}

    ${b.section('Which fly rod weight for which water?', `
      ${b.table(
        ['Rod weight', 'Best for', 'Typical flies', 'Where it struggles'],
        [
          ['2wt&ndash;3wt', 'Small brushy creeks, spring creeks, panfish', 'Dry flies #16&ndash;#22, tiny nymphs', 'Any wind at all; anything weighted'],
          ['4wt', 'Small to mid rivers, dry-fly-led fishing', 'Dries #14&ndash;#20, unweighted nymphs', 'Heavy nymph rigs, streamers'],
          ['<strong>5wt</strong>', '<strong>The all-rounder. Most trout rivers and lakes</strong>', 'Almost everything from #8 to #20', 'Big articulated streamers; saltwater'],
          ['6wt', 'Bigger rivers, wind, stillwater, small streamers', 'Weighted nymph rigs, #4&ndash;#8 streamers', 'Delicate presentations to spooky fish'],
          ['7wt&ndash;8wt', 'Bass, pike, big streamers, steelhead', 'Large streamers, poppers, sink tips', 'Anything requiring finesse'],
        ]
      )}
      <p>
        The overlap is real. A 5-weight and a 6-weight will both fish most trout water competently,
        and the angler matters more than the half-step between them. Where the difference bites is at
        the extremes: a 3-weight genuinely cannot deliver a weighted
        ${b.flyLink('clouser-deep-minnow')} into a headwind, and an 8-weight genuinely cannot present
        a ${b.flyLink('griffiths-gnat')} to a sipping fish in flat water.
      </p>
    `)}

    ${b.section('Does fly rod length matter as much as weight?', `
      <p>
        Length changes what you can do with the line <em>after</em> the cast, which is where most
        fish are won or lost. A longer rod holds line off conflicting currents, mends further, and
        reaches over a fast seam to protect a drift. A shorter rod is easier to cast accurately in
        tight cover and easier to swing under branches.
      </p>
      ${b.table(
        ['Length', 'Advantage', 'Cost'],
        [
          ['7′6″&ndash;8′6″', 'Accuracy in tight brush; short-range control', 'Poor line control at distance; harder to mend'],
          ['<strong>9′</strong>', '<strong>The standard. Good mending, good reach, casts well at every range</strong>', 'Awkward on very brushy creeks'],
          ['10′&ndash;11′', 'Excellent for nymphing and reach; keeps line off the water', 'Tiring to cast all day; clumsy in cover'],
        ]
      )}
      <p>
        Nine feet is the default for the same reason 5-weight is: it is the length that is least
        wrong in the most situations. Buy a specialist length once you know which specialism you
        have.
      </p>
    `)}

    ${b.section('What about the reel and the line?', `
      <p>
        For trout, the reel is mostly a line holder. It needs to balance the rod, hold the line plus
        enough backing, and have a drag smooth enough that a good fish taking line does not get a
        jerky start. Beyond that, spending more on a trout reel buys you weight savings and looks,
        not fish.
      </p>
      <p>
        The line is the opposite. A fly line is the thing you are actually casting, and a worn,
        cracked or badly matched line will make a good rod feel broken. If you have a fixed budget
        and a decision to make, put money into the line and the leader system before the reel. What
        goes on the end of that line &mdash; leader, tippet and fly &mdash; is covered in
        <a href="/blog/leader-vs-tippet/">leader vs tippet</a>.
      </p>
      ${b.warn(
        'A "5/6" combo reel and a 5-weight line are not the same specification. Check the line box, not the reel box — the reel accommodates a range, the line is a single weight and must match the rod.'
      )}
    `)}

    ${b.section('When should you own a second fly rod?', `
      <p>
        When you can name the specific situation your 5-weight is failing at. "I keep getting blown
        off the water on the big river in the afternoon" is a reason to buy a 6-weight. "I keep
        spooking fish in that spring creek" is a reason to buy a 3-weight. "I have had this rod for
        a year" is not a reason to buy anything.
      </p>
      <p>
        The second-rod decision is almost always about matching a <em>method</em> you have started
        preferring &mdash; heavy nymphing, streamer work, tiny dries &mdash; rather than about
        upgrading. If you are not sure which method you prefer yet, read
        <a href="/blog/dry-fly-vs-nymph/">dry fly vs nymph</a> before you read another rod review.
      </p>
    `)}

    ${b.faq(meta.faqs)}
    ${b.sources(meta.sources)}
  `;
}
