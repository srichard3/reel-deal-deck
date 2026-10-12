export const meta = {
  slug: 'davy-knot',
  title: 'How to Tie the Davy Knot',
  question: 'How do you tie a Davy knot?',
  description:
    'The smallest and fastest tippet-to-fly knot in fly fishing. Three movements, almost no wasted tippet, and strong enough for trout.',
  answer:
    'Pass the tippet through the hook eye, form a loose overhand knot around the standing line, then bring the tag back through that overhand loop. For a double Davy, pass it through a second time. Wet it, pull the standing line, and trim. It wastes almost no tippet.',
  topic: 'knots',
  date: '2026-10-12',
  updated: null,
  readingTime: 4,
  faqs: [
    {
      q: 'Is the Davy knot strong enough for big trout?',
      a: 'The double Davy is, and that is the version most anglers should tie. The single Davy is adequate for small flies and light tippet but has less margin, so the second pass costs you a second and buys you confidence.',
    },
    {
      q: 'Why does the Davy knot waste less tippet?',
      a: 'It uses roughly an inch of material where an improved clinch uses three or four. Over a day of changing flies that is the difference between re-tying your tippet section once and re-tying it three times.',
    },
    {
      q: 'Does the Davy knot work on heavy tippet?',
      a: 'Better than the clinch does. It seats cleanly on stiff and thick material where a clinch gets bulky, which makes it a good choice for streamers and for leader material above 2X.',
    },
  ],
  howTo: {
    name: 'Tie a Davy knot',
    steps: [
      { name: 'Through the eye', text: 'Pass about two inches of tippet through the hook eye. You need far less tag than a clinch requires.' },
      { name: 'Form an overhand', text: 'Bring the tag end around the standing line and make a loose overhand knot, leaving the loop open.' },
      { name: 'Back through the loop', text: 'Pass the tag end through the open overhand loop, going over the standing line on the way.' },
      { name: 'Second pass for a double', text: 'Pass the tag through the same loop a second time. This is the double Davy, and it is the version to learn.' },
      { name: 'Wet and seat', text: 'Lubricate, then pull the standing line steadily while holding the fly. The knot snugs down against the eye.' },
      { name: 'Trim', text: 'Cut the tag close. A correctly seated Davy is remarkably small.' },
    ],
  },
  related: ['improved-clinch-knot', 'best-fly-fishing-knots', 'tippet-size-for-fly-size'],
  relatedFlies: ['zebra-midge', 'rs2', 'parachute-adams'],
  sources: [
    { label: 'Troutbitten — Fifty Fly Fishing Tips #8: Use the Davy Knot', url: 'https://troutbitten.com/2017/09/17/fifty-fly-fishing-tips-8-use-the-davy-knot-heres-why/' },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Tie the double Davy, not the single. One extra pass, far more margin.',
      'It uses about an inch of tippet against the clinch’s three or four.',
      'It seats better than a clinch on heavy and stiff material.',
      'Hold the fly and pull the standing line — pulling the tag will not seat it.',
    ])}

    ${b.section('How do you tie a Davy knot?', `
      ${b.steps(meta.howTo.steps)}
      <p>
        The knot looks wrong the first few times, because it is so much smaller than what you
        are used to. Test it by pulling hard against the hook bend before you fish it — a
        badly formed Davy fails immediately rather than later, which is the one genuinely
        useful thing about its failure mode.
      </p>
    `)}

    ${b.section('Why it is worth learning', `
      <p>
        On a nymphing day you might change flies fifteen times. Each improved clinch costs
        three or four inches of tippet, and by mid-afternoon the section you started with is
        too short and you are re-tying the whole thing. The Davy uses about an inch, which
        means the tippet section you tied on at breakfast is still long enough at dusk.
      </p>
      <p>
        It is also fast. Once it is in your hands it takes a few seconds, which matters more
        than it sounds when a hatch is happening and you have the wrong fly on.
      </p>
    `)}
  `;
}
