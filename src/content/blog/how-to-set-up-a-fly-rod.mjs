const STEPS = [
  {
    name: 'Assemble the rod from the tip down',
    text: 'Join the two sections nearest the tip first, then work toward the butt. Push each ferrule together with the guides about a quarter-turn out of line, then twist them into alignment as you seat it — that twist locks the joint. Sight down the rod from the butt: every guide should sit in one straight line.',
  },
  {
    name: 'Mount the reel',
    text: 'Slide the reel foot into the reel seat and tighten the locking rings until it is firm. Firm, not forced — over-tightening a reel seat is how cork and threads get damaged. The reel hangs below the rod, and the handle sits on whichever side you want to wind with.',
  },
  {
    name: 'Set the retrieve direction before you spool up',
    text: 'Most reels convert between left- and right-hand wind, usually by flipping the spool or reversing a clutch bearing. Decide now: a right-handed caster who holds the rod in the right hand normally winds with the left. Changing your mind after the line is on means stripping it all off again.',
  },
  {
    name: 'Attach backing, then the fly line',
    text: 'Backing goes on first — usually 20lb dacron, roughly 50 to 100 yards for a trout reel — tied to the arbor with an arbor knot and wound on tightly. Then join the fly line’s back end to the backing with a nail knot or the welded loop the line comes with. If a shop spooled the reel for you, this is already done.',
  },
  {
    name: 'Check the fly line is the right way round',
    text: 'Modern weight-forward lines are directional and usually printed with "this end to reel" or similar near the back. Fitting it backwards puts the thin running line at the business end, and the rod will feel dead. Check the print before you wind.',
  },
  {
    name: 'Thread the line through every guide',
    text: 'Pull off eight or ten feet of fly line, double it into a loop, and push the loop up through each guide from the stripping guide to the tip. Doubling it matters — a doubled line will not slither back down the rod if you let go, and a single line end will. Miss a guide and you will find out on the first cast.',
  },
  {
    name: 'Attach the leader',
    text: 'Most fly lines and most tapered leaders have welded loops. Pass the leader loop through the line loop, then pass the whole leader through its own loop and pull tight — a loop-to-loop. Make sure it seats as a square interlock, not a girth hitch, or it will jam in the tip guide.',
  },
  {
    name: 'Add tippet and tie on a fly',
    text: 'Join 18 to 24 inches of tippet to the leader with a double surgeon’s knot, then tie the fly on with an improved clinch or double davy. Wet every knot before you seat it. Hook the fly into the keeper ring above the grip, wind the slack up, and you are rigged.',
  },
];

export const meta = {
  slug: 'how-to-set-up-a-fly-rod',
  title: 'How to Set Up a Fly Rod',
  question: 'How do I set up a fly rod for the first time?',
  description:
    'Assemble, mount the reel, thread the line, attach the leader. A step-by-step first rig-up, plus the four mistakes that cost beginners a morning.',
  answer:
    'Join the rod sections with the guides aligned, seat the reel in the reel seat, thread the fly line up through every guide, then attach a tapered leader loop-to-loop, add tippet, and tie on a fly. A first-time setup takes about fifteen minutes; after that, five.',
  topic: 'basics',
  date: '2026-07-30',
  updated: null,
  readingTime: 6,
  faqs: [
    {
      q: 'Which way should the reel handle face?',
      a: 'Whichever hand you want to wind with. A right-handed caster usually holds the rod in the right hand and winds with the left, so the handle sits on the left. There is no rule, but changing sides later means re-spooling the reel.',
    },
    {
      q: 'Do I need backing on a trout reel?',
      a: 'Yes, though rarely because a trout will run into it. Backing fills the spool so the fly line sits on a larger arbor, which means less line memory and faster retrieves. Fifty to a hundred yards of 20lb dacron is typical for a 5-weight.',
    },
    {
      q: 'How do I take a stuck fly rod apart?',
      a: 'Grip the rod on both sides of the joint with your hands close to the ferrule, and pull straight while twisting slightly in the direction that unwinds the seating twist. Do not grip the guides, do not lever it behind your knees, and never twist hard enough to hear anything.',
    },
    {
      q: 'Should I take the rod apart after every trip?',
      a: 'Yes, and rinse it if you fished salt or silty water. Store it dry, in its tube, with the sections separate. Fly line lasts longer if you also wipe it down occasionally — dirt in the line coating is the main reason lines stop floating.',
    },
  ],
  howTo: {
    name: 'How to set up a fly rod',
    steps: STEPS,
  },
  related: ['what-weight-fly-rod-for-trout', 'leader-vs-tippet', 'best-fly-fishing-knots'],
  relatedFlies: ['woolly-bugger', 'parachute-adams'],
  sources: [
    {
      label: 'University of Kentucky — A Beginner’s Guide to Rods, Reels, and Lines',
      url: 'https://www.uky.edu/~agrdanny/flyfish/newfaq.htm',
    },
    {
      label: 'Hatch Magazine — Understanding Leaders and Tippets',
      url: 'https://www.hatchmag.com/articles/understanding-leaders-and-tippets/7711248',
    },
  ],
};

