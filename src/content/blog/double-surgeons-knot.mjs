export const meta = {
  slug: 'double-surgeons-knot',
  title: 'How to Tie a Double Surgeon’s Knot',
  question: 'How do you tie a double surgeon’s knot?',
  description:
    'The simplest way to join tippet to leader. Overlap, loop both, pass both ends through twice, then pull all four ends at once.',
  answer:
    'Overlap the leader and the new tippet by about six inches, form a loop with both pieces together, and pass both ends through that loop twice. Wet it and pull all four ends evenly at once. It is the easiest leader-to-tippet join to tie and strong enough for trout fishing.',
  topic: 'knots',
  date: '2026-10-12',
  updated: null,
  readingTime: 5,
  faqs: [
    {
      q: 'Double or triple surgeon’s knot?',
      a: 'Two passes is standard and adequate for most trout fishing. A third pass adds a little strength when joining materials of noticeably different diameter, at the cost of a bulkier knot that catches more weed and casts slightly worse.',
    },
    {
      q: 'Surgeon’s knot or blood knot?',
      a: 'The surgeon’s is easier, faster and more forgiving of diameter mismatch. The blood knot is slimmer and more elegant through the guides. For tippet changes on the water, most anglers tie the surgeon’s and keep the blood knot for building leaders at home.',
    },
    {
      q: 'Why did my surgeon’s knot come apart?',
      a: 'Almost always because all four ends were not pulled at once. The knot seats as a single unit — pull only two of the four and the coils bed down unevenly, and it will slip under load.',
    },
  ],
  howTo: {
    name: 'Tie a double surgeon’s knot',
    steps: [
      { name: 'Overlap the two pieces', text: 'Lay the end of the leader alongside the end of the new tippet, overlapping by about six inches, pointing in opposite directions.' },
      { name: 'Form a loop', text: 'Treating both strands as one, make a simple loop.' },
      { name: 'First pass', text: 'Pass both the tippet end and the leader tag through the loop together.' },
      { name: 'Second pass', text: 'Pass them both through the same loop a second time. That second pass is the "double".' },
      { name: 'Wet it', text: 'Lubricate the whole knot before any tightening. Two strands drawing against each other generate real heat.' },
      { name: 'Pull all four ends', text: 'Grip all four strands — both standing parts and both tags — and pull them evenly at the same time. This is the step that matters most.' },
      { name: 'Trim both tags', text: 'Cut both tags close. A long tag on a leader knot collects weed and catches your fly line.' },
    ],
  },
  related: ['blood-knot', 'leader-vs-tippet', 'tippet-size-for-fly-size'],
  relatedFlies: ['pheasant-tail-nymph', 'elk-hair-caddis'],
  sources: [
    { label: 'Orvis Learning Center — Leader and tippet basics', url: 'https://howtoflyfish.orvis.com/beginner-fly-fishing/tackle-and-gear/leaders-and-tippet' },
  ],
};

export default function ({ b }) {
  return `
    ${b.takeaways([
      'Pull all four ends at once. Nothing else about this knot matters as much.',
      'Two passes for normal work; three when the diameters differ a lot.',
      'It tolerates mismatched diameters better than a blood knot does.',
      'Trim both tags close — a leader knot with a long tag collects weed all day.',
    ])}

    ${b.section('How do you tie a double surgeon’s knot?', `
      ${b.steps(meta.howTo.steps)}
    `)}

    ${b.section('When to use it instead of a blood knot', `
      ${b.table(
        ['', 'Double surgeon’s', 'Blood knot'],
        [
          ['Difficulty', 'Easy — learnable in a minute', 'Fiddly, especially cold'],
          ['Diameter mismatch', 'Handles two or three sizes', 'Wants similar diameters'],
          ['Profile', 'Slightly bulky, sits at an angle', 'Slim and straight'],
          ['Best for', 'Changing tippet on the water', 'Building a tapered leader at home'],
        ],
        'The two standard leader-to-tippet knots compared'
      )}
      <p>
        Both are worth knowing, but if you only learn one, learn this one. It is the knot you
        will tie with cold hands in failing light when a tree has taken your last two feet of
        tippet, and being easy is a genuine strength under those conditions.
      </p>
    `)}
  `;
}
