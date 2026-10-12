export const meta = {
  slug: 'nail-knot',
  title: 'How to Tie a Nail Knot',
  question: 'How do you tie a nail knot?',
  description:
    'The traditional way to join leader to fly line: six wraps around line, leader and tube, then thread the tag back. Plus the easier alternative.',
  answer:
    'Lay the leader butt alongside the end of the fly line with a small tube or nail beside both, wrap the leader six times around all three, pass the tag back through the tube, and pull the tube out. Tighten slowly and trim. Most anglers now use a braided loop instead.',
  topic: 'knots',
  date: '2026-10-12',
  updated: null,
  readingTime: 5,
  faqs: [
    {
      q: 'Do I still need to know the nail knot?',
      a: 'Less than you used to. Most fly lines now come with a welded loop at the tip, and a loop-to-loop connection is quicker and lets you change leaders in seconds. The nail knot still matters if your line has no loop, or if you want the slimmest possible join.',
    },
    {
      q: 'What can I use instead of a nail?',
      a: 'A short piece of hollow tube — a coffee stirrer, the barrel of a cheap biro, or the purpose-made tool. The tube is better than an actual nail because you thread the tag through it rather than back along a groove.',
    },
    {
      q: 'Why does my nail knot slip off the fly line?',
      a: 'Either too few wraps, or it was tightened in one movement. Seat it in stages: snug the coils first with the tag, then tighten against the fly line, then pull the leader. A nail knot that is pulled straight to full tension tends to bite into the coating and let go.',
    },
  ],
  howTo: {
    name: 'Tie a nail knot',
    steps: [
      { name: 'Line up three things', text: 'Hold the end of the fly line, the butt of the leader pointing the opposite way, and a small hollow tube, all parallel and pinched together.' },
      { name: 'Wrap six times', text: 'Take the leader tag and wrap it six times around the fly line, the leader and the tube together, working back towards the end of the fly line. Keep the coils tight and side by side.' },
      { name: 'Thread the tube', text: 'Pass the leader tag back through the tube so it emerges under the coils.' },
      { name: 'Withdraw the tube', text: 'Slide the tube out carefully, holding the coils with your fingers so they do not unravel.' },
      { name: 'Snug the coils', text: 'Pull gently on both ends of the leader to draw the coils together evenly. Do not fully tighten yet.' },
      { name: 'Tighten in stages', text: 'Pull the leader butt firmly against the fly line, checking the coils stay neat and do not cross.' },
      { name: 'Trim and smooth', text: 'Cut both tags close. A drop of flexible head cement over the knot makes it slide through the guides without catching.' },
    ],
  },
  related: ['how-to-set-up-a-fly-rod', 'leader-vs-tippet', 'best-fly-fishing-knots'],
  relatedFlies: ['woolly-bugger', 'elk-hair-caddis'],
  sources: [
    { label: 'Orvis Learning Center — Rigging a fly rod', url: 'https://howtoflyfish.orvis.com/beginner-fly-fishing/tackle-and-gear/rigging-your-fly-rod' },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Six wraps, around fly line, leader and tube together.',
      'Use a hollow tube, not a nail — you thread the tag through it.',
      'Tighten in stages. A single hard pull makes it bite into the line coating.',
      'If your fly line has a welded loop, a loop-to-loop is faster and just as good.',
    ])}

    ${b.section('How do you tie a nail knot?', `
      ${b.steps(meta.howTo.steps)}
    `)}

    ${b.section('Do you actually need it?', `
      <p>
        For most anglers buying a line today, no. Fly lines come with welded loops at the
        tip, leaders come with a loop at the butt, and joining them takes about four seconds
        with no tools and no skill. Changing from a dry-fly leader to a short streamer leader
        mid-session becomes trivial, which is a real advantage over a knot you have to cut
        off and retie.
      </p>
      <p>
        The nail knot keeps two uses. It is the answer when a line has no loop, or when the
        loop has worn out and you do not want to replace the line. And it is slimmer than a
        loop-to-loop, which matters a little in spring creek fishing where the join lands on
        the water in front of a fish.
      </p>
    `)}
  `;
}
