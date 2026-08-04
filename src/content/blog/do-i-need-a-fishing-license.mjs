export const meta = {
  slug: 'do-i-need-a-fishing-license',
  title: 'Do You Need a Fishing License?',
  question: 'Do I need a fishing license to fly fish?',
  description:
    'Fishing licenses are issued state by state, and catch-and-release does not exempt you. What to check, what extra permits exist, and where to buy.',
  answer:
    'In the United States a fishing license is issued by each state, and in almost every state anyone over a set age needs one to fish public water — including catch-and-release fly fishing. Rules, ages, prices and extra permits vary, so buy from your state agency before you fish.',
  topic: 'practical',
  date: '2026-08-04',
  updated: null,
  readingTime: 6,
  faqs: [
    {
      q: 'Do I need a license if I release everything I catch?',
      a: 'In general, yes. Licensing is usually tied to the act of fishing rather than to keeping fish. Idaho, for example, requires a license to fish and requires species permits even when practicing catch and release. Confirm the rule with your own state agency.',
    },
    {
      q: 'Does a license from one state work in another?',
      a: 'Not usually. Licenses are state-specific. Some neighbouring states have reciprocal agreements on shared boundary waters, and those agreements are narrow and specific. Read the boundary-water rules for both states before fishing one.',
    },
    {
      q: 'Do children need a fishing license?',
      a: 'It depends on the state and on the child’s age — thresholds differ, and some states exempt minors entirely while others require a free or reduced-price permit. Check your state agency’s license page rather than assuming.',
    },
    {
      q: 'What is a free fishing day?',
      a: 'Many states run one or more days a year when residents and non-residents can fish without a license, usually in early summer. Regulations such as seasons, limits and gear restrictions still apply on those days. Dates are published by each state agency.',
    },
  ],
  howTo: null,
  related: ['what-flies-do-i-need-to-start', 'how-to-set-up-a-fly-rod', 'how-to-read-water-fly-fishing'],
  relatedFlies: ['san-juan-worm', 'egg-pattern'],
  sources: [
    { label: 'Idaho Fish and Game — Licenses, tags and permits', url: 'https://idfg.idaho.gov/licenses' },
    { label: 'Idaho Fish and Game — Fishing seasons and rules', url: 'https://idfg.idaho.gov/rules/fish' },
    { label: 'Take Me Fishing — state license portal', url: 'https://www.takemefishing.org/' },
  ],
};

