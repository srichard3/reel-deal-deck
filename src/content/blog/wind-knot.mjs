export const meta = {
  slug: 'wind-knot',
  title: 'What to Do With a Wind Knot',
  question: 'What is a wind knot and what do I do about it?',
  description:
    'An overhand knot in your leader, caused by your casting stroke rather than the wind. Why it has to be cut out, and the fault that keeps putting it there.',
  answer:
    'A wind knot is an overhand knot that appears in your leader or tippet. It is caused by a tailing loop in your cast, not by wind. It substantially weakens the line, so cut it out and re-tie rather than picking it apart — and fix the casting fault or it will come straight back.',
  topic: 'knots',
  date: '2026-08-27',
  updated: null,
  readingTime: 5,
  faqs: [
    {
      q: 'What causes a wind knot?',
      a: 'A tailing loop — the fly leg of the cast crossing below the rod leg and flipping over itself. It is a casting fault, usually from applying power too early or too abruptly. Wind makes it more likely but does not cause it.',
    },
    {
      q: 'Does a wind knot weaken your line?',
      a: 'Yes, substantially. An overhand knot creates a sharp bend that concentrates strain at one point. Published figures vary by material and knot, but the practical rule is simple: assume it will break on the next decent fish.',
    },
    {
      q: 'Can you untie a wind knot?',
      a: 'Sometimes, but you should not bother. Even a knot you pick out has already deformed the monofilament at that point. Cut it out and re-tie — it takes about a minute and removes the problem entirely.',
    },
    {
      q: 'How do you stop getting wind knots?',
      a: 'Slow the casting stroke down and apply power smoothly at the end rather than at the start. Widen the loop slightly, and open it deliberately when casting two flies or anything wind-resistant.',
    },
  ],
  howTo: {
    name: 'Deal with a wind knot',
    steps: [
      { name: 'Find it', text: 'Run the leader through your fingers. A wind knot is a small hard bump you can feel more easily than see.' },
      { name: 'Cut above it', text: 'Cut the leader on the rod side of the knot. Do not try to pick it apart — the material is already deformed there.' },
      { name: 'Re-tie the section', text: 'Rejoin with a double or triple surgeon’s knot, or add fresh tippet if the leader is now short.' },
      { name: 'Wet and seat the knot', text: 'Lubricate before tightening. A dry knot generates friction heat that weakens the line as it seats.' },
      { name: 'Fix the cause', text: 'Slow the stroke, apply power later, and widen the loop, or you will be doing this again in ten minutes.' },
    ],
  },
  related: ['best-fly-fishing-knots', 'leader-vs-tippet', 'tippet-size-for-fly-size', 'hopper-dropper-rig'],
  relatedFlies: ['chubby-chernobyl', 'woolly-bugger'],
  sources: [
    {
      label: 'Orvis News — Pro Tips: The Only Two Terminal Knots You Really Need',
      url: 'https://news.orvis.com/fly-fishing/pro-tips-the-only-two-terminal-knots-you-really-need',
    },
    {
      label: 'Hatch Magazine — Understanding Leaders and Tippets',
      url: 'https://www.hatchmag.com/articles/understanding-leaders-and-tippets/7711248',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'It is a casting fault, not weather. The name is misleading.',
      'Cut it out and re-tie. Never fish through one.',
      'Cause: a tailing loop, from powering the stroke too early.',
      'Fix: slow down, apply power later, widen the loop.',
    ])}

    ${b.section('What is a wind knot?', `
      <p>
        A simple overhand knot that appears somewhere in your leader or tippet, apparently from
        nowhere. You did not tie it. You often do not notice it until you break off a fish and
        find a neat little curl on the end of the line.
      </p>
      <p>
        The name is one of fly fishing's more durable pieces of misdirection. It suggests the
        weather did it, which is comforting and mostly untrue.
      </p>
    `)}

    ${b.section('What actually causes it?', `
      <p>
        <strong>A tailing loop.</strong> In a good cast, the fly leg of the line travels above
        the rod leg and the loop unrolls cleanly. In a tailing loop the two cross, the fly end
        dips below, and as the loop unrolls it flips through itself and pulls tight.
      </p>
      <p>
        That crossing is caused by the rod tip dipping below a straight path during the stroke,
        which usually comes from:
      </p>
      ${b.table(
        ['Fault', 'What it does', 'Fix'],
        [
          ['Power applied too early', 'Rod overbends then rebounds, dipping the tip', 'Accelerate smoothly, hardest at the very end'],
          ['Too short a stroke for the line out', 'Forces you to punch it', 'Lengthen the stroke as you carry more line'],
          ['Loop too narrow', 'Less margin before the legs cross', 'Widen the loop deliberately'],
          ['Casting two flies or heavy foam', 'Hinged rig destabilises the loop', 'Open the loop, slow the stroke'],
          ['Trying to beat a headwind', 'Encourages punching', 'Lower the cast, drive it under the wind'],
        ],
        'Where wind knots actually come from'
      )}
      ${b.note(
        'Wind does contribute — it disturbs the loop and tempts you to add power, which is the real culprit. But an angler with a clean stroke gets very few wind knots on a windy day, and an angler with a tailing loop gets them on a still one.'
      )}
    `)}

    ${b.section('How much does it weaken the line?', `
      <p>
        Enough that you should not fish through one. An overhand knot puts a sharp bend in
        monofilament and concentrates the load at that single point, and the line fails there
        under a fraction of its rated strength.
      </p>
      ${b.warn(
        'Published strength-loss figures vary considerably by material, diameter and how tightly the knot seated, so no single number is quoted here. The practical rule is the one that matters: <strong>assume it will break on the next good fish.</strong>'
      )}
      <p>
        This is exactly the kind of failure that costs you the best fish of the day, because a
        small trout will never load the line enough to find the flaw.
      </p>
    `)}

    ${b.section('Should you untie it or cut it out?', `
      <p>
        <strong>Cut it out.</strong> Always. Even if you can pick the knot apart with a needle,
        the monofilament has already been crushed and deformed at that point and it will not
        recover.
      </p>
      <p>
        Cut on the rod side of the knot, then rejoin with a double or triple surgeon's knot, or
        simply tie on fresh tippet if the leader has got short. The whole operation takes about
        a minute. Fishing on with a wind knot to save that minute is one of the worst trades
        available on a river.
      </p>
      <p>
        Knot-tying detail is in <a href="/blog/best-fly-fishing-knots/">which knots you actually
        need</a>.
      </p>
    `)}

    ${b.section('How do you stop them coming back?', `
      ${b.steps([
        { name: 'Slow down', text: 'Most tailing loops are a timing problem. A slower stroke gives the rod time to unload properly.' },
        { name: 'Apply power at the end', text: 'Accelerate smoothly to an abrupt stop, rather than punching at the start of the stroke.' },
        { name: 'Match stroke length to line length', text: 'Short line, short stroke. More line out needs a longer stroke and a longer pause.' },
        { name: 'Widen the loop on purpose', text: 'A slightly wider loop has more margin before the legs cross. Open it deliberately when casting two flies, weight, or a wind-resistant foam dry.' },
        { name: 'Check the leader periodically', text: 'Run it through your fingers between fish. Finding one early costs a minute; finding it late costs a fish.' },
      ])}
      <p>
        The last habit is the one worth building. A quick pull of the leader through your
        fingers after any tangle, any snag, or any cast that felt wrong will find a wind knot
        long before a ${b.flyLink('chubby-chernobyl')} and a good brown trout find it for you.
      </p>
    `)}
  `;
}