export default function ({ b }) {
  return `
    ${b.section('What do I need before I start?', `
      <p>
        Five things, in this order of importance: a rod, a reel with backing and fly line already on
        it, a tapered leader, a spool of tippet, and a fly. That is a fishing outfit. Everything else
        &mdash; nippers, forceps, floatant, a net, a pack &mdash; makes the day easier and none of it
        stops you fishing today.
      </p>
      <p>
        If the reel came empty, a fly shop will spool backing and line onto it, usually for the cost
        of the materials or nothing at all. Winding backing on evenly by hand is fiddly, and getting
        it wrong is one of the few setup errors that is annoying to undo.
      </p>
    `)}

    ${b.section('How do I set up a fly rod, step by step?', `
      ${b.steps(STEPS)}
    `)}

    ${b.section('What goes wrong the first time?', `
      ${b.table(
        ['Mistake', 'How you notice', 'Fix'],
        [
          ['Missed a guide when threading', 'The line hangs oddly and the cast collapses', 'Reel in, find the gap, re-thread from that guide up'],
          ['Guides not aligned at the ferrules', 'Line ticks against the blank; casts feel rough', 'Break the joint, realign by eye, re-seat with a twist'],
          ['Fly line on backwards', 'The rod feels dead; nothing loads', 'Strip it all off and reverse it — check the printing'],
          ['Loop-to-loop tied as a girth hitch', 'The connection jams and hangs in the tip guide', 'Undo it and re-pass the leader through its own loop'],
          ['Ferrules not pushed fully home', 'A section flies off mid-cast', 'Seat firmly with a twist; re-check every hour'],
        ]
      )}
      ${b.warn(
        'The one to take seriously is the last. A section that separates in the air lands somewhere you were not looking, and on moving water that often means the bottom of the river. Push the joints together properly and check them through the day — they work loose as you cast.'
      )}
    `)}

    ${b.section('Which fly should I tie on first?', `
      <p>
        Something buoyant, visible and forgiving, because your first hour is about line control, not
        fly selection. A ${b.flyLink('parachute-adams')} in #14 or #16 is easy to see on the water and
        catches fish in a wide range of conditions. If nothing is rising, a
        ${b.flyLink('woolly-bugger')} on a short leader lets you cast across the current and swing it
        &mdash; a technique that requires no drift management at all and still catches trout.
      </p>
      <p>
        Resist starting with a two-fly rig or a strike indicator on day one. Every extra component is
        another thing to tangle, and the tangle happens exactly when a fish rises within reach.
        <a href="/blog/what-flies-do-i-need-to-start/">What flies you actually need to start</a>
        covers building a first box properly.
      </p>
    `)}

    ${b.section('How do I string a fly rod without dropping the line?', `
      <p>
        Push a doubled loop of line through the guides rather than the line end &mdash; a doubled
        line will not slither back out of six guides the moment you let go, and a single end will.
        Three refinements make it easier still.
      </p>
      <ul>
        <li><strong>Rig horizontally.</strong> Rest the rod tip against something stable rather than holding it upright, so you are not fighting the line's weight the whole way up.</li>
        <li><strong>Thread the line before you attach the leader.</strong> A leader already tied on catches its knots and its loop on every guide.</li>
        <li><strong>Count the guides once.</strong> Skipping one is invisible until the cast collapses. Sight up the rod before you pull line off the reel.</li>
      </ul>
    `)}

    ${b.section('How should I break the rod down and store it?', `
      ${b.steps([
        {
          name: 'Cut back to the leader',
          text: 'Remove the fly, and either wind the leader onto the reel or store it on a leader wallet. Do not leave a fly hooked in the keeper ring under tension for weeks — it sets a memory curl into the tippet.',
        },
        {
          name: 'Separate the sections',
          text: 'Pull straight, hands close to the ferrule, with a slight untwist. If a joint is genuinely stuck, cooling it — shade, or a cold rinse — shrinks the male ferrule enough to help.',
        },
        {
          name: 'Dry everything before it goes in the tube',
          text: 'A wet rod in a closed tube is how cork goes black and reel seats corrode. Ten minutes leaning against a wall is enough.',
        },
        {
          name: 'Back the drag off',
          text: 'Store the reel with the drag set light. Leaving it clamped down compresses the drag surfaces over months and makes them grabby.',
        },
      ])}
    `)}

    ${b.faq(meta.faqs)}
    ${b.sources(meta.sources)}
  `;
}
