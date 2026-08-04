export const meta = {
  slug: 'best-fly-fishing-knots',
  title: 'The 4 Fly Fishing Knots You Need',
  question: 'Which fly fishing knots do I actually need to know?',
  description:
    'Four knots rig an entire fly outfit: arbor, nail knot or loop-to-loop, double surgeon’s, and a tippet-to-fly knot. How to tie each, and which to learn first.',
  answer:
    'Four knots cover everything: an arbor knot for backing to reel, a nail knot or loop-to-loop for line to leader, a double surgeon’s knot for leader to tippet, and an improved clinch or double davy for tippet to fly. Learn the last two first — you tie them every trip.',
  topic: 'knots',
  date: '2026-07-31',
  updated: null,
  readingTime: 8,
  faqs: [
    {
      q: 'What is the strongest fly fishing knot?',
      a: 'It depends on the material, the diameter and how carefully it is seated, which is why published strength tests disagree with each other. The more useful question is which knot you can tie correctly, cold and wet, in failing light — a well-tied clinch beats a badly tied anything.',
    },
    {
      q: 'Why do I have to wet a knot before pulling it tight?',
      a: 'Friction generates heat as the coils slide into place, and heat weakens monofilament and fluorocarbon. Saliva or water lubricates the coils so they seat smoothly and evenly. It costs a second and it is the single easiest way to stop losing fish.',
    },
    {
      q: 'Should I use a loop knot for streamers?',
      a: 'Often, yes. A non-slip loop knot lets a streamer or a large nymph swing freely instead of being held rigid by the tippet, which visibly improves the action of articulated and weighted flies. On small dry flies the extra bulk is not worth it.',
    },
    {
      q: 'How much line should I leave on the tag end?',
      a: 'Trim close — about a sixteenth of an inch. A long tag catches your leader on the cast and starts tangles. Cutting flush against the knot is the other extreme and risks the knot slipping, so leave a stub you can just see.',
    },
  ],
  howTo: null,
  related: ['leader-vs-tippet', 'how-to-set-up-a-fly-rod', 'dry-fly-vs-nymph'],
  relatedFlies: ['copper-john', 'elk-hair-caddis', 'woolly-bugger'],
  sources: [
    {
      label: 'Orvis News — Pro Tips: The Only Two Terminal Knots You Really Need',
      url: 'https://news.orvis.com/fly-fishing/pro-tips-the-only-two-terminal-knots-you-really-need',
    },
    {
      label: 'Troutbitten — Fifty Fly Fishing Tips #8: Use the Davy Knot',
      url: 'https://troutbitten.com/2017/09/17/fifty-fly-fishing-tips-8-use-the-davy-knot-heres-why/',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'A fly outfit has four junctions. Learn one knot for each and you never need a fifth.',
      'Two of the four — leader to tippet, and tippet to fly — get tied on the water, constantly. Those are the ones to practise at home.',
      'Wet every knot before you seat it. Dry friction is heat, and heat is where knot strength goes.',
      'Knot strength league tables disagree with each other. Reliability under your own fingers beats a percentage in a test rig.',
    ])}

    ${b.section('Which knots does a fly fishing outfit actually need?', `
      <p>
        A rigged fly rod has exactly four connections, working outward from the reel. Each one has a
        standard answer, and the whole list fits on a card.
      </p>
      ${b.table(
        ['Junction', 'Knot', 'How often you tie it', 'Difficulty'],
        [
          ['Backing → reel arbor', 'Arbor knot', 'Once per reel', 'Easy'],
          ['Fly line → leader', 'Loop-to-loop, or a nail knot', 'Every few months', 'Loop: easy. Nail: fiddly'],
          ['Leader → tippet', 'Double surgeon’s knot', 'Several times a trip', 'Easy'],
          ['Tippet → fly', 'Improved clinch, or double davy', 'Constantly', 'Easy once learned'],
        ]
      )}
      <p>
        The bottom two rows are the ones that matter. You will tie them wet-handed, in wind, with cold
        fingers, while a fish rises upstream. The top two you tie once, at a table, and forget.
      </p>
    `)}

    ${b.section('How do I tie an improved clinch knot?', `
      <p>
        The default tippet-to-fly knot, and the one most anglers learn first. It works on everything
        from 7X to 0X and on hook eyes of any size.
      </p>
      ${b.steps([
        { name: 'Thread the eye', text: 'Pass 6 to 8 inches of tippet through the hook eye.' },
        { name: 'Wrap the standing line', text: 'Twist the tag end around the standing line five times. Use four turns on heavy tippet (3X and above), six on very fine tippet.' },
        { name: 'Back through the first loop', text: 'Pass the tag end back through the small loop formed just above the hook eye.' },
        { name: 'Then through the big loop', text: 'Pass the tag end through the large loop you have just created. This second pass is the "improved" part and is what stops the knot slipping.' },
        { name: 'Wet and seat', text: 'Wet the knot, then pull the standing line steadily — not in a jerk — while holding the fly. The coils should draw down into a neat barrel against the eye.' },
        { name: 'Trim', text: 'Cut the tag about a sixteenth of an inch from the knot. Check that the coils are even and not crossed over each other; a crossed coil is a knot that will fail.' },
      ])}
      ${b.note(
        'If the coils bunch instead of seating, you pulled too fast or did not wet it. Cut it off and retie. A knot that looks wrong is wrong, and it always fails on the best fish of the day.'
      )}
    `)}

    ${b.section('What is the double davy knot, and is it better?', `
      <p>
        The davy knot is a very small, very fast tippet-to-fly knot popularised in fly fishing by
        Davy Wotton. The double davy adds one extra pass and is the version most anglers who use it
        actually fish. Its advantages are real and specific: it uses less tippet per tie, it seats
        into a tiny profile that does not crowd a small hook eye, and it can be tied in a few seconds.
      </p>
      ${b.steps([
        { name: 'Thread and cross', text: 'Pass the tag through the hook eye and lay it back across the standing line to make a simple overhand loop, with the fly hanging inside it.' },
        { name: 'Bring the tag through the loop', text: 'Pass the tag end through that loop once — this is a single davy.' },
        { name: 'Add the second pass', text: 'Pass it through the same loop a second time. That is the double davy.' },
        { name: 'Wet and pull', text: 'Wet it, then pull the standing line and the fly apart in one smooth motion so the knot rolls down and locks against the eye. Pulling the tag rather than the standing line is the usual mistake.' },
        { name: 'Trim close', text: 'The finished knot is compact enough that a long tag looks obvious. Trim it tight.' },
      ])}
      <p>
        Which to use? The clinch is more widely known and more forgiving of sloppy seating. The double
        davy is faster and smaller, which matters when you are changing a size 20
        ${b.flyLink('copper-john')} every ten minutes in a hatch. Both are strong enough to fish
        confidently.
      </p>
      <!-- TODO-CONFIRM: published knot-strength percentages for the clinch, improved clinch and
           davy family disagree substantially between test sources and testing methods. Do not state
           a figure here unless it can be attributed to a specific, named, reproducible test. -->
    `)}

    ${b.section('How do I tie a double surgeon’s knot for tippet?', `
      <p>
        The workhorse for joining two lines of similar diameter &mdash; leader to tippet, or tippet to
        tippet when you build a two-fly rig.
      </p>
      ${b.steps([
        { name: 'Overlap the two lines', text: 'Lay the leader end and the tippet alongside each other, pointing in opposite directions, overlapping by 5 or 6 inches.' },
        { name: 'Form one loop from both', text: 'Treating the doubled section as a single strand, tie a loose overhand knot — a simple loop with both strands passing through.' },
        { name: 'Pass through twice', text: 'Pass the same doubled section through the loop a second time. Two passes is a double surgeon’s; three is a triple, which is marginally stronger and bulkier.' },
        { name: 'Wet, then pull all four ends', text: 'This is the part people skip. Pull all four strands — both standing lines and both tags — evenly at the same time. Pulling only two seats the knot crooked.' },
        { name: 'Trim both tags', text: 'Cut both tags close. A tag left long on this knot will foul your leader on every other cast.' },
      ])}
      ${b.warn(
        'Do not use a surgeon’s knot to join lines more than about two X sizes apart. Joining 5X to 2X gives a knot that hinges and a joint that pulls through under load. Step down one size at a time, or use a tippet ring.'
      )}
    `)}

    ${b.section('How do I connect fly line to leader?', `
      <p>
        Almost every modern fly line ships with a welded loop at the front end, and almost every
        tapered leader ships with a loop at the butt. That makes the connection a loop-to-loop, which
        takes four seconds and needs no knot at all.
      </p>
      ${b.steps([
        { name: 'Pass loop through loop', text: 'Push the leader’s loop through the fly line’s loop.' },
        { name: 'Pass the whole leader through its own loop', text: 'Feed the far end of the leader — all nine feet of it — through its own loop, then draw it tight.' },
        { name: 'Check the shape', text: 'Correct is a square interlock, like two links of a chain. Wrong is a girth hitch, where one loop cinches around the other. A girth hitch cuts into the line and hangs up in the tip guide.' },
      ])}
      <p>
        If your line has no welded loop, the traditional answer is a nail knot &mdash; leader butt
        whipped onto the fly line over a tube or a nail. It is a neat, low-profile connection that
        passes through guides smoothly, and it is genuinely fiddly to tie by hand. A nail knot tool
        makes it a thirty-second job. Alternatively, tie a nail knot once with a short butt stub, put
        a perfection loop in the stub, and go back to loop-to-loop for every leader change afterward.
      </p>
    `)}

    ${b.section('What is an arbor knot, and when do I use it?', `
      <p>
        The knot that ties backing to the bare spool of a reel. You will tie it once per reel and
        probably never think about it again, but a slipping arbor knot spins the whole spool of line
        uselessly, so it is worth doing properly.
      </p>
      ${b.steps([
        { name: 'Pass the backing around the arbor', text: 'Take the backing around the reel’s centre spindle and bring the tag end back out.' },
        { name: 'Overhand around the standing line', text: 'Tie a simple overhand knot with the tag end around the standing line.' },
        { name: 'Overhand in the tag itself', text: 'Tie a second overhand knot in the tag end alone, an inch or so beyond the first. This acts as a stopper.' },
        { name: 'Pull tight', text: 'Pull the standing line so the first knot slides down and jams against the stopper, cinching the whole thing onto the arbor.' },
      ])}
    `)}

    ${b.section('Which knot should I learn first?', `
      <p>
        The tippet-to-fly knot, tied until you can do it without looking. Everything else can be done
        at home in good light with a video open. This one gets tied on the bank, in wind, when a
        hatch has started and the fish are eating a ${b.flyLink('elk-hair-caddis')} you have not
        managed to attach yet.
      </p>
      <p>
        Practise with heavy line, not tippet. A length of 20lb monofilament and a big hook makes the
        mechanics obvious in a way that 6X does not, and the muscle memory transfers straight down to
        the fine stuff. Ten minutes an evening for a week is genuinely enough.
      </p>
      <p>
        And check your knots by pulling them. Every one, before it goes in the water. A knot that
        fails in your hands costs you thirty seconds. The same knot failing on a fish costs you the
        fish, your fly, and often the fish's welfare too &mdash; a trout swimming off with a
        ${b.flyLink('woolly-bugger')} in its jaw is the outcome nobody wants.
      </p>
    `)}

    ${b.faq(meta.faqs)}
    ${b.sources(meta.sources)}
  `;
}
