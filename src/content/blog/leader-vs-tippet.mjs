export const meta = {
  slug: 'leader-vs-tippet',
  title: 'Leader vs Tippet Explained',
  question: 'What is the difference between leader and tippet?',
  description:
    'The leader is the tapered line between fly line and fly. Tippet is the thin end you tie the fly to. Sizes, the X system, and the rule of 3.',
  answer:
    'The leader is the tapered length of clear line between your fly line and your fly; tippet is the thin, level section at its end that you tie the fly to and replace as it shortens. Start with a 9-foot 5X tapered leader and a spool of 5X tippet.',
  topic: 'gear',
  date: '2026-07-29',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'Can I fish without tippet, just a leader?',
      a: 'Yes, and a new tapered leader already ends in tippet-diameter material. Adding tippet is what keeps the leader alive: every fly change costs a few inches, and once you have cut into the taper the leader stops turning over properly.',
    },
    {
      q: 'What does the X in 5X mean?',
      a: 'X is a diameter scale, not a strength scale. Higher X means thinner: 5X is 0.005 inches thinner than 0X. Convert with the 11-rule — diameter in thousandths of an inch equals 11 minus the X number, so 0X is 0.011in and 5X is 0.006in.',
    },
    {
      q: 'Should I use monofilament or fluorocarbon tippet?',
      a: 'Nylon monofilament for dry flies — it floats better, costs less and is more forgiving in knots. Fluorocarbon for nymphs and streamers — it sinks, resists abrasion and is harder for fish to see subsurface. Most anglers carry both.',
    },
    {
      q: 'How long should the tippet section be?',
      a: 'Start at 18 to 24 inches. Go longer, up to 3 or 4 feet, when fish are wary and you need a slack, drag-free drift. Go shorter when you are throwing weight and want the leader to turn over decisively.',
    },
  ],
  howTo: null,
  related: ['what-weight-fly-rod-for-trout', 'best-fly-fishing-knots', 'how-to-set-up-a-fly-rod'],
  relatedFlies: ['adams', 'zebra-midge', 'pheasant-tail-nymph', 'chubby-chernobyl'],
  sources: [
    {
      label: 'Hatch Magazine — Understanding Leaders and Tippets',
      url: 'https://www.hatchmag.com/articles/understanding-leaders-and-tippets/7711248',
    },
    {
      label: 'Orvis News — Pro Tips: The Only Two Terminal Knots You Really Need',
      url: 'https://news.orvis.com/fly-fishing/pro-tips-the-only-two-terminal-knots-you-really-need',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.section('What is a leader, and why is it tapered?', `
      <p>
        A leader is a length of clear monofilament or fluorocarbon that connects the thick, coloured
        fly line to the fly. It does two jobs. It hides the fly line, which is opaque and roughly the
        diameter of a shoelace, from the fish. And it transmits the energy of the cast forward so the
        fly lands last, straight, and gently.
      </p>
      <p>
        That second job is why a leader is tapered rather than level. The heavy butt section &mdash;
        typically 0.019 to 0.023 inches, about half the fly line's diameter &mdash; accepts the energy
        rolling down the line. The taper steps that energy down through a mid-section until the thin
        end has just enough momentum to straighten and drop. A level piece of line the same length
        will not do this. It will land in a pile.
      </p>
      <p>
        A standard trout leader is 9 feet: roughly 60% butt, 20% taper, 20% tippet.
      </p>
    `)}

    ${b.section('What is tippet, and why is it a separate spool?', `
      <p>
        Tippet is level (untapered) line, sold on small spools, that you tie onto the end of the
        leader. Once attached, it becomes the last 18 to 24 inches of the leader &mdash; the part the
        fly is tied to.
      </p>
      <p>
        It exists because of arithmetic. Every fly change costs you two to four inches of line. Ten
        fly changes and a 9-foot leader is a 6-foot leader, and worse, you are now tying flies onto
        the thick middle of the taper instead of the thin end. A tapered leader costs several times
        what an equivalent length of tippet does, so you sacrifice tippet and keep the leader.
      </p>
      ${b.note(
        'The practical test: if you can no longer tell where the taper ends, you have fished the leader too far down. Add a fresh tippet section, or start a new leader.'
      )}
    `)}

    ${b.section('Leader vs tippet — the differences side by side', `
      ${b.table(
        ['', 'Leader', 'Tippet'],
        [
          ['Shape', 'Tapered, thick to thin', 'Level — one diameter throughout'],
          ['Length', '7½ to 12 feet, sold as one piece', 'Sold on 30-yard spools, used 18–24in at a time'],
          ['Job', 'Transfers casting energy; turns the fly over', 'Presents the fly invisibly; absorbs wear'],
          ['Attaches to', 'Fly line, via a loop-to-loop or nail knot', 'The end of the leader, via a surgeon’s or blood knot'],
          ['Replaced', 'Every few trips, or when the taper is cut into', 'Constantly — after every few fly changes'],
          ['Labelled', 'By length and end size: "9ft 5X"', 'By size only: "5X"'],
        ]
      )}
    `)}

    ${b.section('What do X sizes mean, and which one do I need?', `
      <p>
        X is a diameter scale inherited from the days when gut leaders were drawn through dies.
        <strong>Higher X means thinner.</strong> The conversion is a subtraction: diameter in
        thousandths of an inch equals 11 minus the X number. So 5X is 0.006in and 2X is 0.009in.
      </p>
      ${b.table(
        ['Size', 'Diameter', 'Typical fly sizes', 'Typical use'],
        [
          ['0X', '0.011in', '#1/0–#2', 'Big streamers, pike, bass'],
          ['2X', '0.009in', '#6–#10', 'Streamers, large stonefly nymphs'],
          ['3X', '0.008in', '#8–#14', 'Weighted nymph rigs, big foam dries'],
          ['4X', '0.007in', '#12–#16', 'General nymphing, larger dries'],
          ['<strong>5X</strong>', '<strong>0.006in</strong>', '<strong>#14–#18</strong>', '<strong>The default all-round trout size</strong>'],
          ['6X', '0.005in', '#16–#22', 'Small dries, clear water, spooky fish'],
          ['7X', '0.004in', '#18–#24', 'Midges, flat water, technical spring creeks'],
        ]
      )}
      ${b.warn(
        'Breaking strength is <em>not</em> fixed by X size. Two 5X spools from different makers can differ by several pounds, because strength depends on the material and how it is drawn. Read the pound test on the spool; treat the X number as diameter only.'
      )}
      <p>
        The quick field method is the <strong>rule of 3</strong>: divide the hook size by 3 and round
        to the nearest X. A #15 works out at 5X; a #18 lands near 6X. It is approximate, and it is
        right often enough to fish by. A ${b.flyLink('zebra-midge')} in #20 wants 6X or 7X. A
        ${b.flyLink('chubby-chernobyl')} in #8 wants 3X, because 6X could not turn it over and would
        not survive the first fish.
      </p>
    `)}

    ${b.section('How do I attach tippet to a leader?', `
      ${b.steps([
        {
          name: 'Check what you are joining',
          text: 'Match the tippet to the leader’s end size, or step down one X. Joining 5X to 3X gives a weak, hinging knot — the diameters are too far apart for the line to grip itself.',
        },
        {
          name: 'Tie a double surgeon’s knot',
          text: 'Lay the leader end and the tippet alongside each other with 5–6 inches of overlap. Form a loop with both strands together and pass both ends through it twice. Wet it, pull all four strands evenly, then trim the tags close.',
        },
        {
          name: 'Or use a tippet ring',
          text: 'A 2mm metal ring tied to the end of the leader gives you a permanent junction point. Every tippet change then costs the tippet only, and the leader never shortens. It adds a little weight, which matters on the smallest dry flies and nowhere else.',
        },
        {
          name: 'Test it before you cast',
          text: 'Pull the joint hard between two hands. A knot that fails here would have failed on a fish, and finding out now costs you nothing.',
        },
      ])}
      <p>
        For the fly-to-tippet knot itself, see
        <a href="/blog/best-fly-fishing-knots/">the four knots you actually need</a>.
      </p>
    `)}

    ${b.section('How long should my whole leader-and-tippet system be?', `
      <p>
        Nine feet total is the starting point and covers most river trout fishing. From there, length
        is a function of how spooky the fish are and how clear the water is.
      </p>
      ${b.table(
        ['Situation', 'Total length', 'End size'],
        [
          ['Small brushy stream, tight casts', '7½ft', '4X–5X'],
          ['General river trout fishing', '9ft', '4X–5X'],
          ['Clear, flat water; wary fish', '12ft+', '6X–7X'],
          ['Stillwater, dry fly', '12–15ft', '5X–6X'],
          ['Streamers on a sinking line', '3–6ft', '0X–2X'],
        ]
      )}
      <p>
        Note the streamer line at the bottom. It looks wrong next to the others and is not: on a
        sinking line, a long leader lets the fly ride above the line instead of down with it, so you
        shorten it deliberately.
      </p>
      <p>
        A word on the trade-off, because it is the thing nobody says out loud. Finer tippet gets more
        takes and loses more fish. If you are fishing a size 18 ${b.flyLink('pheasant-tail-nymph')}
        on 6X and breaking off on the strike, the problem is usually your hookset, not the tippet
        &mdash; but if it keeps happening, going up to 5X and getting slightly fewer takes is the
        better trade. Landing fish quickly matters for the fish as well as for you.
      </p>
    `)}

    ${b.section('How do I know when to replace tippet?', `
      <p>
        Run the last two feet between your fingers. Any roughness, any visible nicks, any curl that
        will not straighten &mdash; cut it off and retie. Also replace it after landing a good fish,
        after a fly has been stuck in a rock or a tree, and any time you cannot remember when you
        last did.
      </p>
      <p>
        Nylon degrades with UV and age; fluorocarbon is more stable but not immune. Spools older than
        a few seasons are worth testing before you trust them: pull a length hard, and if it parts
        with less resistance than you expect, retire it. This is a cheap component protecting an
        expensive day.
      </p>
      <p>
        One last habit. When you swap from a ${b.flyLink('adams')} on a dry-fly rig to a weighted
        nymph, change the tippet as well as the fly. The dry-fly tippet is thinner than the nymph
        deserves, and it has spent an hour floating in the surface film collecting grit.
      </p>
    `)}

    ${b.faq(meta.faqs)}
    ${b.sources(meta.sources)}
  `;
}
