export const meta = {
  slug: 'dry-fly-vs-nymph',
  title: 'Dry Fly vs Nymph: Which to Fish',
  question: 'Should I fish a dry fly or a nymph?',
  description:
    'Nymphs catch more trout; dry flies are more fun. How to decide in the first two minutes at the water, and what each method actually demands of you.',
  answer:
    'Fish nymphs when nothing is rising, which is most of the time — trout take the large majority of their food subsurface. Fish dry flies when you can see rises or insects on the water. Nymphing catches more trout; dry-fly fishing is more enjoyable for most anglers. Read the water first.',
  topic: 'technique',
  date: '2026-08-01',
  updated: null,
  readingTime: 8,
  faqs: [
    {
      q: 'Do nymphs really catch more fish than dry flies?',
      a: 'On most days on most rivers, yes. Trout take the majority of their food below the surface, so a fly drifting near the bottom is in front of feeding fish far more often than one riding on top. The exception is a strong hatch, when a dry can outfish anything.',
    },
    {
      q: 'Can I fish a dry fly and a nymph at the same time?',
      a: 'Yes — a dry-dropper rig hangs a nymph on a short tippet beneath a buoyant dry fly, which doubles as your strike indicator. It covers two depths at once and is one of the most effective all-round river rigs. Check your state rules on the number of flies allowed.',
    },
    {
      q: 'How do I know if trout are rising?',
      a: 'Look for rings on the surface, noses, or dorsal fins breaking the film. Sit and watch for two full minutes before you cast — most anglers do not, and it is the cheapest information available on the river.',
    },
    {
      q: 'Is nymphing harder to learn than dry-fly fishing?',
      a: 'The casting is easier and the takes are harder. A dry fly shows you the take; a nymph gives you a hesitation in the indicator that you have to interpret. Beginners usually catch fish on nymphs sooner but miss a lot of them at first.',
    },
  ],
  howTo: null,
  related: ['how-to-read-water-fly-fishing', 'what-flies-do-i-need-to-start', 'leader-vs-tippet'],
  relatedFlies: ['parachute-adams', 'pheasant-tail-nymph', 'elk-hair-caddis', 'woolly-bugger'],
  sources: [
    {
      label: 'Hatch Magazine — Understanding Leaders and Tippets',
      url: 'https://www.hatchmag.com/articles/understanding-leaders-and-tippets/7711248',
    },
    {
      label: 'Gink and Gasoline — 10 Types of Water That Always Hold Trout',
      url: 'https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.section('What is the actual difference between a dry fly and a nymph?', `
      <p>
        A dry fly floats on the surface film and imitates an adult insect &mdash; something that has
        already hatched, or fallen in. A nymph sinks and imitates the immature, underwater stage of
        the same insect, which is where nearly every aquatic insect spends nearly all of its life.
      </p>
      <p>
        That life-cycle asymmetry is the whole argument. A mayfly might live underwater as a nymph for
        a year and as a winged adult for a day or two. A trout that eats mayflies therefore spends
        almost all of its feeding time eating nymphs, and only rises to duns during the brief windows
        when duns are actually available.
      </p>
      <p>
        Everything else &mdash; the tackle, the takes, the difficulty &mdash; follows from that one
        fact.
      </p>
    `)}

    ${b.section('Dry fly vs nymph — how they compare', `
      ${b.table(
        ['', 'Dry fly', 'Nymph'],
        [
          ['Where it fishes', 'On the surface film', 'From mid-water to just off the bottom'],
          ['When it works', 'During a hatch, or when fish are looking up', 'Almost always'],
          ['Fish caught per hour', 'Lower on an average day', 'Higher on an average day'],
          ['How you detect a take', 'You see the fish eat it', 'Indicator hesitates, line ticks, or you feel weight'],
          ['Typical rig', '9ft 5X leader, one fly, no weight', '9ft 3X–4X leader, indicator, split shot, one or two flies'],
          ['Casting difficulty', 'Harder — needs an accurate, drag-free presentation', 'Easier — a short lob, not a cast'],
          ['What it demands', 'Observation and delicacy', 'Depth control and attention'],
          ['Why people love it', 'You watch the eat', 'You catch fish when nothing is showing'],
        ]
      )}
      <p>
        The honest summary: if you want to catch the most fish, nymph. If you want the moment where a
        trout tilts up out of the current and takes something you can see, fish a dry. Both are
        legitimate reasons to be on the water, and most good anglers do both on the same day.
      </p>
    `)}

    ${b.section('How do I decide which to fish when I arrive at the river?', `
      ${b.steps([
        {
          name: 'Watch the water for two minutes before you rig up',
          text: 'Do not cast. Stand back from the bank and look at the surface across a riffle, a seam and a flat. You are looking for rings, noses and fins. This is free information that decides your whole approach and almost nobody collects it.',
        },
        {
          name: 'Look for insects in the air and on the water',
          text: 'Duns riding the current, caddis fluttering over the surface, or spinners in a column above the riffle all mean fish are likely to be looking up. No insects at all, in any life stage, means they are almost certainly not.',
        },
        {
          name: 'If fish are rising, fish a dry',
          text: 'Match the approximate size and silhouette of what is on the water. Size is the variable that matters most — a size 16 that is roughly the right shape beats a size 12 that is the right species.',
        },
        {
          name: 'If nothing is rising, fish a nymph',
          text: 'Set your depth so the fly drifts within a foot of the bottom, and cover the water systematically. This is the default state of a trout river and where most of the fishing happens.',
        },
        {
          name: 'If you cannot tell, fish a dry-dropper',
          text: 'A buoyant dry with a small nymph on 18 to 24 inches of tippet beneath it answers the question for you. Whichever one they eat is the answer, and you get it in ten minutes instead of an hour.',
        },
      ])}
    `)}

    ${b.section('When does the dry fly genuinely outfish the nymph?', `
      <p>
        During a real hatch, and it is not close. When a hatch is dense enough that trout lock onto
        duns drifting in the surface film, a nymph passing a foot below them can be ignored entirely.
        Fish that are keyed to one stage of one insect become extremely literal about it.
      </p>
      <p>
        The other reliable dry-fly windows:
      </p>
      <ul>
        <li><strong>Terrestrial season.</strong> Mid to late summer, with wind, along grassy banks. Fish sit tight to the bank waiting for hoppers, beetles and ants, and they will move a long way for one.</li>
        <li><strong>Evening spinner falls.</strong> The last hour of light on a warm day, in flat water, when spent adults drift flush in the film.</li>
        <li><strong>Freestone pocket water in summer.</strong> Broken, oxygenated water with opportunistic fish that will take a well-drifted ${b.flyLink('elk-hair-caddis')} without any insect being on the water at all.</li>
      </ul>
      ${b.note(
        'A refused dry fly is information. If a trout rises to your fly and turns away at the last instant, it saw something wrong — usually drag, sometimes size. Change the drift before you change the fly.'
      )}
    `)}

    ${b.section('When is the nymph the only sensible choice?', `
      <p>
        Cold water. Below roughly 50°F, insect activity drops off and trout hold deep in slower water,
        conserving energy. They will not move far or upward for a meal, so the fly has to arrive at
        their depth. This is most of winter and much of early spring on most trout rivers.
      </p>
      <p>
        High or coloured water, for the same reason plus visibility: a fly on the surface of a
        turbid river is invisible to a fish holding two feet down. Bright water, dead-drifted deep,
        is the answer.
      </p>
      <p>
        And any time you simply have no surface information &mdash; midday, flat light, nothing
        hatching, nothing rising. A ${b.flyLink('pheasant-tail-nymph')} drifted through the bottom
        third of a riffle catches fish on days when the surface tells you nothing at all.
      </p>
    `)}

    ${b.section('What about streamers — where do they fit?', `
      <p>
        A third method, and worth knowing you have it. A streamer imitates something swimming
        &mdash; baitfish, leeches, crayfish &mdash; and is retrieved rather than drifted. It targets
        larger, more aggressive fish and covers water quickly.
      </p>
      ${b.table(
        ['Method', 'You are imitating', 'Presentation', 'Fish it when'],
        [
          ['Dry fly', 'An adult insect on the surface', 'Dead drift, drag-free', 'Fish are rising or insects are up'],
          ['Nymph', 'An immature insect underwater', 'Dead drift, near the bottom', 'Nothing is showing — the default'],
          ['Streamer', 'A baitfish, leech or crayfish', 'Active retrieve or swing', 'High or coloured water; low light; hunting a big fish'],
        ]
      )}
      <p>
        A ${b.flyLink('woolly-bugger')} swung across and downstream is the least technical way to
        catch a trout that exists. It requires no drag management and no depth control, which is
        exactly why it is a good thing to fall back on when the drift-based methods are not working
        and you want to fish rather than fiddle.
      </p>
    `)}

    ${b.section('Which should a beginner start with?', `
      <p>
        Start with a dry fly, for a reason that has nothing to do with catch rates: you can see
        everything. You can see the fly, you can see whether it is dragging, and you can see the take.
        Every mistake you make is visible, so you learn drift management &mdash; the skill that
        underpins all of it &mdash; in a way that watching an indicator does not teach.
      </p>
      <p>
        A ${b.flyLink('parachute-adams')} in #14 or #16, fished upstream on a 9-foot 5X leader, on
        broken water in the middle of the day, is a genuinely good first exercise even when fish are
        not rising. Then move to nymphing once you can hold a drag-free drift for three seconds,
        because at that point the indicator is telling you about a drift you already understand.
      </p>
      <p>
        Where to put that drift is a separate skill and the one that pays best.
        <a href="/blog/how-to-read-water-fly-fishing/">How to read water for trout</a> covers it.
      </p>
    `)}

    ${b.faq(meta.faqs)}
    ${b.sources(meta.sources)}
  `;
}
