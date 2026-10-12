export const meta = {
  slug: 'improved-clinch-knot',
  title: 'How to Tie an Improved Clinch Knot',
  question: 'How do you tie an improved clinch knot?',
  description:
    'The knot most anglers use to tie a fly to tippet. Five wraps, back through two loops, wet it, seat it slowly — and how it fails.',
  answer:
    'Thread the tippet through the hook eye, wrap it five times around the standing line, pass the tag back through the small loop at the eye and then through the big loop you just made. Wet it and pull slowly on the standing line. That extra pass is what makes it improved.',
  topic: 'knots',
  date: '2026-10-12',
  updated: null,
  readingTime: 5,
  faqs: [
    {
      q: 'How many wraps should an improved clinch have?',
      a: 'Five is the standard for tippet between 4X and 6X. Go to six or seven on very fine diameters and down to four on heavy tippet above 2X, because thick material will not seat cleanly with too many coils.',
    },
    {
      q: 'Why does my improved clinch keep slipping?',
      a: 'Almost always because it was seated dry, or pulled tight with a jerk. Friction generates heat, heat weakens the material, and a knot that was not lubricated will either slip or break well below the tippet rating.',
    },
    {
      q: 'Is the improved clinch better than the regular clinch?',
      a: 'For most tippet diameters, yes — the extra pass through the big loop stops the coils unwinding under load. On very heavy or very stiff material the plain clinch sometimes seats more cleanly, which is why both are still taught.',
    },
    {
      q: 'What should I use instead on heavy tippet?',
      a: 'Above about 2X, a non-slip loop knot or a Davy knot is easier to seat and wastes less material. The improved clinch is at its best in the 3X to 6X range most trout fishing uses.',
    },
  ],
  howTo: {
    name: 'Tie an improved clinch knot',
    steps: [
      { name: 'Thread the eye', text: 'Pass six inches of tippet through the hook eye, front to back. Leave yourself enough tag to work with — short tags are the usual cause of a botched knot.' },
      { name: 'Make five wraps', text: 'Twist the tag end around the standing line five times. Keep the coils neat and let them sit beside each other rather than crossing.' },
      { name: 'Back through the first loop', text: 'Pass the tag end back through the small loop sitting right against the hook eye.' },
      { name: 'Through the big loop', text: 'Now pass the tag through the large loop you created by that first pass. This step is the "improved" part and it is the one people skip.' },
      { name: 'Wet it', text: 'Saliva or water on the coils before you tighten. This is not optional — it is the difference between a knot at full strength and one at half.' },
      { name: 'Seat it slowly', text: 'Pull steadily on the standing line, not the tag, until the coils draw down neatly against the eye. Slow and even, never a jerk.' },
      { name: 'Trim close', text: 'Cut the tag to about a sixteenth of an inch. A long tag catches the leader and starts tangles.' },
    ],
  },
  related: ['best-fly-fishing-knots', 'leader-vs-tippet', 'tippet-size-for-fly-size'],
  relatedFlies: ['parachute-adams', 'elk-hair-caddis', 'pheasant-tail-nymph'],
  sources: [
    { label: 'Orvis News — Pro Tips: The Only Two Terminal Knots You Really Need', url: 'https://news.orvis.com/fly-fishing/pro-tips-the-only-two-terminal-knots-you-really-need' },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Five wraps for normal trout tippet; fewer on heavy, more on very fine.',
      'The second pass — through the big loop — is the whole point of "improved".',
      'Wet it before you tighten. A dry knot is a weak knot.',
      'Seat it by pulling the standing line slowly, never with a snap.',
    ])}

    ${b.section('How do you tie an improved clinch knot?', `
      ${b.steps(meta.howTo.steps)}
      <p>
        If the coils stack on top of each other instead of lying side by side, the knot has
        twisted as you drew it down. Cut it off and start again — a knot that looks wrong is
        wrong, and it will fail on the fish you most wanted to land.
      </p>
    `)}

    ${b.section('Why this knot and not another?', `
      <p>
        The improved clinch is the knot most anglers learn first and most keep using, for a
        practical reason rather than a technical one: it is easy to tie correctly in bad
        light with cold hands, and it works across the whole range of tippet a trout angler
        normally fishes. Published breaking-strain tests disagree with each other about
        whether it is the strongest option, and that argument matters far less than whether
        you can tie it well every time.
      </p>
      <p>
        Its real weakness is heavy material. Above about 2X the coils become difficult to
        seat evenly and the knot gets bulky, which is when a loop knot or a Davy becomes the
        better answer.
      </p>
    `)}

    ${b.section('How it fails', `
      ${b.table(
        ['Symptom', 'Cause', 'Fix'],
        [
          ['Pigtail curl on the tag', 'The knot slipped rather than broke', 'More wraps, or wet it properly before seating'],
          ['Broke at the knot on the strike', 'Seated dry, or tightened with a jerk', 'Lubricate, and draw down slowly'],
          ['Coils crossed over each other', 'Tag twisted during the wraps', 'Retie — a crossed coil cuts into the line'],
          ['Knot slid off a wide-gape eye', 'Too few wraps for the diameter', 'Five minimum, six on 6X and finer'],
        ],
        'Diagnosing a failed clinch from what is left on your tippet'
      )}
    `)}
  `;
}
