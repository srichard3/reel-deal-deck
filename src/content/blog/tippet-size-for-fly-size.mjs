export const meta = {
  slug: 'tippet-size-for-fly-size',
  title: 'What Tippet Size for Which Fly',
  question: 'What size tippet should I use for what size fly?',
  description:
    'The rule of 3, a full X-size to hook-size chart, and when to deliberately break it. One table that answers the question most anglers guess at.',
  answer:
    'Divide the hook size by three and round to the nearest X. A size 16 fly takes 5X, a size 20 takes 6X or 7X. Go one size finer on flat, clear water and one size heavier when you are fishing weight, streamers, or anywhere a fish can reach cover.',
  topic: 'gear',
  date: '2026-08-27',
  updated: null,
  readingTime: 6,
  faqs: [
    {
      q: 'What is the rule of 3 in fly fishing?',
      a: 'Divide the hook size by three and round to the nearest X size. A size 12 fly takes 4X, a size 18 takes 6X. It is a starting point, not a law — conditions move you a size either way.',
    },
    {
      q: 'Does a higher X number mean thicker or thinner tippet?',
      a: 'Thinner. X is a diameter scale that runs backwards: 7X is finer than 0X. Diameter in thousandths of an inch equals 11 minus the X number, so 5X is 0.006in and 0X is 0.011in.',
    },
    {
      q: 'What happens if my tippet is too heavy for the fly?',
      a: 'A small fly on heavy tippet will not drift naturally — the stiff, thick material drags it and holds it unnaturally straight. On flat water that produces refusals from fish that would otherwise have eaten it.',
    },
    {
      q: 'What happens if my tippet is too light?',
      a: 'You break off fish, and you struggle to turn the fly over on the cast. Fine tippet on a big or wind-resistant fly collapses in a pile instead of straightening, which ruins the presentation before drag ever gets a chance to.',
    },
  ],
  howTo: null,
  related: ['leader-vs-tippet', 'best-fly-fishing-knots', 'what-weight-fly-rod-for-trout', 'dry-fly-vs-nymph'],
  relatedFlies: ['adams', 'zebra-midge', 'chubby-chernobyl', 'trico'],
  sources: [
    {
      label: 'Hatch Magazine — Understanding Leaders and Tippets',
      url: 'https://www.hatchmag.com/articles/understanding-leaders-and-tippets/7711248',
    },
    {
      label: 'Orvis News — Pro Tips: The Only Two Terminal Knots You Really Need',
      url: 'https://news.orvis.com/fly-fishing/pro-tips-the-only-two-terminal-knots-you-really-need',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Rule of 3: hook size ÷ 3, rounded to the nearest X.',
      'Higher X = thinner. Diameter in thousandths = 11 − X.',
      'One size finer on flat clear water. One size heavier for weight, streamers or cover.',
      'X is diameter only. Breaking strength varies by brand — read the spool.',
    ])}

    ${b.section('What size tippet for what size fly?', `
      <p>
        This is the whole answer, and most days you will not need to think past it.
      </p>
      ${b.table(
        ['Tippet', 'Diameter', 'Hook sizes', 'Typical use'],
        [
          ['0X', '0.011in', '#1/0–#2', 'Big streamers, bass, pike'],
          ['1X', '0.010in', '#4–#8', 'Large streamers, big foam dries'],
          ['2X', '0.009in', '#6–#10', 'Streamers, large stonefly nymphs'],
          ['3X', '0.008in', '#8–#14', 'Weighted nymph rigs, hoppers'],
          ['4X', '0.007in', '#12–#16', 'General nymphing, larger dries'],
          ['<strong>5X</strong>', '<strong>0.006in</strong>', '<strong>#14–#18</strong>', '<strong>The all-round trout default</strong>'],
          ['6X', '0.005in', '#16–#22', 'Small dries, clear water, wary fish'],
          ['7X', '0.004in', '#18–#24', 'Midges, flat water, spring creeks'],
        ],
        'Tippet size to hook size — start here, then adjust for conditions'
      )}
      <p>
        If you carry three spools, carry <strong>4X, 5X and 6X</strong>. That covers the
        overwhelming majority of trout fishing in North America.
      </p>
    `)}

    ${b.section('How does the rule of 3 actually work?', `
      <p>
        Divide the hook size by three and round to the nearest whole number. That number is
        your X size.
      </p>
      ${b.table(
        ['Fly size', 'Divided by 3', 'Tippet'],
        [
          ['#12', '4', '4X'],
          ['#15', '5', '5X'],
          ['#16', '5.3 → 5', '5X'],
          ['#18', '6', '6X'],
          ['#22', '7.3 → 7', '7X'],
        ],
        'The rule of 3 worked through'
      )}
      <p>
        It is arithmetic, not physics, and it is approximate on purpose. What it gets right is
        the relationship: as flies get smaller, tippet must get finer, or the fly stops
        behaving like an insect.
      </p>
    `)}

    ${b.section('Why does the X number run backwards?', `
      <p>
        X is a diameter scale inherited from the days when silkworm gut was drawn through a
        die — each pass through a finer hole earned another X. Higher X means thinner.
      </p>
      <p>
        The conversion is a subtraction: <strong>diameter in thousandths of an inch equals 11
        minus the X number</strong>. So 5X is 0.006in, 2X is 0.009in, and 7X is 0.004in.
      </p>
      ${b.warn(
        'Breaking strength is <em>not</em> fixed by X size. Two 5X spools from different manufacturers can differ by several pounds, because strength depends on the material and how it was drawn. Treat X as diameter only and read the pound test printed on the spool.'
      )}
    `)}

    ${b.section('When should you break the rule?', `
      <p>
        The rule of 3 assumes an average day. Conditions move you a size in one direction or
        the other, and knowing which direction is most of the skill.
      </p>
      ${b.table(
        ['Situation', 'Adjust', 'Why'],
        [
          ['Flat, clear, slow water', 'One size finer', 'Fish get a long look; thick tippet is visible and stiffens the drift'],
          ['Heavily fished water', 'One size finer', 'Educated fish refuse anything that drifts unnaturally'],
          ['Fishing split shot or a heavy point fly', 'One size heavier', 'Weight puts shock load on the knot'],
          ['Streamers', 'Two or three sizes heavier', 'Takes are violent and the fly is large'],
          ['Fish holding near timber or weed', 'One size heavier', 'You need to turn a fish before it reaches cover'],
          ['Wind', 'One size heavier', 'Fine tippet will not turn a fly over into a headwind'],
        ],
        'When to deviate, and in which direction'
      )}
      <p>
        A useful test: if you are getting refusals from fish that clearly saw the fly, go finer.
        If you are breaking off or landing in a pile, go heavier.
      </p>
    `)}

    ${b.section('Does the fly type change the answer?', `
      <p>
        It changes it more than the hook size does, in some cases.
      </p>
      <ul>
        <li>
          <strong>Small dries and midges</strong> — go by the rule or finer. A
          ${b.flyLink('trico')} on 4X will not drift correctly no matter how well you cast.
        </li>
        <li>
          <strong>Big foam attractors</strong> — go heavier than the rule suggests. A
          ${b.flyLink('chubby-chernobyl')} is wind-resistant and often carries a dropper;
          3X or 4X turns it over where 5X collapses.
        </li>
        <li>
          <strong>Weighted nymphs</strong> — heavier than the rule. A
          ${b.flyLink('zebra-midge')} is tiny, but if it is trailing behind a tungsten
          anchor fly, the tippet is carrying that weight too.
        </li>
        <li>
          <strong>General dries</strong> — the rule works as written. An
          ${b.flyLink('adams')} in #14 on 5X is about as standard as trout fishing gets.
        </li>
      </ul>
    `)}

    ${b.section('Monofilament or fluorocarbon?', `
      ${b.table(
        ['', 'Nylon monofilament', 'Fluorocarbon'],
        [
          ['Buoyancy', 'Floats — better for dries', 'Sinks — better subsurface'],
          ['Visibility in water', 'Slightly more visible', 'Refracts closer to water'],
          ['Abrasion resistance', 'Lower', 'Higher'],
          ['Knot forgiveness', 'More forgiving', 'Needs care and lubrication'],
          ['Cost', 'Lower', 'Higher'],
          ['Best for', 'Dry flies, general use', 'Nymphs, streamers, rocky water'],
        ],
        'The practical difference between the two materials'
      )}
      ${b.note(
        'Most anglers carry both: nylon on the dry-fly spools, fluorocarbon on the nymph and streamer spools. If you are buying one, buy nylon — it is cheaper, more forgiving in knots, and the difference matters less than a good drift does.'
      )}
    `)}
  `;
}
