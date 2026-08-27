export const meta = {
  slug: 'winter-fly-fishing',
  title: 'How to Fly Fish in Winter',
  question: 'How do I fly fish in winter?',
  description:
    'Cold water changes where trout hold and how far they will move. Slow water, small flies, deep drifts, and the tailwaters that fish all winter.',
  answer:
    'Fish slow, deep water rather than riffles — cold trout will not hold in fast current. Use small nymphs and midges, get them right on the bottom, and drift them slowly. Tailwaters fish best because dam releases hold a steady temperature all winter.',
  topic: 'seasons',
  date: '2026-08-27',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'Can you fly fish in winter?',
      a: 'Yes, and on tailwaters it can be excellent. Trout feed all winter, just slowly and within a narrow band of water. The fishing is quieter, the rivers are empty, and midges hatch every month of the year.',
    },
    {
      q: 'Where do trout hold in winter?',
      a: 'In slow, deep water — the tails of pools, deep runs, and soft seams behind structure. Cold trout will not spend energy holding in fast current, so the riffles that fish well in summer are usually empty.',
    },
    {
      q: 'What flies work best for winter fly fishing?',
      a: 'Small midge patterns, small mayfly nymphs, and egg or worm patterns after rain. Size matters more than pattern: 18 to 22 is the working range on most winter tailwaters.',
    },
    {
      q: 'Why do tailwaters fish better in winter?',
      a: 'A dam releasing water from the bottom of a reservoir delivers a steady temperature year-round. The river below stays in a fishable range while nearby freestone streams drop near freezing.',
    },
  ],
  howTo: null,
  related: ['best-time-of-day-to-fly-fish', 'how-to-read-water-fly-fishing', 'nymph-rig-setup', 'dry-fly-vs-nymph'],
  relatedFlies: ['zebra-midge', 'wd-40', 'san-juan-worm', 'egg-pattern'],
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
      'Fish slow, deep water. Cold trout abandon fast current entirely.',
      'Small flies, sizes 18–22, right on the bottom.',
      'Slow everything down — drifts, retrieves, expectations.',
      'Tailwaters hold a steady temperature and fish all winter.',
    ])}

    ${b.section('What changes about trout in winter?', `
      <p>
        Trout are cold-blooded, so in cold water their metabolism drops and everything follows
        from that. They eat less, they digest slowly, and — the part that matters most on the
        water — <strong>they will not move far for food</strong>.
      </p>
      <p>
        A summer trout will cross a run to intercept a drifting nymph. A winter trout will move
        a few inches. That single fact explains every tactical difference below: you are not
        persuading the fish, you are delivering to it.
      </p>
      ${b.note(
        'This guide is about how to fish winter water. For which hours of a winter day are worth fishing, see the seasonal table in <a href="/blog/best-time-of-day-to-fly-fish/">best time of day to fly fish</a> — the short version is roughly 11am to 3pm.'
      )}
    `)}

    ${b.section('Where do trout hold in winter?', `
      <p>
        <strong>Slow and deep.</strong> Holding in current costs energy a cold fish will not
        spend, so fish leave the fast water they used all summer.
      </p>
      ${b.table(
        ['Water type', 'Summer', 'Winter'],
        [
          ['Riffles', 'Excellent', 'Usually empty'],
          ['Fast pocket water', 'Excellent', 'Empty'],
          ['Tails of pools', 'Good', '<strong>Prime</strong>'],
          ['Deep slow runs', 'Good', '<strong>Prime</strong>'],
          ['Soft seams behind structure', 'Good', '<strong>Prime</strong>'],
          ['Undercut banks', 'Good', 'Good'],
        ],
        'Where the fish move to when the water gets cold'
      )}
      <p>
        Winter fish also stack up. Where summer trout spread through a run, winter trout
        concentrate in the few spots that combine depth and slow flow — so a blank stretch is
        genuinely blank, and a good spot may hold a lot of fish.
      </p>
      ${b.warn(
        'Walk more and cast less. Covering water to find the two or three winter lies in a stretch beats grinding a summer run that no longer holds anything.'
      )}
    `)}

    ${b.section('What should you fish in winter?', `
      <p>
        Small, subsurface, and on the bottom. Midges hatch every month of the year, and in
        winter they are frequently the only thing hatching at all.
      </p>
      ${b.table(
        ['Fly type', 'Sizes', 'When'],
        [
          ['Midge larvae and pupae', '#18–#22', 'The default, all winter'],
          ['Small mayfly nymphs', '#16–#20', 'Any day; before a baetis hatch'],
          ['Egg patterns', '#12–#16', 'During and after spawning runs'],
          ['Worm patterns', '#10–#14', 'After rain or a flow bump'],
          ['Small dries', '#20–#24', 'Only if fish are visibly rising'],
        ],
        'Winter fly selection'
      )}
      <p>
        A ${b.flyLink('zebra-midge')} is close to the whole winter game on a tailwater, and a
        ${b.flyLink('wd-40')} covers the emerging-midge and small-baetis end of it. After a
        flow bump, a ${b.flyLink('san-juan-worm')} is often the fly that produces when nothing
        subtle does, and an ${b.flyLink('egg-pattern')} earns its place below spawning gravel.
      </p>
    `)}

    ${b.section('How do you fish it differently?', `
      ${b.steps([
        { name: 'Go deeper than feels right', text: 'The fly needs to be within inches of the bottom. If you are not ticking gravel occasionally, you are above the fish.' },
        { name: 'Slow everything down', text: 'Dead drift. No swings, no strips, no induced takes. A cold fish will not chase.' },
        { name: 'Lengthen the leader, lighten the tippet', text: 'Winter water is low and clear. 6X and a longer leader make a real difference.' },
        { name: 'Fish the same lie repeatedly', text: 'You are delivering to a fish that will not move. Several drifts through the same lane is correct, not stubborn.' },
        { name: 'Expect subtle takes', text: 'A winter take is a hesitation, not a plunge. Set on anything that is not a natural drift.' },
      ])}
    `)}

    ${b.section('Why do tailwaters fish best in winter?', `
      <p>
        A dam that releases water from the bottom of a reservoir delivers water at a nearly
        constant temperature all year. The river below it stays in a fishable band while a
        freestone stream a valley away drops toward freezing.
      </p>
      ${b.table(
        ['', 'Tailwater', 'Freestone'],
        [
          ['Winter temperature', 'Steady, often 40–50°F', 'Can approach freezing'],
          ['Insect activity', 'Midges year round', 'Very limited'],
          ['Winter fishing', 'Often excellent', 'Difficult, short windows'],
          ['Water clarity', 'Usually clear', 'Clear but very cold'],
        ],
        'Why the same winter day fishes differently on two rivers'
      )}
      <p>
        If you have a tailwater within driving distance, it is the winter destination. It is
        also why tailwater anglers fish twelve months a year and freestone anglers often do not.
      </p>
    `)}

    ${b.section('What about staying safe and comfortable?', `
      <p>
        Winter fishing goes wrong through cold and footing rather than anything to do with
        fish.
      </p>
      <ul>
        <li>
          <strong>Layer under your waders.</strong> Breathable waders are a shell with no
          insulation of their own. Base layer and fleece trousers underneath, not jeans.
        </li>
        <li>
          <strong>Wade less than you would in summer.</strong> Cold water, slippery rock and
          numb feet are a bad combination, and winter fish are often close to the bank anyway.
        </li>
        <li>
          <strong>Keep your hands working.</strong> Fingerless gloves and a spare dry pair
          matter more than any fly you carry — you cannot tie a size 20 midge on with numb
          fingers.
        </li>
        <li>
          <strong>Bring more than you think.</strong> A flask, dry socks, and a plan to get
          warm. Short winter days end faster than you expect.
        </li>
      </ul>
      ${b.note(
        'Handle fish quickly and keep them in the water. A trout in cold water recovers slowly, and winter fish are already operating on a thin energy margin.'
      )}
    `)}
  `;
}
