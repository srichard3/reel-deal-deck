export const meta = {
  slug: 'nymph-rig-setup',
  title: 'How to Set Up a Nymph Rig',
  question: 'How do I set up a strike-indicator nymph rig?',
  description:
    'The measurements most guides give verbally and most articles bury: indicator distance, shot placement, dropper length, and how to adjust when it is not working.',
  answer:
    'Set the indicator at roughly one and a half to two times the water depth. Put split shot twelve to eighteen inches above the point fly, and hang a second fly twelve to twenty inches off the bend of the first. If you are not occasionally ticking bottom, you are fishing too shallow.',
  topic: 'technique',
  date: '2026-08-27',
  updated: null,
  readingTime: 8,
  faqs: [
    {
      q: 'How far above the flies should the strike indicator be?',
      a: 'One and a half to two times the water depth. In three feet of water, set it four to six feet above the point fly. The extra length accounts for current pushing the line downstream of the indicator.',
    },
    {
      q: 'Where do you put split shot on a nymph rig?',
      a: 'Twelve to eighteen inches above the point fly, on the tippet rather than on a knot. Pinch it gently — crushing it weakens the line at exactly the point that takes the most strain.',
    },
    {
      q: 'How do you know if your nymph rig is deep enough?',
      a: 'You should tick the bottom every few drifts. If you never touch it you are fishing above the fish; if you snag constantly you are too deep or too heavy. Occasional contact is the target.',
    },
    {
      q: 'Should you set the hook on every indicator movement?',
      a: 'Yes. An indicator that pauses, dips, twitches or drifts unnaturally costs nothing to set on, and most takes look like a hesitation rather than a plunge. Setting on rocks is the price of catching fish.',
    },
  ],
  howTo: {
    name: 'Set up a strike-indicator nymph rig',
    steps: [
      { name: 'Start from a tapered leader', text: 'Begin with a 9-foot leader in 3X or 4X. Do not tie flies straight onto the taper — add tippet so the leader survives fly changes.' },
      { name: 'Add tippet', text: 'Attach 18 to 24 inches of tippet to the leader end with a double or triple surgeon’s knot. Match the size to your point fly.' },
      { name: 'Tie on the point fly', text: 'The heaviest fly goes on the point. A tungsten beadhead or jig nymph is doing the work of getting the rig down.' },
      { name: 'Add the dropper', text: 'Tie 12 to 20 inches of tippet to the bend of the point fly and attach a second, smaller fly. This is the fly that usually gets eaten.' },
      { name: 'Place split shot', text: 'Pinch shot onto the tippet 12 to 18 inches above the point fly. Add weight before you add flies — depth is the variable that matters most.' },
      { name: 'Set the indicator', text: 'Attach it at one and a half to two times the water depth, measured from the point fly. Move it, do not re-rig, when depth changes.' },
      { name: 'Fish it and adjust', text: 'Cast upstream, mend immediately, and follow the indicator with the rod tip. If you are not ticking bottom every few drifts, add depth or weight.' },
    ],
  },
  related: ['dry-fly-vs-nymph', 'leader-vs-tippet', 'tippet-size-for-fly-size', 'how-to-read-water-fly-fishing'],
  relatedFlies: ['pheasant-tail-nymph', 'zebra-midge', 'perdigon', 'copper-john'],
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
      'Indicator at 1.5–2× water depth, measured from the point fly.',
      'Split shot 12–18in above the point fly, on tippet, not on a knot.',
      'Dropper 12–20in off the bend of the point fly.',
      'Tick bottom every few drifts. No contact means you are above the fish.',
    ])}

    ${b.section('What does a nymph rig actually look like?', `
      <p>
        From fly line down, in order:
      </p>
      ${b.table(
        ['Position', 'Component', 'Measurement'],
        [
          ['1', 'Tapered leader', '9ft, 3X or 4X'],
          ['2', 'Strike indicator', 'Set at 1.5–2× water depth'],
          ['3', 'Tippet', '18–24in'],
          ['4', 'Split shot', '12–18in above the point fly'],
          ['5', 'Point fly (heaviest)', 'On the end of the tippet'],
          ['6', 'Dropper tippet', '12–20in off the point fly bend'],
          ['7', 'Dropper fly (smaller)', 'The one that usually gets eaten'],
        ],
        'The rig from the fly line down'
      )}
      ${b.note(
        'Two flies is the standard, but check your state regulations — some waters restrict the number of hooks, and a few are single-hook only.'
      )}
    `)}

    ${b.section('How deep should the indicator be set?', `
      <p>
        <strong>One and a half to two times the water depth</strong>, measured from the point
        fly to the indicator. In three feet of water that is four to six feet.
      </p>
      <p>
        The reason it is more than the actual depth is that the rig does not hang vertically.
        Current pushes the flies downstream of the indicator, so the tippet sits at an angle
        and the effective depth is always less than the length you set.
      </p>
      ${b.table(
        ['Water depth', 'Indicator distance'],
        [
          ['1–2 ft', '2–4 ft'],
          ['3 ft', '4.5–6 ft'],
          ['4 ft', '6–8 ft'],
          ['5 ft+', 'Consider a longer leader or a tight-line approach instead'],
        ],
        'Depth to indicator distance'
      )}
      <p>
        Beyond about eight feet an indicator rig becomes difficult to cast and slow to sink.
        That is the point where tight-line or Euro-nymphing genuinely outperforms it.
      </p>
    `)}

    ${b.section('Where does the weight go?', `
      <p>
        Twelve to eighteen inches above the point fly, on the tippet itself. Two practical
        rules that are worth more than they sound:
      </p>
      <ul>
        <li>
          <strong>Never pinch shot onto a knot.</strong> The knot is already the weakest point
          in the system, and crushing lead onto it is how you lose fish and flies together.
        </li>
        <li>
          <strong>Add weight before you change flies.</strong> When a run is not producing, the
          answer is almost always depth, not pattern. Anglers change flies because it feels
          like doing something; the fish were simply never seeing it.
        </li>
      </ul>
      <p>
        You can skip shot entirely if the point fly is heavy enough — a tungsten
        ${b.flyLink('perdigon')} or a jig-hook ${b.flyLink('copper-john')} will often get a
        rig down on its own in water under three feet.
      </p>
    `)}

    ${b.section('Which flies go where?', `
      <p>
        <strong>Heavy on the point, small and natural on the dropper.</strong> The point fly is
        an anchor that happens to be edible; the dropper is the one you expect to get eaten.
      </p>
      ${b.table(
        ['Role', 'Choose', 'Examples'],
        [
          ['Point (anchor)', 'Heaviest, most visible', 'Tungsten Perdigon, beadhead Copper John'],
          ['Dropper', 'Smaller, drabber, more imitative', 'Pheasant Tail, Zebra Midge'],
        ],
        'Fly roles in a two-fly nymph rig'
      )}
      <p>
        A ${b.flyLink('pheasant-tail-nymph')} or ${b.flyLink('zebra-midge')} on the dropper
        covers an enormous range of trout water. If you are unsure what to trail, trail one of
        those two.
      </p>
    `)}

    ${b.section('How do you know it is working?', `
      <p>
        <strong>You should tick the bottom every few drifts.</strong> That is the single best
        feedback signal in nymph fishing.
      </p>
      ${b.table(
        ['What you observe', 'What it means', 'Fix'],
        [
          ['Never touching bottom', 'Fishing above the fish', 'Add depth first, then weight'],
          ['Snagging every drift', 'Too deep or too heavy', 'Shorten the indicator distance or drop a shot'],
          ['Ticking occasionally', 'Correct', 'Leave it alone'],
          ['Indicator dragging downstream of the flies', 'Line is pulling the rig', 'Mend upstream immediately after the cast'],
        ],
        'Reading your own rig'
      )}
      ${b.warn(
        'Set the hook on <em>every</em> unnatural indicator movement — a pause, a dip, a twitch, a sideways slide. Most takes look like hesitation, not a plunge. Setting on rocks all day is the cost of catching the fish that were not rocks.'
      )}
    `)}

    ${b.section('Why is my nymph rig not catching anything?', `
      <p>
        In rough order of how often it is the actual problem:
      </p>
      ${b.steps([
        { name: 'Depth', text: 'You are almost certainly too shallow. Move the indicator up before you do anything else.' },
        { name: 'Drag', text: 'If the indicator is moving faster than the bubbles beside it, the flies are being dragged. Mend upstream.' },
        { name: 'Weight', text: 'Add a shot. In fast or deep water the rig may not reach the bottom within the drift at all.' },
        { name: 'Position', text: 'You may be fishing the wrong water. Trout hold in specific places, not evenly across a run.' },
        { name: 'Pattern', text: 'Last. Change the dropper before the anchor, and change size before colour.' },
      ])}
      <p>
        The order matters. Anglers reliably work this list backwards, and spend an afternoon
        changing flies through water their rig never reached.
      </p>
    `)}
  `;
}
