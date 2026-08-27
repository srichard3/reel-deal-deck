export const meta = {
  slug: 'fly-fishing-a-lake-from-shore',
  title: 'Fly Fishing a Lake from Shore',
  question: 'How do I fly fish a lake from shore?',
  description:
    'Stillwater has no current to read, so depth and structure do the work. Where to stand, how to count a fly down, and the retrieves that actually matter.',
  answer:
    'Fish the edges of structure — drop-offs, weed beds, inlets and points — rather than casting into open water. Count your fly down to find the depth fish are holding at, then repeat that count. Retrieve far more slowly than feels productive.',
  topic: 'technique',
  date: '2026-08-27',
  updated: null,
  readingTime: 8,
  faqs: [
    {
      q: 'Where do trout hold in a lake?',
      a: 'Along edges rather than in open water — drop-offs, weed bed margins, inlets and outlets, points, and anywhere depth changes. Featureless middle water holds far fewer fish than the first thirty yards from shore.',
    },
    {
      q: 'How do you find the right depth in stillwater?',
      a: 'Count the fly down. Cast, then count seconds before you begin retrieving. When you get a take, remember the count and repeat it. That count is the depth fish are feeding at, and it is the single most useful number in stillwater fishing.',
    },
    {
      q: 'How fast should you retrieve a fly in a lake?',
      a: 'Much slower than instinct suggests. Most stillwater food moves slowly or barely at all. Start with a very slow figure-of-eight or long, slow pulls with pauses, and speed up only if that produces nothing.',
    },
    {
      q: 'Do you need a boat to fly fish a lake?',
      a: 'No. Fish cruise the margins to feed, especially early and late in the day, and shore anglers often cover the most productive water. A boat helps you reach more of a big lake; it does not put you on better water.',
    },
  ],
  howTo: null,
  related: ['how-to-read-water-fly-fishing', 'what-weight-fly-rod-for-trout', 'best-time-of-day-to-fly-fish', 'do-i-need-waders'],
  relatedFlies: ['balanced-leech', 'snow-cone-midge', 'woolly-bugger', 'scud'],
  sources: [
    {
      label: 'Gink and Gasoline — 10 Types of Water That Always Hold Trout',
      url: 'https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/',
    },
    {
      label: 'Take Me Fishing (RBFF)',
      url: 'https://www.takemefishing.org/',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Fish edges and structure, not open water.',
      'Count the fly down. When you get a take, repeat the count.',
      'Retrieve much slower than feels right.',
      'You do not need a boat — the margins are the productive water.',
    ])}

    ${b.section('Why is a lake harder to read than a river?', `
      <p>
        A river tells you where the fish are. Current concentrates food into seams and lanes,
        and trout hold in predictable places relative to that flow.
      </p>
      <p>
        A lake removes all of it. No current, no seams, no obvious lies — just a large flat
        surface, most of which is empty. That is why stillwater intimidates river anglers, and
        why the ones who learn it tend to have the water to themselves.
      </p>
      <p>
        The replacement for current is <strong>structure and depth</strong>. Trout in lakes are
        not distributed evenly; they patrol edges where food concentrates, and they hold at a
        particular depth on any given day.
      </p>
    `)}

    ${b.section('Where should you cast?', `
      <p>
        Almost never straight out into the middle. The productive water is usually within the
        first thirty yards of the bank, and often within ten.
      </p>
      ${b.table(
        ['Feature', 'Why fish are there', 'How to fish it'],
        [
          ['<strong>Drop-offs</strong>', 'Food washes over the shelf; fish patrol the edge', 'Cast parallel to the shelf, not across it'],
          ['<strong>Weed beds</strong>', 'Holds scuds, damsels, chironomids', 'Fish the margins, not into the weed'],
          ['<strong>Inlets</strong>', 'Cold oxygenated water plus incoming food', 'Best spot on the lake in warm weather'],
          ['Outlets', 'Concentrated flow and food', 'Fish it like a river seam'],
          ['Points', 'Fish rounding them pass close to shore', 'Cast both sides; work the tip'],
          ['Wind-blown shore', 'Wind stacks food against the bank', 'Counter-intuitive but often the best water'],
        ],
        'Stillwater structure, and what to do with it'
      )}
      ${b.note(
        'The wind-blown shore is the one most anglers get backwards. Casting into the wind is unpleasant, so people fish the sheltered bank — while the food, and the fish, have been pushed to the other side.'
      )}
    `)}

    ${b.section('How do you find the right depth?', `
      <p>
        <strong>Count the fly down.</strong> This is the core stillwater skill and it is
        entirely mechanical.
      </p>
      ${b.steps([
        { name: 'Cast and count', text: 'Cast, let the fly sink, and count seconds. Start at ten.' },
        { name: 'Retrieve', text: 'Begin the retrieve at your count. Fish the whole way back to the rod tip.' },
        { name: 'Change the count, not the fly', text: 'No take? Cast again and count to twenty. Then thirty. You are searching the water column in layers.' },
        { name: 'Remember the number', text: 'When a fish takes, note the count. That is the depth they are feeding at today.' },
        { name: 'Repeat it', text: 'Fish that same count until it stops producing, then start searching again.' },
      ])}
      <p>
        Anglers who change flies without changing depth can fish an entire day above the fish.
        The count is worth more than the fly box.
      </p>
    `)}

    ${b.section('How fast should you retrieve?', `
      <p>
        Slower. Then slower again. Almost everything trout eat in a lake moves slowly or hangs
        nearly still, and the most common stillwater mistake is stripping like a river angler
        fishing a streamer.
      </p>
      ${b.table(
        ['Retrieve', 'Speed', 'Imitates'],
        [
          ['Static under an indicator', 'None', 'Chironomid pupa hanging in the water column'],
          ['Figure-of-eight', 'Very slow, continuous', 'Scuds, small nymphs'],
          ['Slow pulls with pauses', 'Slow', 'Leeches, damsel nymphs'],
          ['Short strips', 'Medium', 'Small baitfish'],
          ['Fast strips', 'Fast', 'Fleeing baitfish — the exception, not the rule'],
        ],
        'Retrieves from slowest to fastest'
      )}
      ${b.warn(
        'The take often comes on the pause, not on the pull. If you never pause, you never find out.'
      )}
    `)}

    ${b.section('What should you fish?', `
      <p>
        Stillwater food is a different menu from a river's. Four patterns cover most of it.
      </p>
      <ul>
        <li>
          <strong>Chironomids.</strong> The single most important stillwater food by a wide
          margin. A ${b.flyLink('snow-cone-midge')} suspended static at a measured depth is the
          classic lake technique, and doing nothing at all is the correct retrieve.
        </li>
        <li>
          <strong>Leeches.</strong> Present in almost every lake, available year round. A
          ${b.flyLink('balanced-leech')} under an indicator hangs horizontally the way the real
          animal does, which matters when a fish has several seconds to look.
        </li>
        <li>
          <strong>Scuds.</strong> Where there is weed there are ${b.flyLink('scud')}s, and trout
          that eat them grow fat. Fish the weed margins.
        </li>
        <li>
          <strong>Anything that looks alive.</strong> A ${b.flyLink('woolly-bugger')} retrieved
          slowly covers leeches, damsels and small baitfish at once, and is the right first fly
          on a lake you do not know.
        </li>
      </ul>
    `)}

    ${b.section('What gear changes for stillwater?', `
      ${b.table(
        ['', 'River', 'Lake from shore'],
        [
          ['Rod', '9ft 5wt', '9–10ft 5–6wt — length helps distance and line control'],
          ['Leader', '9ft', '9–12ft; longer for static presentations'],
          ['Line', 'Floating', 'Floating covers most of it; an intermediate helps for depth'],
          ['Indicator', 'Optional', 'Genuinely useful — static presentation needs one'],
          ['Footwear', 'Wading boots', 'Often none — you can fish the bank dry'],
        ],
        'What changes when you leave the river'
      )}
      <p>
        You can fish a lake in trainers. Wading out is frequently counter-productive anyway —
        cruising fish come closer to the bank than people expect, and standing in the water
        pushes them out of range.
      </p>
    `)}

    ${b.section('When should you go?', `
      <p>
        Early and late, more strongly than on a river. Lakes have no current to shelter fish
        from bright light, so trout move into the shallow margins to feed at dawn and dusk and
        drop back to deeper water in the middle of the day.
      </p>
      <p>
        Wind is your friend, within reason. A light ripple breaks up the surface, makes fish
        far less wary, and pushes food to a predictable bank. A dead-flat calm lake in bright
        sun is one of the hardest things in fly fishing.
      </p>
    `)}
  `;
}
