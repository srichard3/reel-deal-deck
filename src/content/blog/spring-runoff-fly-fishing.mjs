export const meta = {
  slug: 'spring-runoff-fly-fishing',
  title: 'Fly Fishing Spring Runoff',
  question: 'How do I fly fish a river during spring runoff?',
  description:
    'High, cold and dirty water pushes trout to the edges. Where they go, what they can still see, and how to tell when a river is genuinely unfishable.',
  answer:
    'Fish the edges. High water pushes trout out of the main current and into the soft, shallow margins, often within a few feet of the bank. Use big, dark or bright flies they can find in dirty water, get them deep, and judge the river on clarity rather than volume.',
  topic: 'seasons',
  date: '2026-08-27',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'Can you fly fish during spring runoff?',
      a: 'Yes, if you change where you fish. Trout move out of the heavy current into the soft margins, so the water you would walk past in summer becomes the water that holds fish. Judge each day on clarity rather than on flow alone.',
    },
    {
      q: 'Where do trout go in high water?',
      a: 'To the edges. Holding in heavy current costs too much energy, so fish push into shallow slack water along banks, behind obstructions, in flooded side channels and anywhere the flow is broken.',
    },
    {
      q: 'What flies work in muddy water?',
      a: 'Large patterns with a strong silhouette or a lot of contrast — big dark stonefly nymphs, bright worms and eggs, and heavy streamers. Fish cannot see subtlety, so give them something findable.',
    },
    {
      q: 'When is a river too high to fish safely?',
      a: 'When you cannot see the bottom in knee-deep water, when the bank is eroding, or when you would not be able to stand up if you slipped. Runoff drowns people every year, and no fish is worth wading a river in flood.',
    },
  ],
  howTo: null,
  related: ['how-to-read-water-fly-fishing', 'winter-fly-fishing', 'nymph-rig-setup', 'best-time-of-day-to-fly-fish'],
  relatedFlies: ['pats-rubber-legs', 'san-juan-worm', 'egg-pattern', 'woolly-bugger'],
  sources: [
    {
      label: 'Gink and Gasoline — 10 Types of Water That Always Hold Trout',
      url: 'https://www.ginkandgasoline.com/fly-fishing-tips-technique/10-types-of-water-that-always-hold-trout/',
    },
    {
      label: 'Field & Stream — Temperature Guide to Trout Fishing',
      url: 'https://fieldandstream.com/stories/fishing/freshwater-fishing/trout-fishing/temperature-guide-trout-fishing',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Fish the edges. The soft margin is where trout go in high water.',
      'Judge the river on clarity, not on flow.',
      'Big, dark or bright, and deep. Subtlety is wasted in dirty water.',
      'Safety first — runoff is the most dangerous water of the year.',
    ])}

    ${b.section('What is spring runoff, and why does it change everything?', `
      <p>
        Snowmelt. As mountain snowpack releases, rivers rise, cool and colour up, often for
        several weeks. In the Mountain West it typically runs somewhere between April and June,
        varying with elevation, snowpack and how fast the weather warms.
      </p>
      <p>
        Three things change at once, and each one moves the fish:
      </p>
      ${b.table(
        ['Change', 'Effect on trout', 'What you do about it'],
        [
          ['<strong>Volume up</strong>', 'Main current too strong to hold in', 'Fish the margins, not the middle'],
          ['<strong>Clarity down</strong>', 'Fish cannot see small or subtle flies', 'Bigger, darker, brighter'],
          ['<strong>Temperature down</strong>', 'Metabolism slows; fish will not chase', 'Slow, deep, close'],
        ],
        'What runoff does, and the response to each'
      )}
    `)}

    ${b.section('Where do the fish actually go?', `
      <p>
        <strong>Out of the current and against the bank.</strong> This is the single most
        important adjustment, and it is counter-intuitive — the water you would dismiss as too
        shallow in July is the water holding fish in May.
      </p>
      ${b.table(
        ['Where to fish', 'Why'],
        [
          ['<strong>The first few feet off the bank</strong>', 'Friction slows the flow; fish can hold there for almost nothing'],
          ['Inside of bends', 'Slower water on the inside of every curve'],
          ['Behind boulders and log jams', 'Any obstruction creates a soft pocket'],
          ['Flooded side channels', 'New slow water, and often food-rich'],
          ['Below feeder creeks', 'Cleaner water entering a dirty river'],
          ['Seams beside the main flow', 'The classic runoff lane — fast water beside slow'],
        ],
        'Runoff holding water'
      )}
      ${b.note(
        'A useful mental model: in summer you fish the river and avoid the banks. In runoff you fish the banks and avoid the river. Anglers who blank during runoff are usually casting into water no trout could possibly hold in.'
      )}
    `)}

    ${b.section('How do you tell if a river is fishable?', `
      <p>
        Judge <strong>clarity, not flow</strong>. A big river running clear is very fishable; a
        modest river running like chocolate milk is not.
      </p>
      ${b.table(
        ['Visibility', 'Verdict', 'Approach'],
        [
          ['2ft or more', 'Good', 'Fish it normally, work the edges'],
          ['1–2ft', 'Fishable', 'Bigger flies, closer, slower'],
          ['6–12in', 'Hard but possible', 'Big dark or bright flies, tight to the bank'],
          ['Under 6in', 'Go somewhere else', 'Try a tailwater or a smaller tributary'],
        ],
        'Reading water clarity'
      )}
      <p>
        The practical test: stand in shin-deep water and look at your boots. If you can see
        them clearly, fish can see your fly. Tailwaters and small high tributaries often clear
        days or weeks before the main stem, and are the standard runoff fallback.
      </p>
    `)}

    ${b.section('What should you fish?', `
      <p>
        Big, and findable. A trout in coloured water is hunting by silhouette and vibration, not
        by inspecting a size 20 midge.
      </p>
      <ul>
        <li>
          <strong>Big stonefly nymphs.</strong> ${b.flyLink('pats-rubber-legs')} is the runoff
          standard — large, dark, heavy, and stoneflies are genuinely abundant and getting
          dislodged by the flow.
        </li>
        <li>
          <strong>Worms.</strong> High water washes real aquatic worms into the drift in
          numbers. A ${b.flyLink('san-juan-worm')} is not a gimmick in these conditions; it is
          matching the hatch.
        </li>
        <li>
          <strong>Eggs.</strong> An ${b.flyLink('egg-pattern')} is bright, findable, and
          genuinely present during spring spawning.
        </li>
        <li>
          <strong>Streamers.</strong> A dark ${b.flyLink('woolly-bugger')} gives a strong
          silhouette. Fish it slowly and close — fish will not chase far in cold water.
        </li>
      </ul>
      <p>
        Get them deep. The rigging is the same as any nymph rig
        (<a href="/blog/nymph-rig-setup/">setup here</a>) but with more weight than feels
        reasonable, because the flow is stronger and the fish are on the bottom.
      </p>
    `)}

    ${b.section('Is it safe?', `
      ${b.warn(
        'Runoff is the most dangerous water of the year, and this is not a formality. Cold water, fast flow, poor visibility and unstable banks combine badly. People drown in it every spring.'
      )}
      <ul>
        <li><strong>Wade far less than usual</strong>, and often not at all. The fish are at the edge anyway.</li>
        <li><strong>If you cannot see the bottom, do not step there.</strong> Runoff rearranges riverbeds and moves holes.</li>
        <li><strong>Wear a wading belt, snug.</strong> Covered in <a href="/blog/do-i-need-waders/">do I need waders</a>.</li>
        <li><strong>Watch the banks.</strong> Undercut, saturated banks collapse without warning.</li>
        <li><strong>Do not fish alone</strong> if you can avoid it, and tell someone where you are.</li>
      </ul>
      <p>
        The fishing is genuinely good if you adapt. It is not good enough to take chances for.
      </p>
    `)}

    ${b.section('When does it end?', `
      <p>
        When the snowpack is spent and the river drops and clears — often quite suddenly. The
        week the river comes into shape after runoff is one of the best of the year: fish have
        been eating well in high water, pressure has been low for weeks, and the first clear
        days can be exceptional.
      </p>
      <p>
        Watch your local gauge and, more usefully, watch the colour. Clarity returns before
        flow does, and fishable clarity in still-high water is a genuinely good combination.
      </p>
    `)}
  `;
}
