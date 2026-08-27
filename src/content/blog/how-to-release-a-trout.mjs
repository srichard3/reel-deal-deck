export const meta = {
  slug: 'how-to-release-a-trout',
  title: 'How to Release a Trout Safely',
  question: 'How do I release a trout without killing it?',
  description:
    'Keep it wet, keep it short, and stop fishing when the water is too warm. What actually determines whether a released trout survives.',
  answer:
    'Land the fish quickly, keep it in the water, wet your hands before touching it, and support it facing into the current until it swims off on its own. Use barbless hooks and a rubber net. Above roughly 68°F water, stop fishing — a released trout often will not recover.',
  topic: 'practical',
  date: '2026-08-27',
  updated: null,
  readingTime: 7,
  faqs: [
    {
      q: 'How long can a trout be out of the water?',
      a: 'As briefly as possible, and ideally not at all. Keep the fish in the net in the water while you unhook it. If you want a photograph, get everything ready first and lift for only a moment.',
    },
    {
      q: 'Should you wet your hands before handling a trout?',
      a: 'Yes. Trout carry a protective slime coat that guards against infection, and dry hands, dry cloth and dry nets strip it. Wet hands, a wet rubber net, and no contact with the gills.',
    },
    {
      q: 'When is the water too warm to fish for trout?',
      a: 'Around 68°F is the widely used cut-off. Above it, trout are already stressed by low dissolved oxygen and often fail to recover from being caught even when they swim away looking healthy. Carry a thermometer.',
    },
    {
      q: 'Are barbless hooks better for catch and release?',
      a: 'Yes. They come out faster and cause less damage, which shortens handling time — the thing that matters most. Some waters require them by regulation, so check the rules for the water you are fishing.',
    },
  ],
  howTo: {
    name: 'Release a trout safely',
    steps: [
      { name: 'Land it quickly', text: 'Use enough tippet and rod pressure to end the fight fast. A long fight exhausts the fish far more than the handling does.' },
      { name: 'Keep it in the water', text: 'Bring it to a rubber net and leave the net in the water. Unhook it there rather than lifting it out.' },
      { name: 'Wet your hands', text: 'Before any contact. Never use a dry cloth or a dry glove, and never touch the gills.' },
      { name: 'Unhook gently', text: 'Back the hook out the way it went in, with forceps or hemostats. Barbless comes out in a second.' },
      { name: 'Support and face it upstream', text: 'Cradle it lightly, facing into the current, so clean water passes over the gills. Do not move it back and forth.' },
      { name: 'Let it go on its own', text: 'Wait until it kicks free under its own power. If it will not hold upright, keep supporting it until it does.' },
    ],
  },
  related: ['best-time-of-day-to-fly-fish', 'do-i-need-a-fishing-license', 'winter-fly-fishing', 'how-to-set-the-hook'],
  relatedFlies: ['woolly-bugger', 'parachute-adams'],
  sources: [
    {
      label: 'Take Me Fishing (RBFF) — catch and release guidance',
      url: 'https://www.takemefishing.org/',
    },
    {
      label: 'Idaho Fish and Game — fishing rules',
      url: 'https://idfg.idaho.gov/rules/fish',
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
      'Keep it wet. Air exposure is the variable you control most easily.',
      'Land it fast — the fight tires a fish more than the handling does.',
      'Wet hands, rubber net, forceps, barbless where you can.',
      'Above roughly 68°F, stop fishing. This is the big one.',
    ])}

    ${b.section('What actually determines whether a released trout survives?', `
      <p>
        Four things, and they are not equally weighted:
      </p>
      ${b.table(
        ['Factor', 'Why it matters', 'What you control'],
        [
          ['<strong>Water temperature</strong>', 'Warm water holds less oxygen; a stressed fish cannot recover', 'Whether you fish at all that day'],
          ['<strong>Fight length</strong>', 'Exhaustion builds lactic acid faster than handling does', 'Tippet strength and rod pressure'],
          ['<strong>Air exposure</strong>', 'A trout out of water cannot breathe at all', 'Keeping it in the net, in the river'],
          ['Hook damage', 'Deep or gill hooking is the hardest to survive', 'Barbless hooks, prompt hooksets'],
        ],
        'What kills released fish, roughly in order'
      )}
      ${b.note(
        'Published survival figures vary widely between studies depending on species, water temperature, hook type and handling, so no single percentage is quoted here. Your state wildlife agency is the right source for the water you fish.'
      )}
    `)}

    ${b.section('Why does water temperature matter so much?', `
      <p>
        Warm water holds less dissolved oxygen, and a trout fighting in it is already working
        near its limit before you hook it. Play a fish in warm water and it may swim away
        looking fine and die hours later.
      </p>
      ${b.table(
        ['Water temperature', 'What to do'],
        [
          ['Below 65°F', 'Fish normally, handle well'],
          ['65–68°F', 'Shorten fights, keep fish wet, consider stopping'],
          ['<strong>Above 68°F</strong>', '<strong>Stop fishing for trout</strong>'],
        ],
        'The temperature decision'
      )}
      ${b.warn(
        'This is the single most consequential thing on this page, and the easiest to ignore because the fishing often still <em>feels</em> good. A stream thermometer costs very little. Some states issue hoot-owl restrictions — afternoon closures — in hot spells; check before you go.'
      )}
      <p>
        The seasonal picture is in
        <a href="/blog/best-time-of-day-to-fly-fish/">best time of day to fly fish</a>, which
        covers when the water is likely to be in range at all.
      </p>
    `)}

    ${b.section('How should you handle the fish?', `
      <p>
        The guiding principle: <strong>the fish should stay in the water the entire time</strong>,
        and everything you do should be aimed at making the whole interaction shorter.
      </p>
      <ul>
        <li>
          <strong>Wet hands, always.</strong> The slime coat is a trout's defence against
          infection, and dry hands strip it. Dry cloth and dry gloves are worse.
        </li>
        <li>
          <strong>Rubber net, not knotted mesh.</strong> Knotted nylon abrades slime and fins;
          rubber does far less damage and tangles hooks far less.
        </li>
        <li>
          <strong>Never touch the gills</strong>, and never hold a trout vertically by the jaw.
          Support it horizontally under the belly.
        </li>
        <li>
          <strong>Forceps in easy reach.</strong> Fumbling for pliers is dead time the fish
          pays for.
        </li>
      </ul>
    `)}

    ${b.section('How do you take a photograph without hurting the fish?', `
      <p>
        The honest answer is that the safest photograph is the one taken with the fish still in
        the net in the water. If you want a held shot:
      </p>
      ${b.steps([
        { name: 'Set up first', text: 'Camera out, settings done, person ready. The fish stays in the net in the water until everything is prepared.' },
        { name: 'Lift low and briefly', text: 'Lift over the water, not over rocks, and hold your own breath — when you need to breathe, so does the fish.' },
        { name: 'One or two frames', text: 'Not a burst, not a second attempt. Take it and put the fish back.' },
        { name: 'Back in the water', text: 'Return it to the net and let it recover before releasing.' },
      ])}
      ${b.note(
        'Holding your own breath while the fish is out of the water is the single most useful habit in catch and release. It calibrates you instantly and honestly.'
      )}
    `)}

    ${b.section('How do you know it is ready to go?', `
      <p>
        Face it into the current, support it gently, and wait. Clean water passing over the
        gills does the work. Do not push it back and forth — that forces water over the gills
        in the wrong direction and does more harm than good.
      </p>
      <p>
        <strong>Let the fish decide.</strong> When it is ready it will kick out of your hands
        under its own power. If it rolls or will not hold upright, keep supporting it. A fish
        released before it can hold itself upright will often drift downstream and die.
      </p>
    `)}

    ${b.section('What about hooks and regulations?', `
      <p>
        Barbless hooks come out faster and do less damage, which shortens handling time — the
        thing that matters most. You can pinch a barb down with forceps on any hook you already
        own.
      </p>
      <p>
        Beyond that, rules genuinely vary. Barbless requirements, single-hook water,
        catch-and-release-only stretches and seasonal closures are all set at state level and
        sometimes water by water.
        <strong>Check your state wildlife agency for the water you are fishing</strong> — there
        is no national answer, and this site will not give you one. See
        <a href="/blog/do-i-need-a-fishing-license/">do I need a fishing licence</a> for how to
        find the right rules.
      </p>
      <!-- TODO-CONFIRM: no mortality percentages are stated anywhere on this page,
           deliberately. Published figures vary by species, temperature, hook type
           and handling. If a figure is ever added, cite the specific study. -->
    `)}
  `;
}
