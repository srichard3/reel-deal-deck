export const meta = {
  slug: 'blood-knot',
  title: 'How to Tie a Blood Knot',
  question: 'How do you tie a blood knot?',
  description:
    'The slimmest way to join two pieces of leader. Five wraps each way, both tags through the middle gap from opposite sides, wet and pull.',
  answer:
    'Cross the two pieces of leader, wrap one tag five times around the other and pass it back through the gap where they cross. Wrap the second tag five times the other way and pass it through the same gap from the opposite side. Wet it and pull both standing lines.',
  topic: 'knots',
  date: '2026-10-12',
  updated: null,
  readingTime: 5,
  faqs: [
    {
      q: 'Why does my blood knot keep falling apart?',
      a: 'Usually because both tags went through the central gap from the same side. They must enter from opposite sides, or the knot has nothing to lock against and simply unwinds when you pull.',
    },
    {
      q: 'How different can the two diameters be?',
      a: 'About two tippet sizes before it starts to struggle. Beyond that, add a wrap or two on the thinner side, or switch to a double surgeon’s knot, which tolerates mismatch far better.',
    },
    {
      q: 'Is the blood knot stronger than a surgeon’s knot?',
      a: 'In similar diameters they are close enough that tying quality matters more than choice. The blood knot’s real advantage is shape — it is slim and in line, so it slides through guides cleanly and collects less weed.',
    },
  ],
  howTo: {
    name: 'Tie a blood knot',
    steps: [
      { name: 'Cross the two pieces', text: 'Overlap the two sections of leader by six or eight inches, crossing them in the middle.' },
      { name: 'Wrap the first tag', text: 'Take the tag of the first piece and wrap it five times around the second piece, working away from the crossing point.' },
      { name: 'Back through the gap', text: 'Bring that tag back and pass it through the opening at the crossing point. Pinch it there so it does not escape.' },
      { name: 'Wrap the second tag', text: 'Wrap the other tag five times around the first piece, in the opposite direction.' },
      { name: 'Through from the other side', text: 'Pass that tag through the same central gap, entering from the opposite side to the first. This is the step everyone gets wrong.' },
      { name: 'Wet it', text: 'Lubricate thoroughly. Ten coils bedding down against each other generate more heat than any other common leader knot.' },
      { name: 'Pull both standing lines', text: 'Pull the two standing parts apart steadily. The coils will roll over and seat into a neat barrel.' },
      { name: 'Trim', text: 'Cut both tags flush against the barrel. A well-tied blood knot is almost invisible to the touch.' },
    ],
  },
  related: ['double-surgeons-knot', 'leader-vs-tippet', 'best-fly-fishing-knots'],
  relatedFlies: ['parachute-adams', 'pheasant-tail-nymph'],
  sources: [
    { label: 'Orvis Learning Center — Leader and tippet basics', url: 'https://howtoflyfish.orvis.com/beginner-fly-fishing/tackle-and-gear/leaders-and-tippet' },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'The two tags must pass through the central gap from opposite sides.',
      'Five wraps each side for similar diameters; add one on the thinner piece if they differ.',
      'It is slimmer than a surgeon’s knot, which is its whole advantage.',
      'Pull the two standing lines, not the tags, and the barrel rolls into shape.',
    ])}

    ${b.section('How do you tie a blood knot?', `
      ${b.steps(meta.howTo.steps)}
      <p>
        A finished blood knot should look like a small neat barrel with a tag at each end,
        and the two standing lines should come out of it in a straight line. If the knot sits
        at an angle, the wraps were uneven and it is worth retying.
      </p>
    `)}

    ${b.section('Where it earns its place', `
      <p>
        The blood knot is the leader-builder’s knot. If you tie your own tapered leaders —
        stepping down from a stiff butt section through a few intermediate diameters to the
        tippet — you will tie three or four of these per leader, and their slim in-line
        profile is what makes the finished leader turn over properly and slide through the
        guides without catching.
      </p>
      <p>
        On the water, in the cold, with a hatch happening, most people tie a surgeon’s knot
        instead, and there is nothing wrong with that.
      </p>
    `)}
  `;
}
