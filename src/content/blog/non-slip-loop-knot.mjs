export const meta = {
  slug: 'non-slip-loop-knot',
  title: 'How to Tie a Non-Slip Loop Knot',
  question: 'How do you tie a non-slip loop knot?',
  description:
    'A fixed loop lets a streamer or weighted nymph swing freely instead of being held rigid by the tippet. How to tie it, and when to use it.',
  answer:
    'Make a loose overhand knot in the tippet, pass the tag through the hook eye and back through the overhand, wrap it four or five times around the standing line, then pass it back through the overhand again. Wet it and seat it, and you have a fixed loop the fly moves on.',
  topic: 'knots',
  date: '2026-10-12',
  updated: null,
  readingTime: 5,
  faqs: [
    {
      q: 'When should I use a loop knot instead of a clinch?',
      a: 'On streamers, weighted nymphs and any articulated fly. A tight knot holds the fly in line with the tippet and kills its movement; a loop lets it pivot and jig. On small dry flies the extra bulk is not worth it.',
    },
    {
      q: 'How many wraps does a non-slip loop take?',
      a: 'Four or five on normal trout tippet. The rule of thumb runs the other way from most knots: heavier material takes fewer wraps, so use three on anything above 1X and six or seven on very fine tippet.',
    },
    {
      q: 'Will the loop slip closed on a fish?',
      a: 'Not if it is tied and seated correctly — that is precisely what the "non-slip" refers to. If a loop has closed, the overhand was not drawn down firmly before the final pass.',
    },
  ],
  howTo: {
    name: 'Tie a non-slip loop knot',
    steps: [
      { name: 'Loose overhand', text: 'Make an overhand knot in the tippet about six inches from the end, and leave it open rather than tightening it.' },
      { name: 'Through the eye', text: 'Pass the tag end through the hook eye, then back through the open overhand loop from the same side it came out.' },
      { name: 'Set the loop size', text: 'Slide the overhand towards the eye until the loop is the size you want — a quarter of an inch is plenty for most flies.' },
      { name: 'Wrap the standing line', text: 'Take four or five turns around the standing line with the tag end, working away from the fly.' },
      { name: 'Back through the overhand', text: 'Bring the tag back and pass it through the overhand loop once more, entering the same way as before.' },
      { name: 'Wet and seat', text: 'Lubricate, pull the tag to snug the wraps, then pull the standing line and the fly in opposite directions to lock it.' },
      { name: 'Trim', text: 'Cut the tag close. Check the loop is still open by hooking a finger through it and pulling.' },
    ],
  },
  related: ['improved-clinch-knot', 'best-fly-fishing-knots', 'dry-fly-vs-nymph'],
  relatedFlies: ['woolly-bugger', 'clouser-minnow', 'muddler-minnow'],
  sources: [
    { label: 'Orvis News — Pro Tips: The Only Two Terminal Knots You Really Need', url: 'https://news.orvis.com/fly-fishing/pro-tips-the-only-two-terminal-knots-you-really-need' },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Use it on streamers and weighted flies. It visibly improves how they move.',
      'Heavier tippet takes fewer wraps, which is the opposite of most knots.',
      'A quarter-inch loop is plenty. Bigger loops tangle and do nothing extra.',
      'Draw the overhand down firmly before the last pass, or the loop can close.',
    ])}

    ${b.section('How do you tie a non-slip loop knot?', `
      ${b.steps(meta.howTo.steps)}
    `)}

    ${b.section('What the loop actually does', `
      <p>
        A knot tied tight to the hook eye holds the fly rigidly in line with the tippet. On a
        dry fly that does not matter, because the fly is sitting still. On a streamer it
        matters a great deal: every bit of movement the fly has comes from water pushing
        against it, and a rigid connection damps that movement out.
      </p>
      <p>
        With a loop, the fly pivots at the eye. A weighted streamer jigs on the pause, a
        heavy nymph hangs more naturally in the current, and an articulated fly can actually
        articulate. You can see the difference in clear water from the bank, which is the
        most convincing argument anyone has ever made for a knot.
      </p>
    `)}
  `;
}