export default function ({ b }) {
  return `
    ${b.warn(
      'Nothing on this page is a legal answer for your water. Fishing law in the United States is set state by state and changes every year. Treat this as a checklist of what to look up, then confirm every point with the wildlife agency for the state you are fishing.'
    )}

    ${b.section('Who issues a fishing license in the United States?', `
      <p>
        Each state does, through its own fish and wildlife agency &mdash; Idaho Fish and Game, Montana
        Fish Wildlife &amp; Parks, the Colorado Parks and Wildlife, and so on. There is no national
        freshwater fishing license, and there is no federal database you can check instead.
      </p>
      <p>
        That decentralisation is the single most important thing to understand about the question. The
        age at which a license becomes required, the price, the duration options, whether tribal or
        federal waters are covered, and which species need an additional permit are all decided at
        state level and all differ.
      </p>
      <p>
        The practical consequence: an answer you read on a forum is an answer about somebody else's
        state.
      </p>
    `)}

    ${b.section('Does catch and release require a license?', `
      <p>
        In general, yes. Licensing is normally attached to the act of fishing, not to what you do with
        the fish afterwards. Releasing everything you catch does not usually change whether you needed
        a license to catch it.
      </p>
      <p>
        Idaho states this explicitly: a license is required to fish, and species permits for steelhead
        and salmon are required even when fishing catch-and-release. Other states express the same
        principle in their own language. It is one of the few points on this page that is close to
        universal &mdash; but it is still worth confirming, because "close to universal" is not the
        same as "true in your state".
      </p>
      ${b.note(
        'A related point that catches people out: in many states the requirement follows the water, not the ground you are standing on. Casting into public water from private land, or from a dock, does not usually remove the requirement.'
      )}
    `)}

    ${b.section('What should I check before I fish a new state?', `
      ${b.steps([
        {
          name: 'Find the state agency, not a third-party site',
          text: 'Search for the state’s fish and wildlife department directly. License-lookalike sites resell at a markup or sell nothing at all. Every state also appears on the Take Me Fishing state portal, which links through to the official agency.',
        },
        {
          name: 'Buy the right license type',
          text: 'Resident and non-resident are priced very differently, and residency has a legal definition — usually a minimum period of domicile. Most states also sell short-term licenses (a day, three days, a week) which are far better value for a trip than an annual.',
        },
        {
          name: 'Check for species permits and stamps',
          text: 'Trout, salmon, steelhead and sturgeon commonly require an additional permit, tag or validation on top of the base license. This is the most frequently missed item, and the fish you are targeting is exactly the one likely to need it.',
        },
        {
          name: 'Read the rules for the specific water',
          text: 'Seasons, daily limits, gear restrictions, and special regulations are set by river reach, not statewide. A river can be open with a two-fish limit in one section and catch-and-release, artificial-fly-only in the next.',
        },
        {
          name: 'Check for closures before you drive',
          text: 'Emergency closures — for drought, high water temperature, spawning, or wildfire — are issued in-season and posted by the agency. Warm-water "hoot owl" restrictions that close fishing after early afternoon are common in the Mountain West in summer.',
        },
        {
          name: 'Carry proof',
          text: 'Most states now accept a digital license on a phone, and most still allow paper. Whichever you use, have it available on the water, along with photo identification.',
        },
      ])}
    `)}

    ${b.section('What kinds of extra rules apply on fly water?', `
      <p>
        Beyond the license itself, a specific stretch of river may carry gear restrictions. These are
        the categories that recur, in the language agencies tend to use. What each one actually means
        is defined by that state's own regulations.
      </p>
      ${b.table(
        ['Restriction you will see posted', 'What it typically governs'],
        [
          ['Artificial flies only / fly fishing only', 'Bans bait, and often defines what counts as a fly and what tackle may be used'],
          ['Artificial lures and flies', 'Broader — permits spinning gear with artificial lures as well as flies'],
          ['Barbless hooks required', 'Barbs must be absent or pinched flat; often applies to specific reaches or seasons'],
          ['Hook or fly number limits', 'A cap on hooks per line, which affects whether a two-fly rig is legal'],
          ['Catch and release', 'All fish must be returned; usually paired with gear restrictions'],
          ['Seasonal closures', 'Dates when a reach is closed, commonly to protect spawning fish'],
        ]
      )}
      <p>
        The "what counts as a fly" question is not academic. Some fly-only regulations define a fly
        by how it is constructed &mdash; materials dressed on a hook, no added scent, no natural bait
        &mdash; and anglers do argue about whether patterns such as a ${b.flyLink('san-juan-worm')} or
        an ${b.flyLink('egg-pattern')} fall inside that definition. The argument is settled by the
        wording in your state's regulation booklet, not by consensus.
      </p>
      <!-- TODO-CONFIRM: the legal definition of "fly" under fly-fishing-only regulations differs
           between states, and some do not define it at all. Do not generalise. If this article is
           ever expanded with specific state definitions, quote each one from the agency’s published
           rules with a direct link. -->
    `)}

    ${b.section('Are there places where the rules are different again?', `
      <p>
        Yes, and they are easy to blunder into.
      </p>
      <ul>
        <li><strong>Tribal lands and reservation waters.</strong> Often governed by the tribe's own permit system, separate from &mdash; and not replaced by &mdash; a state license.</li>
        <li><strong>National parks.</strong> Some require a state license, some issue their own permit, and some do neither. Yellowstone, for example, has its own fishing permit system. Check the park's own site.</li>
        <li><strong>Boundary and shared waters.</strong> Rivers and lakes forming a state line often have a specific reciprocal arrangement with defined limits. Read both states' rules.</li>
        <li><strong>Saltwater.</strong> Usually a separate license or registration from freshwater, sometimes with a federal registry component.</li>
        <li><strong>Private and fee waters.</strong> Access permission is not a license, and a license is not access permission. You generally need both.</li>
      </ul>
    `)}

    ${b.section('How much does a fishing license cost?', `
      <p>
        It varies by state, by residency, by duration and by which permits you add, and every state
        adjusts its fee schedule periodically. Any single number quoted here would be wrong somewhere
        and out of date everywhere, so the honest answer is: look it up on the agency's own license
        page, where the current fee schedule is published in full.
      </p>
      <p>
        What is worth knowing in advance is the <em>structure</em>, because it is broadly consistent:
        an annual resident license is the cheapest per day if you fish more than a handful of times;
        non-resident annuals cost substantially more; and short-term non-resident options exist
        specifically for visitors. If you are travelling to fish for three days, the three-day license
        is almost always the right purchase.
      </p>
      ${b.note(
        'License revenue is not a general tax. Under the federal Sport Fish Restoration programme, state license sales are the basis on which states draw matching federal funds for fisheries work and access. Buying the license is part of how the water gets looked after.'
      )}
    `)}

    ${b.section('What happens if I fish without one?', `
      <p>
        That is a legal question with a state-specific answer, and it is not one to take from a blog.
        Penalties are set in each state's code and can extend beyond a fine to license suspension and
        equipment consequences. Wardens do check, including on small water.
      </p>
      <p>
        The practical advice is simply that buying a license takes about five minutes online, most
        states will sell you one on your phone from the parking area, and the whole question
        disappears. Start at your state agency's license page &mdash;
        <a href="https://idfg.idaho.gov/licenses">Idaho Fish and Game</a> is a clear example of the
        format &mdash; or use the <a href="https://www.takemefishing.org/">Take Me Fishing</a> state
        portal to find the right agency for wherever you are going.
      </p>
    `)}

    ${b.faq(meta.faqs)}
    ${b.sources(meta.sources)}
  `;
}
