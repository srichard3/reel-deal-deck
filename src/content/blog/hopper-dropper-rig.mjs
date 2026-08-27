export const meta = {
  slug: 'hopper-dropper-rig',
  title: 'How to Fish a Hopper-Dropper Rig',
  question: 'How do I fish a hopper-dropper rig?',
  description:
    'The summer rig that covers two depths at once. Dropper length, which flies go where, how to keep the dry afloat, and when it beats an indicator.',
  answer:
    'Tie a buoyant dry fly to your tippet, then attach 12 to 36 inches of tippet to the bend of its hook and add a weighted nymph. The dry both catches fish and acts as the indicator. Set the dropper length to roughly three quarters of the water depth.',
  topic: 'technique',
  date: '2026-08-27',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'How long should the dropper be on a hopper-dropper rig?',
      a: 'Roughly three quarters of the water depth, commonly 12 to 36 inches. In knee-deep pocket water 12 to 18 inches is right; over a four-foot run you want 30 inches or more, or the nymph never reaches the fish.',
    },
    {
      q: 'Where do you tie the dropper on a hopper-dropper?',
      a: 'To the bend of the dry fly hook, using a clinch knot. Tying to the eye interferes with how the dry sits on the water, and tying to a tippet ring above the dry costs you the hinge that makes the rig cast well.',
    },
    {
      q: 'Why does my hopper keep sinking?',
      a: 'The dropper is too heavy for the dry, or the dry is waterlogged. Use a foam-bodied dry, dress it before it gets wet rather than after, and drop a bead size if the fly is being pulled under on every drift.',
    },
    {
      q: 'When should you use a hopper-dropper instead of an indicator rig?',
      a: 'In water under about four feet, and any time a fish might genuinely eat the dry. It is faster to fish, easier to cast, and lands more quietly than an indicator rig — but it cannot fish deep water effectively.',
    },
  ],
  howTo: {
    name: 'Rig a hopper-dropper',
    steps: [
      { name: 'Start with tippet', text: 'Run 18 to 24 inches of 3X or 4X from your leader. The dry needs heavier tippet than you would use alone, because it is carrying a nymph.' },
      { name: 'Tie on the dry', text: 'Attach a buoyant foam dry with a clinch knot. It has to float a weighted fly, so choose flotation over delicacy.' },
      { name: 'Attach the dropper', text: 'Tie 12 to 36 inches of lighter tippet to the bend of the dry fly hook with a clinch knot.' },
      { name: 'Add the nymph', text: 'A beadhead on the end. Heavy enough to sink, light enough that it does not drown the dry.' },
      { name: 'Set the length to the water', text: 'Aim for about three quarters of the depth. Adjust by re-tying, or carry pre-tied droppers of two lengths.' },
      { name: 'Fish it like a dry fly', text: 'Cast, mend, dead drift. Set the hook on any hesitation of the dry, not just when it disappears.' },
    ],
  },
  related: ['nymph-rig-setup', 'dry-fly-vs-nymph', 'how-to-mend-fly-line', 'tippet-size-for-fly-size'],
  relatedFlies: ['chubby-chernobyl', 'grasshopper', 'copper-john', 'pheasant-tail-nymph'],
  sources: [
    {
      label: 'Troutbitten — Fifty Fly Fishing Tips',
      url: 'https://troutbitten.com/2017/09/17/fifty-fly-fishing-tips-8-use-the-davy-knot-heres-why/',
    },
    {
      label: 'Gink and Gasoline — 10 Types of Water That Always Hold Trout',
      url: 'https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Dropper length ≈ three quarters of the water depth. Usually 12–36in.',
      'Tie the dropper to the bend of the dry fly hook, not the eye.',
      'Heavier tippet to the dry than you would use alone — it is carrying weight.',
      'Best under about four feet. Deeper than that, use an indicator rig.',
    ])}

    ${b.section('What is a hopper-dropper rig?', `
      <p>
        A buoyant dry fly with a weighted nymph hanging beneath it. The dry does two jobs at
        once: it is a fly a trout may well eat, and it is the indicator that tells you the
        nymph has been taken.
      </p>
      <p>
        That is the whole appeal. You are fishing the surface and the middle of the water
        column on the same cast, which on a summer freestone river is exactly where the fish
        are split.
      </p>
      ${b.table(
        ['Position', 'Component', 'Spec'],
        [
          ['1', 'Tippet from leader', '18–24in, 3X or 4X'],
          ['2', 'Dry fly', 'Buoyant, foam-bodied, visible'],
          ['3', 'Dropper tippet', '12–36in, tied to the hook bend'],
          ['4', 'Nymph', 'Beadhead, sized so it does not drown the dry'],
        ],
        'The rig, top to bottom'
      )}
    `)}

    ${b.section('How long should the dropper be?', `
      <p>
        <strong>About three quarters of the water depth.</strong> The nymph needs to reach the
        feeding zone without dragging bottom on every drift.
      </p>
      ${b.table(
        ['Water depth', 'Dropper length', 'Notes'],
        [
          ['1–2 ft (pocket water)', '12–18in', 'Short and controllable; the classic mountain-stream setup'],
          ['2–3 ft', '18–24in', 'The everyday length. If you tie one, tie this'],
          ['3–4 ft', '24–36in', 'Getting long to cast; consider a heavier bead instead'],
          ['Over 4 ft', '—', 'Switch to an indicator rig'],
        ],
        'Dropper length by water depth'
      )}
      ${b.note(
        'Carry two or three pre-tied droppers of different lengths in a leader wallet. Changing depth then takes twenty seconds instead of five minutes of tying on a windy bank.'
      )}
    `)}

    ${b.section('Which flies go where?', `
      <p>
        <strong>Flotation on top, weight below</strong>, and the two have to be balanced or the
        rig does not work.
      </p>
      <ul>
        <li>
          <strong>The dry.</strong> A ${b.flyLink('chubby-chernobyl')} is the standard for a
          reason — foam body, poly wings, visible at distance, and it will hold a bead without
          going under. A ${b.flyLink('grasshopper')} does the same job with more realism when
          fish are genuinely eating hoppers.
        </li>
        <li>
          <strong>The nymph.</strong> A beadhead ${b.flyLink('copper-john')} sinks fast and is
          the usual choice when you need depth. A ${b.flyLink('pheasant-tail-nymph')} is the
          drabber, more imitative option that tends to get eaten more often on pressured water.
        </li>
      </ul>
      ${b.warn(
        'If the dry sinks on every drift the rig is out of balance. Drop a bead size on the nymph before you blame the dry — a tungsten bead that is right for an indicator rig is often too much for a dry-dropper.'
      )}
    `)}

    ${b.section('Why tie the dropper to the hook bend?', `
      <p>
        Three options exist and only one of them is good.
      </p>
      ${b.table(
        ['Attachment', 'Result'],
        [
          ['<strong>Hook bend of the dry</strong>', '<strong>Standard. Casts cleanly, the dry sits naturally, nothing to fail</strong>'],
          ['Eye of the dry', 'Interferes with how the dry sits and crowds the knot you rely on'],
          ['Tippet ring above the dry', 'Loses the hinge that makes the rig turn over; the flies tangle more'],
        ],
        'Where to attach the dropper'
      )}
      <p>
        A clinch knot around the bend is enough. Some anglers worry it weakens the hook — in
        practice, tippet fails long before a hook bend does.
      </p>
    `)}

    ${b.section('How do you fish it?', `
      <p>
        Like a dry fly, with one change to how you watch it.
      </p>
      ${b.steps([
        { name: 'Cast with an open loop', text: 'Two flies on a hinged rig tangle if you drive a tight loop. Slow down and open the loop slightly.' },
        { name: 'Mend immediately', text: 'Drag sinks the dry and lifts the nymph — it ruins both flies at once. Mend upstream in the first second.' },
        { name: 'Watch for hesitation, not disappearance', text: 'A take on the nymph often just checks the dry, or turns it sideways. Set on any unnatural pause.' },
        { name: 'Set low and to the side', text: 'A hard overhead set on two flies is how you put one of them in a tree.' },
        { name: 'Fish the bank', text: 'The dry is a terrestrial imitation. Terrestrials come from land, so the best water is the first two feet off the edge.' },
      ])}
    `)}

    ${b.section('When is a hopper-dropper the wrong choice?', `
      ${b.table(
        ['Situation', 'Use instead', 'Why'],
        [
          ['Water deeper than about 4ft', 'Indicator nymph rig', 'The dropper cannot reach without becoming uncastable'],
          ['Fish rising steadily to a hatch', 'A single dry', 'The nymph adds nothing and the rig lands heavier'],
          ['Very flat, clear, spooky water', 'A single dry, long leader', 'Two flies and a foam body land loudly'],
          ['Fast, deep pocket water', 'Tight-line / Euro nymphing', 'You need the fly down within a metre of the cast'],
        ],
        'When to rig something else'
      )}
      <p>
        The rig's sweet spot is knee-to-waist-deep freestone water in summer, which happens to
        be most of the western fly fishing anyone does between June and September.
      </p>
    `)}
  `;
}
