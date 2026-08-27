export const meta = {
  slug: 'do-i-need-waders',
  title: 'Do I Need Waders to Fly Fish?',
  question: 'Do I need waders to fly fish?',
  description:
    'No, and plenty of good fishing happens without them. When waders genuinely matter, when wet wading is better, and the kit that matters more.',
  answer:
    'No. You can fly fish from the bank or wet wade in shorts and wading boots for most of the summer. Waders matter when water is cold enough to shorten your day — roughly below 60°F — or when reaching fish requires standing in water for long periods.',
  topic: 'gear',
  date: '2026-08-27',
  updated: null,
  readingTime: 6,
  faqs: [
    {
      q: 'Can you fly fish without waders?',
      a: 'Yes. You can fish from the bank, and in summer you can wet wade in quick-dry trousers or shorts with wading boots. Many anglers prefer wet wading in warm weather because it is lighter, cooler and cheaper.',
    },
    {
      q: 'At what water temperature do you need waders?',
      a: 'Comfort is personal, but below roughly 60°F most people find wet wading cuts the day short, and below about 55°F it becomes genuinely unpleasant. Cold water pulls heat from your legs far faster than cold air does.',
    },
    {
      q: 'What is more important than waders for a beginner?',
      a: 'Wading boots and a wading belt. Boots give you grip, which is the actual safety issue; a belt worn snug limits how much water enters your waders if you go in. Both cost far less than the waders themselves.',
    },
    {
      q: 'Do waders keep you warm?',
      a: 'Not on their own. Breathable waders are a shell — they keep water out but provide almost no insulation. Warmth comes from what you wear underneath, so plan layers separately.',
    },
  ],
  howTo: null,
  related: ['what-weight-fly-rod-for-trout', 'best-time-of-day-to-fly-fish', 'how-to-read-water-fly-fishing', 'do-i-need-a-fishing-license'],
  relatedFlies: ['chubby-chernobyl', 'elk-hair-caddis'],
  sources: [
    {
      label: 'Field & Stream — Temperature Guide to Trout Fishing',
      url: 'https://fieldandstream.com/stories/fishing/freshwater-fishing/trout-fishing/temperature-guide-trout-fishing',
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
      'No — bank fishing and wet wading cover a great deal of good water.',
      'Waders earn their place below roughly 60°F water, or on big rivers.',
      'Boots and a wading belt matter more than the waders do.',
      'Breathable waders are a shell, not insulation. Layer underneath.',
    ])}

    ${b.section('Do you actually need waders to fly fish?', `
      <p>
        No. This is one of the few genuinely optional pieces of fly fishing equipment, and
        treating it as mandatory has put a lot of people off starting.
      </p>
      <p>
        Plenty of excellent water is fishable from the bank — small streams, spring creeks,
        stillwater margins, and the near side of most rivers. And on warm days you can simply
        walk in.
      </p>
      ${b.note(
        'Standing in the river is also frequently the wrong move. Trout hold closer to the bank than beginners expect, and wading out to make a longer cast often puts you on top of the fish you came to catch.'
      )}
    `)}

    ${b.section('When do waders genuinely matter?', `
      ${b.table(
        ['Situation', 'Waders?', 'Why'],
        [
          ['Summer, water above 65°F', 'No', 'Wet wading is cooler, lighter and cheaper'],
          ['Water 55–65°F', 'Optional', 'Comfort call — you will feel it after an hour or two'],
          ['Water below 55°F', 'Yes', 'Cold water pulls heat fast enough to end the day early'],
          ['Spring runoff, winter, high country', 'Yes', 'Cold water and a real risk of getting properly chilled'],
          ['Big rivers needing long crossings', 'Yes', 'Long periods standing in current'],
          ['Small streams, banks, ponds', 'No', 'You may barely get wet'],
        ],
        'When waders earn their place'
      )}
      <p>
        Roughly: if the water is warm enough that a summer swim sounds pleasant, you do not
        need waders. Below that it becomes a question of how long you want to fish.
      </p>
    `)}

    ${b.section('What is wet wading, and what do you need for it?', `
      <p>
        Wet wading means walking into the river in ordinary clothes and letting your legs get
        wet. It is the standard approach in summer and many experienced anglers prefer it.
      </p>
      ${b.table(
        ['Item', 'Needed?', 'Notes'],
        [
          ['Wading boots', 'Yes', 'The one non-negotiable. Grip is the safety issue'],
          ['Quick-dry trousers or shorts', 'Yes', 'Anything but denim, which stays wet and heavy'],
          ['Neoprene wading socks', 'Recommended', 'Keeps grit out of the boots and adds a little warmth'],
          ['Wading belt', 'If wearing waders', 'Not needed when wet wading'],
        ],
        'Wet wading kit'
      )}
      ${b.warn(
        'Do not wade in trainers or sandals. Wet river rock is genuinely slippery, and the injuries people pick up fly fishing are almost all slips rather than anything to do with the fishing.'
      )}
    `)}

    ${b.section('What matters more than the waders?', `
      <p>
        Two things, both cheaper than the waders themselves.
      </p>
      <ul>
        <li>
          <strong>Wading boots with the right sole.</strong> Felt grips wet rock better than
          anything but is banned in some states because it can transport invasive species —
          <em>check your state's regulations before you buy</em>. Rubber soles are legal
          everywhere and are much improved; studs help on both.
        </li>
        <li>
          <strong>A wading belt, worn snug.</strong> If you go in, a belt slows how fast water
          fills your waders. Wear it outside the waders, tight, at the waist. It comes with
          most waders and is the single most-ignored safety item in the sport.
        </li>
      </ul>
      ${b.note(
        'A wading staff is the third item worth having, and it is the one most people add only after a bad slip. On unfamiliar or pushy water it turns two points of contact into three.'
      )}
    `)}

    ${b.section('If you do buy waders, what should you know?', `
      ${b.table(
        ['', 'Breathable stockingfoot', 'Bootfoot', 'Neoprene'],
        [
          ['Boots', 'Bought separately', 'Built in', 'Usually separate'],
          ['Warmth', 'None — layer underneath', 'None to some', 'Insulating'],
          ['Best for', 'Almost everyone, year round', 'Cold, muddy, easy on and off', 'Deep winter, stillwater'],
          ['Bulk', 'Low', 'High', 'High'],
        ],
        'The three types you will see'
      )}
      <p>
        For a first pair, <strong>breathable stockingfoot waders plus separate boots</strong> is
        the default. They work in every season provided you layer underneath, and you can
        replace boots and waders independently as each wears out.
      </p>
      ${b.warn(
        'Breathable waders provide essentially no insulation. In cold water your warmth comes entirely from base layers and fleece trousers underneath — budget for those separately or you will be cold in expensive waders.'
      )}
    `)}

    ${b.section('So what should a beginner actually do?', `
      ${b.steps([
        { name: 'Fish the bank first', text: 'Spend your first few trips fishing from shore. You will catch fish and learn where they hold without spending anything.' },
        { name: 'Buy wading boots next', text: 'Boots let you wet wade all summer and are needed later whatever waders you eventually buy.' },
        { name: 'Add waders when the season forces it', text: 'When cold water is genuinely shortening your days, buy breathable stockingfoot waders.' },
        { name: 'Wear the belt', text: 'Every time. It costs nothing and it is the item that matters when something goes wrong.' },
      ])}
      <p>
        Money not spent on waders in year one is better spent on a
        ${b.flyLink('chubby-chernobyl')} or two and a lot more time on the water.
      </p>
    `)}
  `;
}
