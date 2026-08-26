export const meta = {
  slug: 'what-flies-do-i-need-to-start',
  title: 'What Flies Do Beginners Need?',
  question: 'What flies do I actually need to start fly fishing?',
  description:
    'You need about a dozen patterns, not a hundred — and more sizes of fewer flies. How to build a first fly box that covers a season on trout water.',
  answer:
    'About a dozen patterns in three or four sizes each will cover a first season: two searching dry flies, two attractor nymphs, a midge, a terrestrial and a streamer. Carry each in sizes 14 through 18. Size and depth matter far more than pattern — buy fewer patterns and more sizes.',
  topic: 'basics',
  date: '2026-08-03',
  updated: null,
  readingTime: 8,
  faqs: [
    {
      q: 'How many flies should a beginner buy?',
      a: 'Around 40 to 50 individual flies, made up of roughly a dozen patterns in three or four sizes each. You will lose flies to trees and rocks, so carry three of anything you actually intend to fish, not one.',
    },
    {
      q: 'Does the exact pattern matter?',
      a: 'Less than size, depth and drift. A trout in moving water judges silhouette and size before colour, and a fly at the wrong depth is not judged at all. Get those three right with an ordinary pattern before you go looking for a better fly.',
    },
    {
      q: 'What size flies should I start with?',
      a: 'Sizes 14 to 18 cover the great majority of trout fishing in North America. Beginners consistently fish too large. If fish are refusing, drop two sizes before you change patterns.',
    },
    {
      q: 'Should I buy flies or tie my own?',
      a: 'Buy, for the first season. Tying is a genuinely rewarding second hobby and a poor way to solve an empty fly box in week one. Learn what you actually fish, then tie those.',
    },
  ],
  howTo: null,
  related: ['dry-fly-vs-nymph', 'how-to-read-water-fly-fishing', 'leader-vs-tippet'],
  relatedFlies: [
    'parachute-adams',
    'elk-hair-caddis',
    'pheasant-tail-nymph',
    'gold-ribbed-hares-ear',
    'zebra-midge',
    'copper-john',
    'woolly-bugger',
    'chubby-chernobyl',
    'san-juan-worm',
    'foam-beetle',
  ],
  sources: [
    {
      label: 'Gink and Gasoline — 10 Types of Water That Always Hold Trout',
      url: 'https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/',
    },
    {
      label: 'University of Kentucky — A Beginner’s Guide to Rods, Reels, and Lines',
      url: 'https://www.uky.edu/~agrdanny/flyfish/newfaq.htm',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.section('How many flies does a beginner actually need?', `
      <p>
        Roughly a dozen patterns, three or four sizes of each, three of each size. That is 40 to 50
        flies in a single box, and it will cover a full season on most North American trout water.
      </p>
      <p>
        The instinct is the opposite: buy one of everything that looks good, end up with 200 flies in
        one size each, and never build any confidence in any of them. A small box fished hard teaches
        you more than a large box browsed. And a fly you have only one of is a fly you will not cast
        near the log jam, which is where the fish is.
      </p>
      ${b.note(
        'The other reason to buy in threes: you will lose flies. To trees, to rocks, to bad knots, and occasionally to a fish. Losing your only size 16 in the first hour ends that option for the day.'
      )}
    `)}

    ${b.section('What should be in a first fly box?', `
      <p>
        Think in jobs, not names. Each of these categories does something the others cannot, and the
        specific patterns listed are proven representatives &mdash; follow the links for what each one
        imitates, when to fish it, and in what sizes.
      </p>
      ${b.table(
        ['Job in the box', 'Carry', 'Sizes', 'Why it is in there'],
        [
          ['Searching dry fly', `${b.flyLink('parachute-adams')}`, '#14, #16, #18', 'Fish it when you see rises you cannot identify'],
          ['Caddis dry', `${b.flyLink('elk-hair-caddis')}`, '#14, #16', 'Rides broken water well and is easy to see'],
          ['Slim nymph', `${b.flyLink('pheasant-tail-nymph')}`, '#14, #16, #18', 'The default subsurface fly on most rivers'],
          ['Buggy nymph', `${b.flyLink('hares-ear-nymph')}`, '#12, #14, #16', 'A different silhouette when the slim one is refused'],
          ['Weighted anchor nymph', `${b.flyLink('copper-john')}`, '#14, #16', 'Gets a rig down fast in heavy water'],
          ['Midge', `${b.flyLink('zebra-midge')}`, '#18, #20', 'Winter, tailwaters, and any time nothing else works'],
          ['Terrestrial', `${b.flyLink('beetle')}`, '#12, #14', 'Summer, wind, and grassy banks'],
          ['Big buoyant dry', `${b.flyLink('chubby-chernobyl')}`, '#8, #10', 'Doubles as the indicator on a dry-dropper rig'],
          ['Streamer', `${b.flyLink('woolly-bugger')}`, '#8, #10', 'Covers water fast; works when the surface tells you nothing'],
          ['Wildcard', `${b.flyLink('san-juan-worm')}`, '#12', 'High, coloured water, when nothing subtle is being seen'],
        ]
      )}
      <p>
        That is ten patterns. Add two more that are specific to your home water &mdash; ask at the
        local shop, which is the single most useful thirty seconds of research available &mdash; and
        the box is finished.
      </p>
    `)}

    ${b.section('Why does size matter more than pattern?', `
      <p>
        A trout holding in moving current has a fraction of a second to accept or reject something
        drifting past. In that window it is reading, roughly in order: <strong>size</strong>, then
        <strong>silhouette</strong>, then <strong>behaviour</strong> (is it drifting naturally?), then
        colour. Pattern name comes nowhere.
      </p>
      <p>
        This is why the same dressing in three sizes is more useful than three different dressings in
        one size. A #14 and a #18 of the same fly are, to a fish, two different insects. A #14 of two
        different patterns are frequently the same insect.
      </p>
      ${b.warn(
        'Beginners fish too large, almost universally. Big flies are easier to see, easier to tie on, and easier to believe in. When fish refuse, drop two sizes before you change anything else — it solves the problem more often than a new pattern does.'
      )}
    `)}

    ${b.section('How do I choose a fly on the water?', `
      ${b.steps([
        {
          name: 'Look before you open the box',
          text: 'Are fish rising? Is anything in the air, on the water, or crawling on the rocks in the shallows? Two minutes of observation narrows a hundred choices to about three.',
        },
        {
          name: 'Pick the category first',
          text: 'Rises and insects on the surface mean a dry fly. Nothing showing means a nymph. High, coloured or very low light means a streamer. The category decision matters far more than the pattern decision.',
        },
        {
          name: 'Match the size you can see',
          text: 'If you can catch an insect, hold it against a hook in your box. If you cannot, start at #16 — it is the middle of the range for most rivers most of the year.',
        },
        {
          name: 'Fish it properly for ten drifts',
          text: 'A good fly drifted badly outfishes nothing. Give any choice ten honest presentations through good water before you judge it.',
        },
        {
          name: 'Change one variable at a time',
          text: 'If it fails, change depth first, then size, then pattern. Changing all three at once means you learn nothing from the change that finally works.',
        },
      ])}
    `)}

    ${b.section('What about the water I actually fish?', `
      <p>
        The generic box above is deliberately generic. Local conditions shift the emphasis, sometimes
        a lot.
      </p>
      ${b.table(
        ['Water type', 'Weight the box toward', 'Because'],
        [
          ['Freestone river', 'Buggy, impressionistic patterns; larger sizes', 'Broken water, opportunistic fish, short inspection time'],
          ['Tailwater below a dam', 'Small midges and slim nymphs, #18–#22', 'Stable flows, dense midge populations, selective fish'],
          ['Spring creek', 'Precise silhouettes, small sizes, fine tippet', 'Flat, clear, slow water gives fish time to inspect'],
          ['Stillwater', 'Leeches, chironomid patterns, damsel nymphs', 'No current means no drift — you are imitating swimming, not drifting'],
          ['Small brushy creek', 'Buoyant attractors, #12–#16', 'Fish are opportunistic and rarely selective; visibility matters'],
        ]
      )}
      <p>
        None of this requires a second box. It means buying four of the pattern your river demands and
        one of the pattern it does not.
      </p>
    `)}

    ${b.section('How should I organise and look after them?', `
      <p>
        One box, sorted by category rather than by pattern &mdash; dries in one row, nymphs in
        another, streamers in a third. Sorting by category matches the way you actually decide on the
        water: you pick the job before you pick the fly.
      </p>
      <ul>
        <li><strong>Dry your flies before they go back in.</strong> A wet fly in a closed foam box rusts, and it rusts the hooks next to it. Park used flies on your patch or the outside of the box until they dry.</li>
        <li><strong>Check the hook points.</strong> Drag the point across a thumbnail — if it slides instead of catching, sharpen it or bin the fly. Blunt hooks cost more fish than fly choice ever will.</li>
        <li><strong>Retire crushed hackle.</strong> A dry fly that has been chewed and no longer floats is a wet fly you did not intend to fish.</li>
      </ul>
    `)}

    ${b.section('What is the fastest way to learn which fly to use?', `
      <p>
        Reduce the number of variables you are guessing at. Anglers who struggle with fly selection
        are usually not being beaten by fly selection &mdash; they are being beaten by depth and drag,
        and then blaming the fly. Get the drift right first, and fly choice becomes a much smaller
        problem than it looks from the shop counter.
      </p>
      <p>
        After that, it is pattern recognition, and it is learnable. Knowing at a glance that a slim
        olive nymph, a fat brown nymph and a tiny black midge do different jobs is most of what
        experienced anglers are doing when they seem to pick a fly out of thin air. The
        <a href="/flies/">Fly Library</a> lays out all 54 patterns that way: what each one imitates,
        the sizes to carry, and when it earns its place.
      </p>
      <p>
        Then go and fish the same six flies for a season. Confidence in a fly is not superstition
        &mdash; it makes you fish that fly more carefully, for longer, in better water, which is
        exactly why it catches more.
      </p>
    `)}

    ${b.faq(meta.faqs)}
    ${b.sources(meta.sources)}
  `;
}
