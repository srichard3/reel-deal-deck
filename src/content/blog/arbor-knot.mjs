export const meta = {
  slug: 'arbor-knot',
  title: 'How to Tie an Arbor Knot',
  question: 'How do you tie an arbor knot?',
  description:
    'The knot that attaches backing to the reel spool. An overhand around the spool, a second overhand in the tag, pull tight. The first knot in the whole rig.',
  answer:
    'Pass the backing around the reel arbor, tie a simple overhand knot around the standing line, then tie a second overhand in the tag end itself as a stopper. Pull the standing line and the first knot slides down and jams against the second. Trim the tag close.',
  topic: 'knots',
  date: '2026-10-12',
  updated: null,
  readingTime: 4,
  faqs: [
    {
      q: 'Does the arbor knot need to be strong?',
      a: 'Not really. If a fish has taken all your backing, the knot at the spool is not the problem you have. What it must do is not slip around a bare spool while you are winding line on under tension.',
    },
    {
      q: 'Why does my backing slip around the spool?',
      a: 'Because the arbor is slick and the first few turns have nothing to grip. A strip of backing tape, or a few turns of masking tape around the arbor, solves it permanently and costs nothing.',
    },
    {
      q: 'How much backing should I put on?',
      a: 'Enough that the fly line fills the spool close to the rim without rubbing the frame. For most trout reels that is 50 to 100 yards of 20lb backing, and the simplest method is to wind the line on first, then the backing, then reverse the whole lot onto the reel.',
    },
  ],
  howTo: {
    name: 'Tie an arbor knot',
    steps: [
      { name: 'Around the arbor', text: 'Pass the end of the backing around the centre of the reel spool and bring it back out.' },
      { name: 'First overhand', text: 'Tie a simple overhand knot with the tag end around the standing line. Do not tighten it fully.' },
      { name: 'Second overhand', text: 'Tie a second overhand knot in the tag end alone, an inch or so from the first. This is the stopper.' },
      { name: 'Wet both', text: 'Lubricate, then pull the standing line so the first knot slides down the backing and jams hard against the stopper knot.' },
      { name: 'Snug against the spool', text: 'Pull until the whole assembly draws tight around the arbor.' },
      { name: 'Trim', text: 'Cut the tag close to the stopper knot.' },
      { name: 'Wind on under tension', text: 'Keep firm pressure on the backing as you wind. Backing wound on loose will bed into itself under a running fish and jam the reel.' },
    ],
  },
  related: ['how-to-set-up-a-fly-rod', 'best-fly-fishing-knots', 'nail-knot'],
  relatedFlies: ['woolly-bugger'],
  sources: [
    { label: 'Orvis Learning Center — Rigging a fly rod', url: 'https://howtoflyfish.orvis.com/beginner-fly-fishing/tackle-and-gear/rigging-your-fly-rod' },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Two overhand knots: one around the standing line, one as a stopper in the tag.',
      'It does not need to be strong. It needs not to slip on a bare spool.',
      'A few turns of tape around the arbor stops slipping for good.',
      'Wind the backing on under firm tension or it will jam later.',
    ])}

    ${b.section('How do you tie an arbor knot?', `
      ${b.steps(meta.howTo.steps)}
    `)}

    ${b.section('Why it barely matters, and why to do it properly anyway', `
      <p>
        This is the least important knot in fly fishing by one measure and a nuisance by
        another. No trout is going to test it — if a fish has run a hundred yards of backing
        off a reel, the arbor knot is not what decides the outcome.
      </p>
      <p>
        What it does decide is whether the whole line creeps round the spool while you are
        loading the reel, which is irritating at home and genuinely awkward on the water. Tie
        it once, tape the arbor, wind on tight, and you will not think about it again for the
        life of the reel.
      </p>
    `)}
  `;
}
