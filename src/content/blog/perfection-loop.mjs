export const meta = {
  slug: 'perfection-loop',
  title: 'How to Tie a Perfection Loop',
  question: 'How do you tie a perfection loop?',
  description:
    'The loop that sits perfectly in line with the leader, used at the butt end for loop-to-loop connections. Two turns, one through the other, and it sits straight.',
  answer:
    'Make a loop by passing the tag behind the standing line, then a second smaller loop in front of it, bring the tag between the two loops, and pull the second loop through the first. Wet it and pull. Unlike other loops, it ends up perfectly in line with the leader.',
  topic: 'knots',
  date: '2026-10-12',
  updated: null,
  readingTime: 4,
  faqs: [
    {
      q: 'Why use a perfection loop instead of a surgeon’s loop?',
      a: 'Because it sits straight. A surgeon’s loop is easier to tie but comes out of the leader at a slight angle, which puts a kink in the connection. The perfection loop is in line with the standing material, so the leader turns over cleanly.',
    },
    {
      q: 'How big should the loop be?',
      a: 'Small — about a quarter of an inch. It only has to pass over a fly line loop, and an oversized loop hinges and casts badly.',
    },
    {
      q: 'Can I use it at the tippet end too?',
      a: 'You can, and some anglers do for quick fly changes with a loop. More often the tippet end gets a clinch, a Davy or a non-slip loop, and the perfection loop stays at the butt.',
    },
  ],
  howTo: {
    name: 'Tie a perfection loop',
    steps: [
      { name: 'First loop', text: 'Form a loop by bringing the tag end behind the standing line. Pinch the crossing point between finger and thumb.' },
      { name: 'Second loop', text: 'Bring the tag around again to make a second loop in front of the first, slightly smaller, and pinch it too.' },
      { name: 'Tag between the loops', text: 'Bring the tag end back and lay it between the two loops, pointing across them.' },
      { name: 'Pull the second through the first', text: 'Reach through the first loop, grip the second loop, and pull it through. The tag stays where it is.' },
      { name: 'Wet and seat', text: 'Lubricate, then pull on the new loop and the standing line together until the knot draws down.' },
      { name: 'Check it is straight', text: 'A correct perfection loop points directly in line with the leader. If it sits at an angle, retie it.' },
      { name: 'Trim', text: 'Cut the tag close to the knot.' },
    ],
  },
  related: ['nail-knot', 'how-to-set-up-a-fly-rod', 'leader-vs-tippet'],
  relatedFlies: ['parachute-adams', 'woolly-bugger'],
  sources: [
    { label: 'Orvis Learning Center — Rigging a fly rod', url: 'https://howtoflyfish.orvis.com/beginner-fly-fishing/tackle-and-gear/rigging-your-fly-rod' },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'It sits in line with the leader. That is the entire reason it exists.',
      'Keep the loop small — a quarter of an inch is plenty.',
      'Pull the second loop through the first; the tag end does not move.',
      'If the finished loop points off at an angle, it is tied wrong.',
    ])}

    ${b.section('How do you tie a perfection loop?', `
      ${b.steps(meta.howTo.steps)}
    `)}

    ${b.section('How to connect loop to loop', `
      <p>
        Having tied the loop, the connection itself has one rule that is easy to get wrong.
        Pass the fly line loop through the leader loop, then pass the whole leader through
        the fly line loop, and draw them together so they form a square interlocking join.
      </p>
      <p>
        If instead you end up with one loop girth-hitched around the other — a lark’s head —
        the join will hinge, wear and eventually cut through. It is worth looking at the
        finished connection every time until the correct shape is automatic.
      </p>
    `)}
  `;
}
