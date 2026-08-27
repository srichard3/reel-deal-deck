export const meta = {
  slug: 'how-to-set-the-hook',
  title: 'How to Set the Hook on a Trout',
  question: 'How do I set the hook on a trout?',
  description:
    'Dry fly, nymph and streamer hooksets are three different moves. Which to use, how hard, how fast, and why most missed fish are set too early.',
  answer:
    'Lift the rod smoothly to a low side angle rather than snapping it overhead. On a dry fly, pause until the fish has turned down. On a nymph, set the moment the indicator does anything unnatural. On a streamer, do not lift at all — strip-set by pulling line with your hand.',
  topic: 'technique',
  date: '2026-08-27',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'How hard should you set the hook on a trout?',
      a: 'Firmly but smoothly, and never with your whole arm. A trout hook is small and sharp and needs only a few inches of movement. Hard overhead sets break fine tippet and throw the fly at your face when you miss.',
    },
    {
      q: 'Why do I keep missing trout on dry flies?',
      a: 'Almost always because you set too early. A trout takes a dry fly on the way down, so setting at the splash pulls the fly out before the mouth has closed. Wait until the fish has turned and the rise ring has formed.',
    },
    {
      q: 'What is a strip set and when should you use it?',
      a: 'A strip set means pulling line sharply with your line hand while the rod stays low and pointed at the fly. Use it for streamers and any predatory take. If you miss, the fly stays in the water and the fish can come back.',
    },
    {
      q: 'Should you set the hook on every indicator movement?',
      a: 'Yes. Setting costs a second and a re-cast; not setting costs the fish. Most nymph takes look like a pause or a small hesitation rather than a plunge, so treat any unnatural movement as a fish.',
    },
  ],
  howTo: null,
  related: ['nymph-rig-setup', 'dry-fly-vs-nymph', 'how-to-mend-fly-line', 'best-fly-fishing-knots'],
  relatedFlies: ['elk-hair-caddis', 'woolly-bugger', 'pheasant-tail-nymph', 'chubby-chernobyl'],
  sources: [
    {
      label: 'Troutbitten — Fifty Fly Fishing Tips',
      url: 'https://troutbitten.com/2017/09/17/fifty-fly-fishing-tips-8-use-the-davy-knot-heres-why/',
    },
    {
      label: 'Gink and Gasoline — 10 Types of Water That Always Hold Trout',
      url: 'https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Three methods, not one: dry (pause), nymph (instant), streamer (strip).',
      'Set to the side and low, never overhead — a missed overhead set launches the fly at you.',
      'Most missed dry-fly fish were set too early, not too late.',
      'Never lift the rod on a streamer take. Pull line with your hand.',
    ])}

    ${b.section('What are the three hooksets?', `
      ${b.table(
        ['Method', 'Timing', 'Motion', 'Use for'],
        [
          ['<strong>Dry fly</strong>', 'Pause — wait for the fish to turn down', 'Smooth low sweep to the side', 'Any surface take'],
          ['<strong>Nymph</strong>', 'Instant, on any unnatural movement', 'Short, firm lift downstream of the drift', 'Indicator and tight-line rigs'],
          ['<strong>Strip set</strong>', 'Instant, on feel', 'Pull line with the line hand; rod stays low', 'Streamers, poppers, predatory takes'],
        ],
        'The three hooksets and when each applies'
      )}
      <p>
        Using the wrong one is a bigger source of lost fish than any equipment problem. A
        dry-fly set on a streamer take pulls the fly away from a fish that would have come
        back for it.
      </p>
    `)}

    ${b.section('How do you set the hook on a dry fly?', `
      <p>
        <strong>Wait.</strong> This is the hardest instruction in fly fishing to actually
        follow, and the most valuable.
      </p>
      <p>
        A trout eating a dry fly rises, takes it at the top of the arc, and turns back down.
        The mouth is not closed at the splash — it closes on the way down. Setting at the
        moment you see the rise pulls the fly straight out of an open mouth.
      </p>
      <p>
        The old advice is to say "God save the Queen" before setting. The point is not the
        phrase; it is that a full second is roughly right, and that you are waiting for the
        <em>rise ring to form</em>, not for the splash.
      </p>
      ${b.note(
        'Bigger fish need a longer pause than small ones. A large brown takes deliberately and slowly; a six-inch brookie hits and is gone. Adjust to the fish you are actually casting to.'
      )}
      <p>
        This matters most on large, visible flies. A ${b.flyLink('chubby-chernobyl')} eaten by
        a good fish is a slow, confident event, and an early set on one of those is a
        genuinely painful way to lose the best fish of the day.
      </p>
    `)}

    ${b.section('How do you set the hook when nymphing?', `
      <p>
        The opposite instruction: <strong>immediately, on anything unusual.</strong>
      </p>
      <p>
        A nymph take rarely looks like a strike. The indicator pauses, or dips an inch, or
        slides slightly sideways, or simply stops keeping pace with the foam beside it. By the
        time it plunges, the fish has usually already rejected the fly — a trout ejects an
        artificial nymph in well under a second.
      </p>
      ${b.table(
        ['What the indicator does', 'Set?'],
        [
          ['Dips or plunges', 'Yes'],
          ['Pauses or hesitates', 'Yes'],
          ['Slides sideways', 'Yes'],
          ['Twitches once', 'Yes'],
          ['Speeds up relative to the foam', 'Yes'],
          ['Drifts perfectly naturally', 'No'],
        ],
        'When to set on an indicator — the list is deliberately one-sided'
      )}
      <p>
        You will set on a great many rocks. That is the correct cost of doing business. Set
        <em>downstream and low</em>, in the direction the line is already travelling, which
        drives the hook into the corner of the jaw rather than pulling it back out of the mouth.
      </p>
    `)}

    ${b.section('What is a strip set, and why does it matter?', `
      <p>
        For streamers, <strong>do not lift the rod at all.</strong> Keep the rod low and
        pointed down the line, and set by pulling line sharply with your line hand — the same
        motion as a hard strip.
      </p>
      <p>
        Two reasons it beats a rod lift:
      </p>
      <ul>
        <li>
          <strong>It pulls in line with the take.</strong> A predatory fish grabs a
          ${b.flyLink('woolly-bugger')} moving away from it; a direct backward pull drives the
          hook home along that same axis. Lifting the rod pulls the fly upward, out of the
          fish's mouth.
        </li>
        <li>
          <strong>A miss keeps you in the game.</strong> If you strip-set and miss, the fly is
          still in the water and still moving, and an aggressive fish will often come back for
          a second attempt. A missed rod-lift puts the fly ten feet in the air.
        </li>
      </ul>
      ${b.warn(
        'This is the hardest habit to build, because trout anglers spend years training themselves to lift. Practise it deliberately or you will lift under pressure every time.'
      )}
    `)}

    ${b.section('Why is a low, sideways set better than an overhead one?', `
      <p>
        Sweeping the rod to the side and low does three useful things at once:
      </p>
      ${b.table(
        ['', 'Low side set', 'Overhead set'],
        [
          ['Hook angle', 'Into the corner of the jaw', 'Straight up, often out of the mouth'],
          ['Shock on tippet', 'Absorbed along the rod', 'Concentrated — 6X breaks'],
          ['If you miss', 'Fly stays near the water', 'Fly comes back at your head'],
          ['Slack recovery', 'Removes slack as it sweeps', 'Lifts slack without tightening'],
        ],
        'Set direction and what it costs you'
      )}
      <p>
        Then, once the fish is on, get the rod up. High rod, bent through the middle, is what
        protects fine tippet during the fight. The low sweep is for the set only.
      </p>
    `)}

    ${b.section('Why do I keep breaking fish off on the set?', `
      <p>
        Almost always one of four things, in this order:
      </p>
      ${b.steps([
        { name: 'Too much force', text: 'Trout hooks are small and sharp. A few inches of firm movement is enough; a full-arm strike is not.' },
        { name: 'No slack in the system', text: 'A tight line straight to the fly has nothing to absorb the shock. Some slack is protection, not sloppiness.' },
        { name: 'Old or nicked tippet', text: 'Tippet abrades on rocks and teeth. Re-tie after a good fish, and after any drift that touched structure.' },
        { name: 'Tippet too fine for the fly', text: 'Fine tippet on a heavy or wind-resistant fly is a broken knot waiting to happen under load.' },
      ])}
      <p>
        If you are breaking off on the set specifically — rather than during the fight — the
        first two are the likeliest culprits by a wide margin.
      </p>
    `)}
  `;
}
