export const meta = {
  slug: 'how-to-mend-fly-line',
  title: 'How to Mend Fly Line',
  question: 'How do I stop my fly line from dragging?',
  description:
    'Drag is the most common reason trout refuse a good fly. What causes it, how to see it, and the three mends that fix almost every situation on a trout stream.',
  answer:
    'Drag happens when the current pulls your fly line faster than the fly, making the fly skate unnaturally. Fix it by mending — flipping the belly of the line upstream after the cast, without moving the fly. Mend early, mend often, and cast with slack so the fly gets a head start.',
  topic: 'technique',
  date: '2026-08-27',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'What is drag in fly fishing?',
      a: 'Drag is when the current pulls your line faster than your fly, dragging the fly across the surface at a speed no real insect moves. Trout read it instantly and refuse, which is why a well-chosen fly still gets ignored.',
    },
    {
      q: 'How do you mend a fly line?',
      a: 'After the cast lands, lift the rod tip and roll the belly of the line upstream in a semicircle, placing it above the fly without pulling the fly itself. It is a lift and a flip, not a sideways drag.',
    },
    {
      q: 'Which way should you mend?',
      a: 'Upstream in almost every case, because the faster water is usually between you and the fly. Mend downstream only when your fly is in faster water than your line, which happens when you cast across a slow near-bank seam.',
    },
    {
      q: 'How do you tell if your fly is dragging?',
      a: 'Watch the bubbles and foam beside your fly. If the fly is moving faster or slower than they are, or leaving a small wake, it is dragging. Trout notice it well before you do.',
    },
  ],
  howTo: {
    name: 'Mend fly line to fix drag',
    steps: [
      { name: 'Cast with slack', text: 'Stop the rod high and let the line fall with a few gentle curves. Slack buys the fly a drag-free head start before you have to do anything.' },
      { name: 'Mend immediately', text: 'Mend within a second of the line landing, while it still sits on the surface. A mend attempted after the current grabs the line will move the fly.' },
      { name: 'Lift, then flip', text: 'Raise the rod tip to lift the belly of the line clear of the water, then roll it upstream in a semicircle. Keep the rod tip travelling in an arc, not sideways.' },
      { name: 'Leave the fly alone', text: 'A correct mend moves line and leaves the fly where it is. If the fly twitches, you lifted too much line or flipped too hard.' },
      { name: 'Follow the drift', text: 'Track the fly with the rod tip as it comes down, feeding slack if needed. Mend again as often as the current requires.' },
    ],
  },
  related: ['how-to-read-water-fly-fishing', 'dry-fly-vs-nymph', 'nymph-rig-setup', 'leader-vs-tippet'],
  relatedFlies: ['parachute-adams', 'elk-hair-caddis', 'blue-wing-olive', 'pheasant-tail-nymph'],
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
      'Drag is the most common reason a good fly gets refused.',
      'Mend upstream in almost every situation, within a second of landing.',
      'A mend moves line, not the fly. If the fly twitches, you overdid it.',
      'Slack in the cast prevents more drag than any mend fixes.',
    ])}

    ${b.section('What is drag, and why does it matter so much?', `
      <p>
        A river does not move at one speed. The current in the middle is faster than the
        current at the edges, and faster at the surface than near the bottom. When your line
        lands across those different speeds, the fast water grabs the belly of the line and
        pulls it downstream ahead of your fly.
      </p>
      <p>
        The fly then gets towed. It skates, or hangs unnaturally still, or leaves a small
        V-shaped wake. No real insect does any of that, and a trout that has watched ten
        thousand insects drift past knows it immediately.
      </p>
      ${b.note(
        'This is why anglers change flies all afternoon and catch nothing. The pattern was usually fine. The drift was not.'
      )}
    `)}

    ${b.section('How do you tell if your fly is dragging?', `
      <p>
        Stop watching the fly and watch the water around it.
      </p>
      <ul>
        <li>
          <strong>Compare it to the bubbles.</strong> Pick a bubble or a piece of foam beside
          your fly. If the fly is travelling at a different speed to that bubble, it is
          dragging.
        </li>
        <li>
          <strong>Look for a wake.</strong> Any small V trailing behind the fly is drag,
          however slight.
        </li>
        <li>
          <strong>Watch the leader.</strong> A leader that straightens out and points hard
          downstream is being pulled. A drag-free leader lies in loose curves.
        </li>
      </ul>
      <p>
        Micro-drag — movement too small to see at distance — is what defeats most anglers on
        flat water. If fish are refusing a well-presented ${b.flyLink('parachute-adams')} or
        ${b.flyLink('blue-wing-olive')}, assume micro-drag before you assume the pattern.
      </p>
    `)}

    ${b.section('Which way should you mend?', `
      ${b.table(
        ['Situation', 'Mend', 'Why'],
        [
          ['Fast water between you and the fly', 'Upstream', 'The classic case. The belly races ahead and needs putting back'],
          ['Casting across a slow near-bank seam', 'Downstream', 'Your line is in slower water than the fly and is holding it back'],
          ['Casting straight upstream', 'Usually none', 'The line comes back to you at current speed; strip slack instead'],
          ['Swinging a wet fly or streamer', 'Upstream to slow it, downstream to speed it', 'Here you are controlling swing speed, not eliminating drag'],
        ],
        'Which direction to mend, and when'
      )}
      <p>
        Upstream covers the large majority of trout fishing. If you learn one mend, learn that
        one.
      </p>
    `)}

    ${b.section('How do you actually make the mend?', `
      <p>
        The mistake almost everyone makes at first is sweeping the rod sideways, which drags
        the whole line — fly included — across the surface. A mend is a <strong>lift and a
        flip</strong>, not a sweep.
      </p>
      ${b.steps([
        { name: 'Lift', text: 'Raise the rod tip to peel the belly of the line off the water. Only the belly — leave the leader and fly down.' },
        { name: 'Flip', text: 'Roll the rod tip in a semicircle upstream, throwing the lifted line above the fly.' },
        { name: 'Lower and follow', text: 'Drop the tip and track the fly downstream, feeding slack as needed.' },
      ])}
      ${b.warn(
        'Mend <em>immediately</em>. A mend in the first second is easy, because the line is still sitting on the surface. Three seconds later the current has hold of it, and any mend big enough to matter will yank the fly.'
      )}
    `)}

    ${b.section('How do you stop drag before it starts?', `
      <p>
        Mending fixes drag. Casting well prevents it, and prevention is worth more.
      </p>
      ${b.table(
        ['Technique', 'What it does', 'Use when'],
        [
          ['Slack-line cast', 'Stops the rod high so line lands in curves', 'Almost always — it is the default'],
          ['Reach cast', 'Lays the line upstream of the fly as it lands', 'Casting across current to a specific fish'],
          ['Downstream presentation', 'Fly reaches the fish before the leader does', 'Flat water, wary fish, spinner falls'],
          ['Move your feet', 'Removes the conflicting current entirely', 'Whenever it is possible — the best fix of all'],
        ],
        'Preventing drag rather than correcting it'
      )}
      <p>
        The last one is underrated. Anglers will spend twenty minutes fighting a cross-current
        rather than walking ten paces upstream to a position where no mend is needed at all.
      </p>
    `)}

    ${b.section('Does drag matter for nymphs and streamers too?', `
      <p>
        Yes, but differently.
      </p>
      <ul>
        <li>
          <strong>Nymphs</strong> — drag lifts them out of the feeding zone. A dragging rig
          rides up off the bottom, which is why a ${b.flyLink('pheasant-tail-nymph')} that
          should be ticking gravel ends up in mid-water where nothing is holding.
        </li>
        <li>
          <strong>Streamers</strong> — drag is often the point. You are imitating something
          swimming, so a controlled swing is a presentation rather than a fault.
        </li>
        <li>
          <strong>Emergers and soft hackles</strong> — a deliberate, controlled drag at the end
          of the drift imitates an insect rising to hatch. That lift is where a large share of
          takes come from, so do not cut the drift short.
        </li>
      </ul>
    `)}
  `;
}
