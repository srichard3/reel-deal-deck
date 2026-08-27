export const meta = {
  slug: 'why-trout-refuse-your-fly',
  title: 'Why Trout Refuse Your Fly',
  question: 'Why do trout keep refusing my fly?',
  description:
    'A diagnostic in order of likelihood. Drag, then size, then depth, then tippet, then pattern — and how to tell which one is actually costing you fish.',
  answer:
    'Almost always drag, not pattern. If a trout rises and turns away, your fly is moving at a different speed to the current. Check drag first, then size, then depth, then tippet diameter. Pattern is the last thing to change and the first thing most anglers reach for.',
  topic: 'technique',
  date: '2026-08-27',
  updated: null,
  readingTime: 8,
  faqs: [
    {
      q: 'Why do trout come up to my fly and turn away?',
      a: 'That is a refusal, and it almost always means drag. The fish committed on silhouette, then saw the fly moving unnaturally as it got close. Fix the drift before you change the fly.',
    },
    {
      q: 'Should I change my fly if trout are refusing it?',
      a: 'Last. Work through drag, size, depth and tippet first. Changing patterns feels productive and is usually the least likely fix, which is why anglers can spend a whole afternoon doing it.',
    },
    {
      q: 'What is the difference between a refusal and a missed take?',
      a: 'A refusal is the fish inspecting and declining — it rises, follows, and turns away without opening its mouth. A missed take means the fish ate and you failed to hook it, which is a hookset problem, not a presentation one.',
    },
    {
      q: 'Does fly size matter more than pattern?',
      a: 'Yes, consistently. Trout key on size and silhouette far more than on exact colour or dressing. Dropping two hook sizes solves more refusals than switching to a different pattern in the same size.',
    },
  ],
  howTo: null,
  related: ['how-to-mend-fly-line', 'tippet-size-for-fly-size', 'nymph-rig-setup', 'what-flies-do-i-need-to-start'],
  relatedFlies: ['parachute-adams', 'blue-wing-olive', 'rusty-spinner', 'barrs-emerger'],
  sources: [
    {
      label: 'Gink and Gasoline — 10 Types of Water That Always Hold Trout',
      url: 'https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/',
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
      'Work the list in order: drag → size → depth → tippet → pattern.',
      'A rise-and-turn-away is a refusal, and refusals are usually drag.',
      'Dropping two hook sizes fixes more refusals than changing pattern.',
      'Pattern is last. It is also what almost everyone changes first.',
    ])}

    ${b.section('What is the order to check?', `
      <p>
        Refusals have causes, and those causes have wildly different frequencies. Working them
        in order of likelihood saves an enormous amount of time.
      </p>
      ${b.table(
        ['Order', 'Cause', 'Tell', 'Fix'],
        [
          ['<strong>1</strong>', '<strong>Drag</strong>', 'Fish rises, follows, turns away', 'Mend, reposition, add slack'],
          ['2', 'Fly too large', 'Steady refusals, fish still feeding', 'Drop two hook sizes'],
          ['3', 'Wrong depth', 'No interest at all, nothing rising', 'Go deeper, add weight'],
          ['4', 'Tippet too heavy', 'Refusals on flat, clear water only', 'Go one X finer, lengthen leader'],
          ['5', 'Wrong stage', 'Fish bulging, not nosing', 'Switch dun → emerger'],
          ['6', 'Pattern', 'Everything above ruled out', 'Change the fly'],
        ],
        'Diagnose in this order — it is roughly the order of frequency'
      )}
      ${b.note(
        'If you take one thing from this page: a refusal is information. A fish that came up and looked has told you it is feeding, it saw your fly, and something about the presentation was wrong. That is far more useful than no response at all.'
      )}
    `)}

    ${b.section('How do I know if drag is the problem?', `
      <p>
        Stop watching the fly and watch the foam beside it. If your fly is travelling at a
        different speed to the bubbles in the same seam, it is dragging — and a trout notices
        that long before you do.
      </p>
      <p>
        The classic signature is a fish that rises confidently, tracks the fly for a foot, and
        then peels away at the last moment. It committed on silhouette and rejected on
        behaviour.
      </p>
      <p>
        Micro-drag is the version that defeats good anglers: movement too small to see at
        distance, on flat water, with a fly like a ${b.flyLink('parachute-adams')} that ought
        to be working. The fix is covered properly in
        <a href="/blog/how-to-mend-fly-line/">how to mend fly line</a> — but the short version
        is to mend earlier, add slack, or simply move your feet so the conflicting current is
        no longer between you and the fish.
      </p>
    `)}

    ${b.section('When is the fly simply too big?', `
      <p>
        Constantly, and it is the second most common cause. Anglers systematically fish flies
        larger than the naturals, because large flies are easier to see and easier to tie on.
      </p>
      ${b.table(
        ['What you see', 'Likely size problem'],
        [
          ['Steady rises, consistent refusals of a good drift', 'Fly is one to two sizes too large'],
          ['Fish eating something invisible to you', 'Naturals are #20 or smaller'],
          ['Refusals only on flat water, takes in the riffle', 'Size matters where fish get a long look'],
          ['Fish spooking off the cast', 'Not size — that is leader or approach'],
        ],
        'Reading a size problem'
      )}
      <p>
        The test costs nothing: tie on the same fly two sizes smaller before you change pattern.
        During a ${b.flyLink('blue-wing-olive')} hatch, dropping from #18 to #22 solves the
        afternoon more often than any fly box does.
      </p>
    `)}

    ${b.section('What if nothing is rising at all?', `
      <p>
        Then it is probably not a refusal problem — it is a depth problem. A fish that never
        appears is not rejecting your fly; it never saw it.
      </p>
      ${b.steps([
        { name: 'Assume you are too shallow', text: 'This is right far more often than it is wrong. Trout take the large majority of their food subsurface, and near the bottom.' },
        { name: 'Add depth before weight', text: 'Move the indicator up first. It is faster than re-rigging and it is usually the actual issue.' },
        { name: 'Then add weight', text: 'If the drift is short or the water fast, the rig may never reach the bottom within the drift at all.' },
        { name: 'Check you are ticking bottom', text: 'You should touch gravel every few drifts. No contact means you are above the fish.' },
      ])}
      <p>
        The full rig detail is in <a href="/blog/nymph-rig-setup/">how to set up a nymph rig</a>.
      </p>
    `)}

    ${b.section('Could it be the tippet?', `
      <p>
        On flat, clear, slow water — yes, and more often than people credit. Heavy tippet does
        two things: it is more visible, and it stiffens the last few inches so the fly cannot
        move freely.
      </p>
      <p>
        The tell is situational. If you get takes in broken water and refusals in the flat
        pool with the same fly, that is tippet and drag, not pattern. Go one X finer and
        lengthen the leader before you open the fly box. The sizing is covered in
        <a href="/blog/tippet-size-for-fly-size/">what tippet size for which fly</a>.
      </p>
      ${b.warn(
        'Going finer has a cost. 7X breaks on a good fish and turns a fly over poorly in wind. Change it because the water demands it, not as a reflex.'
      )}
    `)}

    ${b.section('Are they eating a different stage?', `
      <p>
        This is the one that fools people who are otherwise doing everything right. Your size
        is correct, your drift is clean, and the fish still will not eat — because they are
        taking emergers an inch below the surface, not duns on it.
      </p>
      ${b.table(
        ['Rise form', 'What they are eating'],
        [
          ['Clean nose, visible mouth', 'Adults on the surface'],
          ['Bulge or hump, no nose', 'Emergers just under the film'],
          ['Dorsal fin and tail showing', 'Emergers, fish holding high'],
          ['Splashy, slashing', 'Caddis pupae, moving fast'],
          ['Quiet dimple, barely a ring', 'Spent spinners or midges'],
        ],
        'The rise form tells you the stage'
      )}
      <p>
        A bulge means a ${b.flyLink('barrs-emerger')} rather than a dun. A quiet dimple in the
        last hour of light usually means a ${b.flyLink('rusty-spinner')} — and no dry fly on
        earth will fix a spinner fall except a spinner.
      </p>
    `)}

    ${b.section('When should you finally change the fly?', `
      <p>
        After the other five. And when you do, change <strong>one variable at a time</strong>,
        starting with size, then stage, then colour, then pattern. Changing everything at once
        means that when something works you have learned nothing.
      </p>
      <p>
        There is also a sixth option worth remembering: <strong>move</strong>. A fish that has
        refused three good drifts has been educated by them and is unlikely to change its mind.
        There are other fish in the run, and they have not seen you yet.
      </p>
    `)}
  `;
}
