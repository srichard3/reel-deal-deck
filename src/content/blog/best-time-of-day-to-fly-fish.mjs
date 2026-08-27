export const meta = {
  slug: 'best-time-of-day-to-fly-fish',
  title: 'Best Time of Day to Fly Fish',
  question: 'What is the best time of day to fly fish?',
  description:
    'It changes with the season, and water temperature explains why. A season-by-season table of the hours worth fishing, and the temperature bands behind it.',
  answer:
    'It depends on the season, because water temperature drives it. In summer, fish early morning and evening and avoid the middle of the day. In spring and autumn, the warmest hours — roughly 10am to 4pm — are usually best. In winter, fish the middle of the day almost exclusively.',
  topic: 'seasons',
  date: '2026-08-27',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'What time of day do trout feed most?',
      a: 'Whenever water temperature sits in their comfortable range, which moves through the day by season. In summer that is dawn and dusk; in winter it is early afternoon. Low light generally helps, but temperature decides more than light does.',
    },
    {
      q: 'What water temperature is best for trout fishing?',
      a: 'Roughly 50 to 65°F is the productive band for most trout. Below about 40°F they feed slowly and rarely move far; above about 68°F they become stressed and should be left alone entirely.',
    },
    {
      q: 'Is it worth fly fishing in the middle of a summer day?',
      a: 'Usually not on freestone streams, where water is warmest and trout are least active. Tailwaters and spring creeks are the exception — a cold bottom release can hold a steady temperature all day.',
    },
    {
      q: 'Should you stop fishing when the water gets too warm?',
      a: 'Yes. Above roughly 68°F trout struggle to recover from being caught, and mortality after release rises sharply. Carry a thermometer and go home rather than fish through it.',
    },
  ],
  howTo: null,
  related: ['how-to-read-water-fly-fishing', 'dry-fly-vs-nymph', 'what-flies-do-i-need-to-start', 'nymph-rig-setup'],
  relatedFlies: ['zebra-midge', 'blue-wing-olive', 'trico', 'chubby-chernobyl'],
  sources: [
    {
      label: 'Field & Stream — Temperature Guide to Trout Fishing',
      url: 'https://fieldandstream.com/stories/fishing/freshwater-fishing/trout-fishing/temperature-guide-trout-fishing',
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
      'Water temperature drives the answer more than light does.',
      'Summer: dawn and dusk. Spring and autumn: the warm middle. Winter: early afternoon only.',
      '50–65°F is the productive band for most trout.',
      'Above 68°F, stop fishing. Post-release mortality rises sharply.',
    ])}

    ${b.section('What is the best time of day to fly fish, by season?', `
      ${b.table(
        ['Season', 'Best hours', 'Why', 'What is usually happening'],
        [
          ['<strong>Spring</strong>', '10am – 4pm', 'Water is cold; it needs the day to warm', 'Blue Wing Olives on grey afternoons'],
          ['<strong>Summer</strong>', 'Dawn – 9am, 7pm – dark', 'Midday water is too warm and too bright', 'Terrestrials early, spinner falls at dusk'],
          ['<strong>Autumn</strong>', '10am – 4pm', 'Cooling water; the warm hours concentrate activity', 'Baetis, and aggressive pre-spawn browns'],
          ['<strong>Winter</strong>', '11am – 3pm', 'The only window water reaches a fishable temperature', 'Midges, fished slow and deep'],
        ],
        'The hours worth fishing, by season'
      )}
      ${b.note(
        'Tailwaters ignore most of this. A dam releasing cold water from the bottom of a reservoir holds a steady temperature year-round, which is exactly why tailwaters fish well in January and in August when the freestone river next door does not.'
      )}
    `)}

    ${b.section('Why does water temperature decide it?', `
      <p>
        Trout are cold-blooded. Their metabolism — and therefore how much they need to eat and
        how far they will move to do it — tracks water temperature directly. Everything else
        about timing follows from that one fact.
      </p>
      ${b.table(
        ['Water temp', 'Trout behaviour', 'How to fish it'],
        [
          ['Below 40°F', 'Barely feeding, holding deep and slow', 'Small nymphs and midges, dead slow, right on the bottom'],
          ['40–50°F', 'Feeding, but unwilling to move far', 'Get the fly to them; expect subtle takes'],
          ['<strong>50–65°F</strong>', '<strong>Actively feeding — the productive band</strong>', '<strong>Everything works. This is the fishing you remember</strong>'],
          ['65–68°F', 'Stressed, seeking oxygen and cold seeps', 'Fish riffles and inflows, or stop'],
          ['Above 68°F', 'Survival mode', 'Stop fishing. Go home'],
        ],
        'Water temperature and what trout do about it'
      )}
      ${b.warn(
        'The 68°F line is an ethical one, not a tactical one. Trout caught in water that warm often die after release even when they swim off looking healthy. A stream thermometer is inexpensive and is the single most useful thing you can add to a summer vest.'
      )}
    `)}

    ${b.section('Does low light matter on its own?', `
      <p>
        Yes, independently of temperature, and for two reasons.
      </p>
      <ul>
        <li>
          <strong>Trout feel safer.</strong> A trout in shallow water in bright sun is exposed
          to ospreys, herons and otters. Low light moves fish into feeding lies they will not
          use at midday.
        </li>
        <li>
          <strong>Insects prefer it.</strong> A great many hatches and nearly all spinner falls
          are triggered by falling light. The last hour before dark is the most reliably
          productive hour of the summer day for that reason alone.
        </li>
      </ul>
      <p>
        An overcast day extends the good hours in both directions. A flat grey drizzle in
        spring or autumn is close to ideal, which is also why
        ${b.flyLink('blue-wing-olive')} hatches have their reputation — they come off heaviest
        in exactly the weather most people stay home for.
      </p>
    `)}

    ${b.section('What should you fish at each time of day?', `
      ${b.table(
        ['Window', 'Water', 'Typical approach'],
        [
          ['Dawn', 'Coolest of the summer day', 'Streamers, or terrestrials tight to the bank'],
          ['Mid-morning', 'Warming', 'Nymphs; watch for the first hatch of the day'],
          ['Midday (summer)', 'Warmest, brightest', 'Rest the water, or find a cold tributary mouth'],
          ['Midday (winter)', 'Warmest of a cold day', 'Midges deep and slow — the only window you get'],
          ['Late afternoon', 'Cooling', 'Hatches restart; dry flies come into play'],
          ['Last hour', 'Falling light', 'Spinner falls and the best dry-fly fishing of the day'],
        ],
        'Time of day and what it usually calls for'
      )}
      <p>
        A ${b.flyLink('zebra-midge')} covers the winter window almost by itself, and a
        ${b.flyLink('trico')} spinner fall is a summer-morning event you can very nearly set a
        watch by.
      </p>
    `)}

    ${b.section('So when should you actually go?', `
      <p>
        The honest answer is: when you can. Anglers lose more fishing to over-planning than to
        bad timing, and a mediocre hour on the water beats a perfect hour at home.
      </p>
      <p>
        But if you have a genuine choice, the priority order is:
      </p>
      ${b.steps([
        { name: 'Match the season', text: 'Warm hours in cold months, cool hours in warm months. This single rule explains most of the table above.' },
        { name: 'Prefer low light', text: 'Dawn, dusk and overcast days beat bright midday sun in every season.' },
        { name: 'Check the water temperature', text: 'A thermometer beats a forecast. Air temperature and water temperature are not the same thing, and only one of them matters.' },
        { name: 'Go anyway', text: 'Conditions are a tilt, not a gate. Fish are caught at every hour of every season by people who turned up.' },
      ])}
    `)}
  `;
}
