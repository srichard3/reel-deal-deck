export const meta = {
  slug: 'small-stream-fly-fishing',
  title: 'Fly Fishing Small Streams',
  question: 'How do I fly fish small streams?',
  description:
    'Short casts, close range and stealth. Why approach matters more than casting on a creek, and the gear changes that make tight water fishable.',
  answer:
    'Move upstream so fish are facing away from you, stay low, and keep casts short — most small-stream fish are caught inside twenty feet. Use a shorter rod and a shorter leader than you would on a river, and fish an attractor dry until something tells you otherwise.',
  topic: 'technique',
  date: '2026-08-27',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'Should you fish upstream or downstream on a small stream?',
      a: 'Upstream, almost always. Trout face into the current, so approaching from behind keeps you out of their vision. Fishing downstream on a small creek pushes a bow wave and your shadow ahead of you into every pool.',
    },
    {
      q: 'What size rod is best for small streams?',
      a: 'A shorter, lighter rod than you would use on a river — commonly 6 to 8 feet in a 2 to 4 weight. It clears streamside brush, lands the fly gently at short range, and makes a small trout genuinely enjoyable to play.',
    },
    {
      q: 'How close can you get to trout in a small stream?',
      a: 'Closer than you expect if you move slowly and stay low, and no distance at all if you skyline yourself. Small-stream fish live in shallow water with few escape routes, so they spook at movement more than at noise.',
    },
    {
      q: 'What flies work best on small streams?',
      a: 'Buoyant, visible attractor dries. Small-stream trout are opportunistic rather than selective, so pattern matters far less than presentation and getting the fly into tight pockets without drag.',
    },
  ],
  howTo: null,
  related: ['how-to-read-water-fly-fishing', 'what-weight-fly-rod-for-trout', 'how-to-mend-fly-line', 'what-flies-do-i-need-to-start'],
  relatedFlies: ['royal-wulff', 'humpy', 'beetle', 'elk-hair-caddis'],
  sources: [
    {
      label: 'Gink and Gasoline — 10 Types of Water That Always Hold Trout',
      url: 'https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/',
    },
    {
      label: 'Troutbitten — Fifty Fly Fishing Tips',
      url: 'https://troutbitten.com/2017/09/17/fifty-fly-fishing-tips-8-use-the-davy-knot-heres-why/',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Move upstream. Trout face the current, so approach from behind them.',
      'Stay low and move slowly — movement spooks fish more than noise.',
      'Most fish come inside twenty feet. Distance is not the skill here.',
      'Shorter rod, shorter leader, buoyant attractor dry.',
    ])}

    ${b.section('Why are small streams different?', `
      <p>
        Everything compresses. The casts are shorter, the fish are smaller, the cover is
        tighter, and the margin for a clumsy approach disappears entirely.
      </p>
      <p>
        On a big river you can make mistakes forty feet away and the fish never knows. On a
        creek you are often standing within a rod length of the pool you are fishing, in
        shallow water, with nothing between you and the trout. <strong>Approach becomes the
        primary skill and casting becomes secondary</strong> — which is the reverse of how most
        people are taught.
      </p>
      ${b.note(
        'The compensation is that small-stream trout are usually opportunistic rather than selective. They live in thin, food-poor water and cannot afford to inspect anything for long. Get the fly there without being seen and they will generally eat it.'
      )}
    `)}

    ${b.section('How should you approach the water?', `
      ${b.steps([
        { name: 'Fish upstream', text: 'Trout hold facing into the current. Working upstream puts you permanently behind them, in their blind spot.' },
        { name: 'Stay low', text: 'Crouch, kneel, use the bank. A silhouette against the sky is the single most common reason a pool goes dead before you cast.' },
        { name: 'Move slowly, and stop often', text: 'Fish react to sudden movement far more than to sound. Slow is quiet.' },
        { name: 'Stay out of the water', text: 'Wade only when you must. A bow wave travels upstream ahead of you and empties the next pool.' },
        { name: 'Fish the near water first', text: 'Cast to the closest holding water before you cover the far bank, or you drag line over fish you had not noticed.' },
      ])}
      ${b.warn(
        'The commonest small-stream mistake is walking to the head of a pool to make a comfortable cast, having already spooked everything in it. Fish the water you are standing next to before you go anywhere.'
      )}
    `)}

    ${b.section('What gear changes?', `
      ${b.table(
        ['', 'River', 'Small stream'],
        [
          ['Rod length', '9ft', '6–8ft — clears brush, lands gently'],
          ['Rod weight', '5wt', '2–4wt — a small trout is fun again'],
          ['Leader', '9ft', '6–7.5ft — you cannot turn over 9ft at 15ft'],
          ['Casting distance', '30–50ft', 'Often under 20ft'],
          ['Net', 'Useful', 'Frequently unnecessary'],
          ['Waders', 'Usual', 'Often none — you are on the bank'],
        ],
        'What actually changes on tight water'
      )}
      <p>
        The leader is the change people skip and then struggle with. A nine-foot leader will
        not straighten on a fifteen-foot cast, so the fly lands in a heap. Shorten it. The
        general leader logic is in
        <a href="/blog/leader-vs-tippet/">leader vs tippet</a>, and the rod-weight reasoning is
        in <a href="/blog/what-weight-fly-rod-for-trout/">what weight fly rod for trout</a>.
      </p>
    `)}

    ${b.section('Where do the fish actually hold?', `
      <p>
        Small streams have the same features as big rivers, at one tenth the scale. A pocket
        the size of a dinner plate is genuine holding water.
      </p>
      ${b.table(
        ['Feature', 'Why it holds fish'],
        [
          ['Plunge pools below a drop', 'Depth, oxygen and cover in one place — the best lie on most creeks'],
          ['Undercut banks', 'Overhead cover; often the biggest fish in the stretch'],
          ['Behind boulders', 'A cushion of slow water in fast current'],
          ['Under overhanging brush', 'Shade, cover, and terrestrials falling in'],
          ['The head of any pool', 'Food arrives first; the dominant fish sits here'],
          ['Log jams', 'Complete cover; hard to fish and worth it'],
        ],
        'Small-stream lies, in rough order of productivity'
      )}
      <p>
        The general principles are the same as anywhere —
        <a href="/blog/how-to-read-water-fly-fishing/">how to read water</a> covers them — but
        on a creek you are reading features measured in feet rather than yards.
      </p>
    `)}

    ${b.section('How do you cast in tight cover?', `
      <p>
        Overhead casting is often impossible. Three alternatives cover almost everything:
      </p>
      <ul>
        <li>
          <strong>Roll cast.</strong> No backcast at all. The default when there is brush
          behind you, which on a small stream is most of the time.
        </li>
        <li>
          <strong>Bow-and-arrow cast.</strong> Hold the fly by the hook bend, load the rod tip,
          and release. Delivers a fly ten to fifteen feet into a pocket you could not otherwise
          reach.
        </li>
        <li>
          <strong>Sidearm cast.</strong> Keeps the loop under branches. Also lands the line
          lower and softer, which matters at close range.
        </li>
      </ul>
      ${b.note(
        'Accuracy beats distance by a wide margin here. A fly landing in the right six inches of a plunge pool will out-fish a beautiful forty-foot cast into the wrong part of the same stream.'
      )}
    `)}

    ${b.section('What should you tie on?', `
      <p>
        A buoyant, visible attractor dry, and stay with it. Small-stream trout are rarely
        selective, and a fly you can actually see in dappled light through overhanging trees is
        worth more than a more accurate one you cannot follow.
      </p>
      <ul>
        <li>
          A ${b.flyLink('royal-wulff')} is the classic small-stream attractor — white wings you
          can track, and it floats through pocket water.
        </li>
        <li>
          A ${b.flyLink('humpy')} floats like a cork in the broken water below a plunge, where
          most creek fish live.
        </li>
        <li>
          A ${b.flyLink('beetle')} is the quiet option for a hot afternoon under overhanging
          trees, when a high-riding attractor gets refused.
        </li>
        <li>
          An ${b.flyLink('elk-hair-caddis')} covers the actual hatch when there is one, and
          doubles as a dry-dropper anchor.
        </li>
      </ul>
      <p>
        If a fish refuses twice, move on. There is another pool ten yards upstream and it has
        not seen you yet.
      </p>
    `)}
  `;
}
