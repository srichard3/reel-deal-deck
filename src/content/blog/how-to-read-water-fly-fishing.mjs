export const meta = {
  slug: 'how-to-read-water-fly-fishing',
  title: 'How to Read Water for Trout',
  question: 'How do I read water and find where trout are holding?',
  description:
    'Trout hold where food arrives and the current does not tire them. The eight water types worth casting to, in the order you should fish them.',
  answer:
    'Trout hold where food arrives and current does not tire them: the seams between fast and slow water, the heads and tails of pools, behind and in front of boulders, under cut banks, and in riffles two to four feet deep. Fish the seams first.',
  topic: 'technique',
  date: '2026-08-02',
  updated: null,
  readingTime: 9,
  faqs: [
    {
      q: 'How deep does water need to be to hold trout?',
      a: 'Less than most people think. A riffle 18 inches deep with a broken surface will hold feeding trout all day, because the broken surface is cover. Depth substitutes for cover, and cover substitutes for depth — a fish needs one of the two.',
    },
    {
      q: 'Should I fish upstream or downstream?',
      a: 'Upstream for dead-drifted dry flies and nymphs: trout face into the current, so you approach from behind them and your line lands behind the fly. Downstream for swung streamers and soft hackles, where you want the fly moving across the current under tension.',
    },
    {
      q: 'What is a seam in fly fishing?',
      a: 'The boundary line where fast water meets slow water. It shows on the surface as a visible edge or a line of bubbles and foam. Trout sit in the slow side and feed from the fast side, so the seam is the single most reliable target on any river.',
    },
    {
      q: 'Why does foam matter?',
      a: 'Foam collects where the current concentrates, and the current carries insects. A foam line is a visible map of where the food is going, which is why the old guide phrase is "foam is home". Drift your fly down the foam, not next to it.',
    },
  ],
  howTo: null,
  related: ['dry-fly-vs-nymph', 'what-flies-do-i-need-to-start', 'what-weight-fly-rod-for-trout'],
  relatedFlies: ['elk-hair-caddis', 'pats-rubber-legs', 'pheasant-tail-nymph', 'woolly-bugger'],
  sources: [
    {
      label: 'Gink and Gasoline — 10 Types of Water That Always Hold Trout',
      url: 'https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/',
    },
    {
      label: 'Field & Stream — A Temperature Guide for Trout Fishing',
      url: 'https://fieldandstream.com/stories/fishing/freshwater-fishing/trout-fishing/temperature-guide-trout-fishing',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'A trout needs three things at once: food delivery, shelter from current, and cover from predators. Water offering all three holds fish; water offering one does not.',
      'The seam between fast and slow water is the highest-percentage target on any river. Fish it before anything else.',
      'Broken surface counts as cover. A shallow riffle can hold more feeding fish than the deep pool below it.',
      'Fish the near water first. Most beginners wade through the fish they came to catch.',
    ])}

    ${b.section('What is a trout actually looking for in a river?', `
      <p>
        Three things, simultaneously, and the third is the one anglers forget.
      </p>
      <ol>
        <li><strong>Food delivery.</strong> Current is a conveyor belt. A trout wants to sit where the belt passes close.</li>
        <li><strong>Shelter from the current.</strong> Holding in fast water burns more calories than the food is worth. A trout wants slow water immediately adjacent to fast water, not slow water somewhere else.</li>
        <li><strong>Cover from above.</strong> Ospreys, herons and otters hunt from above. Depth, broken surface, overhanging bank, a log, or shade all count.</li>
      </ol>
      <p>
        Every productive lie on a river is a place where those three overlap. This is why a boulder in
        fast water holds a fish and an identical boulder in a dead backwater does not: the second one
        has shelter and cover but no food arriving.
      </p>
      <p>
        Once you are looking for the overlap rather than for "good-looking water", the river gets much
        smaller and much easier to fish.
      </p>
    `)}

    ${b.section('Where do trout hold? The eight lies worth casting to', `
      ${b.table(
        ['Water type', 'What to look for', 'Why fish hold there', 'First fly to try'],
        [
          ['Seams', 'A visible line where fast meets slow; foam lines', 'Slow water to rest in, fast water to feed from', 'Dead-drifted nymph'],
          ['Riffles, 2–4ft deep', 'Choppy surface, no whitewater, even depth', 'Oxygen, insect production, broken surface as cover', 'Nymph, or a dry in a hatch'],
          ['Pool heads', 'Where the riffle drops into the pool', 'The food funnel of the whole pool', 'Nymph, deep'],
          ['Pool tails', 'Where the pool shallows and speeds up before the next riffle', 'Everything drifting through gets concentrated here', 'Dry fly — fish here are looking up'],
          ['Behind boulders', 'A slick or a V of calm water downstream of a rock', 'Current shadow with food passing both sides', 'Dry-dropper'],
          ['In front of boulders', 'A cushion of slow water on the upstream face', 'Pressure wave creates a genuine dead spot — the overlooked lie', 'Weighted nymph'],
          ['Undercut banks', 'Deep water hard against the bank, often with grass overhanging', 'Total overhead cover, ambush position', 'Streamer, or a terrestrial tight to the bank'],
          ['Pocket water', 'A jumble of rocks and short slots in fast water', 'Dozens of small lies, low fishing pressure', 'Buoyant dry, high-sticked'],
        ]
      )}
      <p>
        If you fish nothing but seams and pool tails for a season, you will out-fish someone casting
        randomly into pretty-looking pools. The list above is roughly in order of reliability.
      </p>
    `)}

    ${b.section('How do I fish a riffle?', `
      <p>
        A riffle is shallow, fast, cobbled water with a broken but not whitewater surface. It is the
        insect factory of a trout stream and, in summer, often the most densely populated water on the
        river. Anglers walk past them because they look too shallow to hold anything.
      </p>
      ${b.steps([
        {
          name: 'Start at the bottom and work up',
          text: 'Fish rest facing upstream. Enter at the downstream end of the riffle and move up, so you are always approaching from behind the fish.',
        },
        {
          name: 'Fish the near water first',
          text: 'Cover the water within 15 feet before you wade into it. The single most common error in riffle fishing is walking through catchable fish to reach a cast you cannot control.',
        },
        {
          name: 'Keep the drift short',
          text: 'A 10 to 20 foot drift with the rod tip high and most of the line off the water beats a 40-foot cast with line lying across three current speeds. Short and clean, then take one step.',
        },
        {
          name: 'Get the fly down fast',
          text: 'In two to three feet of moving water you have a couple of seconds before the drift is over. A tungsten bead or a split shot 12 to 18 inches above the fly buys you that depth immediately.',
        },
        {
          name: 'Grid it out',
          text: 'Fan casts across the width in a systematic pattern, then step up three feet and repeat. Riffles hold fish spread across the whole width, not in one obvious spot.',
        },
      ])}
      <p>
        In broken riffle water a trout has a fraction of a second to decide, which is why an
        impressionistic pattern like an ${b.flyLink('elk-hair-caddis')} works so well there and why
        exact imitation matters far less than it does in a flat pool.
      </p>
    `)}

    ${b.section('How do I fish a seam?', `
      <p>
        Find the line where fast water meets slow. It will be visible as an edge in the surface
        texture, and often as a line of foam and bubbles tracking downstream. Trout sit just inside
        the slow side and move a few inches into the fast side to intercept food.
      </p>
      <p>
        The cast goes into the <em>fast</em> water above the seam, so the fly drifts down the boundary.
        The problem is that your line lands across two current speeds, and the fast one drags the line
        downstream ahead of the fly. That drag is what makes seam fishing look easy and fish badly.
      </p>
      ${b.steps([
        { name: 'Position downstream and to the side', text: 'Stand in the slow water, below the target, casting up and across into the faster lane.' },
        { name: 'Cast with slack', text: 'Aim slightly high and stop the rod so the leader lands with a few gentle curves in it. That slack is your drift budget.' },
        { name: 'Mend immediately', text: 'As soon as the line lands, flip the belly of the line upstream with a lift-and-roll of the rod tip. Do it before drag starts, not after.' },
        { name: 'Track with the rod tip', text: 'Follow the fly downstream with the rod tip, lifting line off the fast water as it goes.' },
        { name: 'Let it swing out', text: 'At the end of the drift, let the fly rise and swing. Takes on the swing are common and hard, and a soft hand keeps you from breaking off.' },
      ])}
    `)}

    ${b.section('Where do the big fish hold?', `
      <p>
        Not usually where the numbers are. Large trout trade feeding efficiency for security, so they
        take the lies that combine heavy cover with a good food lane and then defend them.
      </p>
      <ul>
        <li><strong>Undercut banks on the outside of a bend</strong>, where the current has dug depth right against overhead cover.</li>
        <li><strong>Under and behind woody debris</strong> — log jams, root wads, a fallen tree. Difficult to fish, which is exactly why fish are there.</li>
        <li><strong>The deepest slot of a pool head</strong>, in the fastest oxygenated water, especially in warm weather.</li>
        <li><strong>Bridge and culvert shade</strong>, which offers permanent overhead cover in otherwise featureless water.</li>
      </ul>
      <p>
        These lies punish sloppy approach. Fish them from further away than feels necessary, cast
        fewer and better casts, and expect to lose flies &mdash; if you are not occasionally hanging
        up in the timber, you are not fishing close enough to it. A weighted
        ${b.flyLink('pats-rubber-legs')} bumped along the bottom against a log jam is a classic way to
        find out what actually lives in a river.
      </p>
    `)}

    ${b.section('How does the season change where fish hold?', `
      ${b.table(
        ['Conditions', 'Where fish move to', 'Why'],
        [
          ['Cold water (below ~50°F)', 'Deep, slow pools and pool tails; soft inside bends', 'Metabolism is low; fish will not hold in current or move far for food'],
          ['Prime range (~55–65°F)', 'Riffles, seams, pocket water — spread through the river', 'Comfortable and actively feeding across all water types'],
          ['Warm water (above ~68°F)', 'Riffles, pool heads, spring seeps, tributary mouths', 'Chasing dissolved oxygen, which cold and broken water holds more of'],
          ['High or coloured water', 'Tight to the banks, inside seams, behind any obstruction', 'The main current is unfishable for them; the edges are not'],
          ['Low, clear water', 'Deep pools, undercuts, shade — and mostly at dawn and dusk', 'No cover in the shallows; predation risk is high'],
        ]
      )}
      ${b.warn(
        'When water reaches the upper 60s Fahrenheit, catch-and-release mortality rises sharply and many agencies close or restrict fishing. Carry a stream thermometer, and stop fishing on your own judgement before a regulation makes you. Check your state agency for current restrictions — Idaho’s are published at <a href="https://idfg.idaho.gov/rules/fish">idfg.idaho.gov/rules/fish</a>.'
      )}
    `)}

    ${b.section('What is the one habit that improves this fastest?', `
      <p>
        Stop and watch before you cast. Two minutes, from a position where you are not silhouetted
        against the sky, looking at one section of river. You are collecting three pieces of
        information: where the current lanes actually run, whether anything is rising, and where you
        would sit if you were a fish.
      </p>
      <p>
        The second habit: fish where you are standing before you stand there. Wading anglers push a
        pressure wave ahead of themselves that alerts every fish within twenty feet. The water you
        just walked through was the water you came to fish.
      </p>
      <p>
        And when a piece of water looks perfect and produces nothing after a dozen good drifts, change
        depth before you change fly. Nine times out of ten the fly was fine and it was passing three
        feet above the fish. A ${b.flyLink('woolly-bugger')} that never reaches the bottom of the pool
        is not being refused &mdash; it is not being seen.
      </p>
    `)}

    ${b.faq(meta.faqs)}
    ${b.sources(meta.sources)}
  `;
}
