import { getSignVisualUrl, getSignAltText } from './sign-assets';

/**
 * Comprehensive ASL Alphabet Curriculum Data (A - Z)
 * Provides detailed visual anatomical guides, verbal instruction transcripts for SpeechSynthesis,
 * common mistakes, and practice goals.
 */

export interface ASLLessonData {
  id: number;
  letter: string;
  title: string;
  description: string;
  verbalInstruction: string;
  handshape: string;
  fingerPosition: string;
  thumbPosition: string;
  orientation: string;
  movement: string;
  keyPoints: string[];
  commonMistakes: string[];
  imageUrl: string;
  practiceTip: string;
  difficulty: 'beginner' | 'intermediate';
}

export const ASL_CURRICULUM: ASLLessonData[] = [
  {
    id: 1,
    letter: 'A',
    title: 'Letter A',
    description: "Make a closed fist with your thumb resting straight against the side of your index finger.",
    verbalInstruction: "To sign the letter A, make a closed fist with your fingers curled inward, and rest your thumb upright along the side of your index finger.",
    handshape: "Closed fist with fingers folded inward",
    fingerPosition: "All four fingers curled into a neat, compact fist",
    thumbPosition: "Erect alongside the side of the index finger, not tucked over or under",
    orientation: "Palm facing outward toward your viewer",
    movement: "Static position held steadily at mid-chest height",
    keyPoints: [
      "Keep all four fingers curled tightly into the palm.",
      "Rest the thumb straight up against the outer side of the index finger.",
      "Ensure the thumb points upward and does not tuck across the knuckles."
    ],
    commonMistakes: [
      "Crossing the thumb over the front of your fingers (that makes the letter S).",
      "Sticking the thumb out sideways instead of resting against the index finger."
    ],
    imageUrl: "/signs/alphabet/a.gif",
    practiceTip: "Check your reflection: your thumb should form a clean vertical pillar on the side of your fist.",
    difficulty: 'beginner',
  },
  {
    id: 2,
    letter: 'B',
    title: 'Letter B',
    description: "Hold all four fingers flat and straight together, with your thumb folded across your palm.",
    verbalInstruction: "To sign the letter B, hold all four fingers vertically straight and pressed together, and fold your thumb across your palm.",
    handshape: "Flat vertical hand with closed fingers",
    fingerPosition: "Index, middle, ring, and pinky held straight up and touching together",
    thumbPosition: "Folded flat across the palm touching the base of your fingers",
    orientation: "Palm facing forward toward the camera",
    movement: "Static sign held at shoulder or chest level",
    keyPoints: [
      "Keep all four fingers completely straight with no gaps between them.",
      "Tuck the thumb neatly across the lower palm.",
      "Hold your wrist straight and stable."
    ],
    commonMistakes: [
      "Letting fingers splay apart.",
      "Sticking the thumb outward or upward."
    ],
    imageUrl: "/signs/alphabet/b.gif",
    practiceTip: "Think of an open salute or a stop gesture, but with the thumb tucked in across your palm.",
    difficulty: 'beginner',
  },
  {
    id: 3,
    letter: 'C',
    title: 'Letter C',
    description: "Curvature of your fingers and thumb mimicking the shape of the alphabet letter C.",
    verbalInstruction: "To sign the letter C, curve your four fingers and thumb into a smooth arc that resembles the letter C.",
    handshape: "Curved open arc",
    fingerPosition: "Fingers curved together forming the upper arch of the C",
    thumbPosition: "Curved upward forming the lower arch of the C",
    orientation: "Hand turned slightly sideways so the C is clearly visible from the camera",
    movement: "Static held sign",
    keyPoints: [
      "Maintain a uniform gap between fingertips and thumb.",
      "Keep the four fingers gently touching each other.",
      "Slightly turn the hand so the profile of the letter is readable."
    ],
    commonMistakes: [
      "Closing the fingers completely to make an O shape.",
      "Flattening the fingers instead of curling them."
    ],
    imageUrl: "/signs/alphabet/c.gif",
    practiceTip: "Imagine grasping a round coffee mug or cup with your hand.",
    difficulty: 'beginner',
  },
  {
    id: 4,
    letter: 'D',
    title: 'Letter D',
    description: "Index finger points straight up while the middle, ring, and pinky touch your thumb tip.",
    verbalInstruction: "To sign D, point your index finger straight up toward the sky, and bring your middle finger, ring finger, and pinky to touch the tip of your thumb.",
    handshape: "Single vertical finger with circular base",
    fingerPosition: "Index pointed vertically; middle, ring, and pinky curled down",
    thumbPosition: "Touching the pads of the middle, ring, and pinky fingers",
    orientation: "Palm facing slightly forward or three-quarters to the viewer",
    movement: "Static vertical hold",
    keyPoints: [
      "Only the index finger stays extended straight upward.",
      "The other three fingers form a closed ring with the thumb pad.",
      "Keep the index finger straight, not bent."
    ],
    commonMistakes: [
      "Confusing D with F (in F, the index finger touches the thumb and the three fingers are up).",
      "Bending the index finger."
    ],
    imageUrl: "/signs/alphabet/d.gif",
    practiceTip: "Remember: D has one straight spine pointing up, just like the lowercase or uppercase letter D.",
    difficulty: 'beginner',
  },
  {
    id: 5,
    letter: 'E',
    title: 'Letter E',
    description: "All four fingers bent sharply downward at the knuckles, resting on your tucked thumb.",
    verbalInstruction: "To sign the letter E, curl all four fingers downward so the tips rest on top of your thumb, which is tucked underneath across your palm.",
    handshape: "Clawed/curled tight hand",
    fingerPosition: "All four fingers bent at the knuckles with fingertips resting on the thumb edge",
    thumbPosition: "Crossed horizontally across the palm beneath the finger tips",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "Curl your fingertips inward so your nails are visible.",
      "Tuck your thumb snugly across the palm underneath the fingertips.",
      "Do not push fingertips into the palm; they rest upon the thumb."
    ],
    commonMistakes: [
      "Sticking the thumb out to the side.",
      "Folding into a fist instead of an open claw resting on the thumb."
    ],
    imageUrl: "/signs/alphabet/e.gif",
    practiceTip: "Your curled fingers and tucked thumb should form a compact shelf shape.",
    difficulty: 'intermediate',
  },
  {
    id: 6,
    letter: 'F',
    title: 'Letter F',
    description: "Touch your index finger to your thumb to form a circle, while your other three fingers spread upward.",
    verbalInstruction: "To sign F, touch your index finger and thumb together in an okay circle, while extending your middle, ring, and pinky fingers upward.",
    handshape: "Okay sign with three extended fingers",
    fingerPosition: "Index touches thumb; middle, ring, and pinky extend upward",
    thumbPosition: "Tips touching the index fingertip creating a circle",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "Ensure the index and thumb make a clean, round circle.",
      "Keep the other three fingers naturally spread and extended upward.",
      "Contrast with D: D has index up, F has three fingers up."
    ],
    commonMistakes: [
      "Inverting D and F.",
      "Collapsing the three extended fingers together."
    ],
    imageUrl: "/signs/alphabet/f.gif",
    practiceTip: "Think of the classic 'OK' hand gesture held facing the viewer.",
    difficulty: 'beginner',
  },
  {
    id: 7,
    letter: 'G',
    title: 'Letter G',
    description: "Index finger and thumb pointing horizontally sideways, parallel to each other.",
    verbalInstruction: "To sign G, point your index finger and thumb horizontally to the side, about one inch apart, like you are pinching something small.",
    handshape: "Horizontal pinch shape",
    fingerPosition: "Index extended horizontally; other fingers curled into palm",
    thumbPosition: "Extended parallel to the index finger with a small gap",
    orientation: "Back of the hand facing the viewer; knuckles pointing sideways",
    movement: "Static hold",
    keyPoints: [
      "Turn your hand sideways so your index finger and thumb point left (if using right hand).",
      "Keep about an inch of distance between index and thumb.",
      "Tuck the other three fingers neatly into the palm."
    ],
    commonMistakes: [
      "Pointing fingers straight at the camera instead of sideways.",
      "Extending the middle finger."
    ],
    imageUrl: "/signs/alphabet/g.gif",
    practiceTip: "Imagine measuring a small thickness between your thumb and index finger sideways.",
    difficulty: 'intermediate',
  },
  {
    id: 8,
    letter: 'H',
    title: 'Letter H',
    description: "Index and middle fingers extended straight horizontally together, pointing sideways.",
    verbalInstruction: "To sign H, extend both your index and middle fingers together horizontally sideways, with your thumb folded against your ring finger.",
    handshape: "Two-finger horizontal bar",
    fingerPosition: "Index and middle extended straight and pressed together horizontally",
    thumbPosition: "Folded flat across the ring and pinky fingers",
    orientation: "Back of hand facing forward",
    movement: "Static hold",
    keyPoints: [
      "Keep index and middle fingers touching and strictly horizontal.",
      "Keep the wrist aligned without drooping down.",
      "Ring and pinky fingers remain folded into the palm."
    ],
    commonMistakes: [
      "Letting index and middle fingers separate into a V.",
      "Pointing fingers vertically (that is U, not H)."
    ],
    imageUrl: "/signs/alphabet/h.gif",
    practiceTip: "H is simply the letter U turned on its side horizontally!",
    difficulty: 'intermediate',
  },
  {
    id: 9,
    letter: 'I',
    title: 'Letter I',
    description: "Extend your pinky finger straight up while curling all other fingers and the thumb into a fist.",
    verbalInstruction: "To sign I, raise your pinky finger straight up into the air, while keeping your index, middle, ring fingers, and thumb folded in.",
    handshape: "Pinky extended from fist",
    fingerPosition: "Pinky straight vertical; index, middle, ring curled tightly",
    thumbPosition: "Folded across the middle and ring fingers",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "Extend only the pinky finger straight up.",
      "The thumb locks down the index and middle fingers.",
      "Keep the hand upright and steady."
    ],
    commonMistakes: [
      "Letting the thumb poke out sideways.",
      "Partially extending the ring finger."
    ],
    imageUrl: "/signs/alphabet/i.gif",
    practiceTip: "Think of drinking tea with a raised pinky, but with a clean, closed fist.",
    difficulty: 'beginner',
  },
  {
    id: 10,
    letter: 'J',
    title: 'Letter J',
    description: "Hold the pinky up like 'I', then smoothly trace the shape of the letter J in the air.",
    verbalInstruction: "To sign J, start with the pinky finger raised like the letter I, and trace a curved J shape in the air by dipping downward and curving back up.",
    handshape: "Dynamic pinky drawing motion",
    fingerPosition: "Pinky extended, other fingers in fist",
    thumbPosition: "Tucked across fingers",
    orientation: "Begins palm forward, turns inward as you complete the swoop",
    movement: "Smooth downward dip and inward curve tracing the hook of a J",
    keyPoints: [
      "J is one of only two moving letters in the ASL alphabet (along with Z).",
      "Trace the hook from top to bottom, curving back toward yourself.",
      "Keep the wrist fluid during the motion."
    ],
    commonMistakes: [
      "Forgetting to move and holding static (which is just I).",
      "Making an overly exaggerated arm motion; movement comes from the wrist."
    ],
    imageUrl: "/signs/alphabet/j.gif",
    practiceTip: "Dip your pinky down like a fishhook curling inward.",
    difficulty: 'intermediate',
  },
  {
    id: 11,
    letter: 'K',
    title: 'Letter K',
    description: "Index pointing up, middle finger angled slightly forward, and thumb placed between them.",
    verbalInstruction: "To sign K, point your index finger up, angle your middle finger forward, and place your thumb between them touching the middle finger knuckle.",
    handshape: "V-variation with thumb wedged",
    fingerPosition: "Index vertical; middle finger angled forward; ring/pinky closed",
    thumbPosition: "Wedged upward between index and middle fingers, resting on middle finger",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "The thumb acts as the diagonal branch of the K.",
      "Keep the middle finger pushed slightly forward toward the camera.",
      "Ring and pinky stay curled in."
    ],
    commonMistakes: [
      "Confusing with V (V has thumb folded in front, not between fingers).",
      "Failing to angle the middle finger forward."
    ],
    imageUrl: "/signs/alphabet/k.gif",
    practiceTip: "Look at your hand from the side: it visually mirrors the structure of the letter K.",
    difficulty: 'intermediate',
  },
  {
    id: 12,
    letter: 'L',
    title: 'Letter L',
    description: "Extend your index finger straight up and your thumb out to the side at a crisp 90-degree angle.",
    verbalInstruction: "To sign L, extend your index finger straight up and your thumb straight to the side, forming a sharp capital L shape.",
    handshape: "Classic L shape",
    fingerPosition: "Index straight up; middle, ring, pinky tucked into palm",
    thumbPosition: "Extended horizontally at a 90-degree right angle to the index",
    orientation: "Palm facing outward toward camera",
    movement: "Static hold",
    keyPoints: [
      "Form an exact 90-degree right angle between thumb and index.",
      "Curl the remaining three fingers firmly into the palm.",
      "Hold your hand flat and upright."
    ],
    commonMistakes: [
      "Tilting the hand diagonally so it looks like a checkmark.",
      "Drooping the thumb downward."
    ],
    imageUrl: "/signs/alphabet/l.gif",
    practiceTip: "This is the most iconic letter in the alphabet! It literally spells L in your hand.",
    difficulty: 'beginner',
  },
  {
    id: 13,
    letter: 'M',
    title: 'Letter M',
    description: "Tuck your thumb beneath your first three fingers (index, middle, ring), with only your pinky outside.",
    verbalInstruction: "To sign M, tuck your thumb under your index, middle, and ring fingers, allowing the thumb tip to poke out beneath the pinky.",
    handshape: "Fist with thumb under three fingers",
    fingerPosition: "Index, middle, and ring folded over the thumb; pinky folded beside",
    thumbPosition: "Tucked horizontally underneath the three fingers",
    orientation: "Palm facing forward, knuckles pointed up",
    movement: "Static hold",
    keyPoints: [
      "Three fingers rest over the thumb (mnemonic: M has three downstrokes).",
      "Keep knuckles elevated so the viewer can see the three fingers.",
      "Contrast with N (N only has two fingers over the thumb)."
    ],
    commonMistakes: [
      "Confusing M (3 fingers over thumb) with N (2 fingers) or T (1 finger).",
      "Hiding the thumb too far inside the fist."
    ],
    imageUrl: "/signs/alphabet/m.gif",
    practiceTip: "Count the humps: M has three humps, so put three fingers over your thumb!",
    difficulty: 'intermediate',
  },
  {
    id: 14,
    letter: 'N',
    title: 'Letter N',
    description: "Tuck your thumb beneath your first two fingers (index and middle), with ring and pinky beside.",
    verbalInstruction: "To sign N, tuck your thumb underneath your index and middle fingers, letting the thumb poke out between the middle and ring fingers.",
    handshape: "Fist with thumb under two fingers",
    fingerPosition: "Index and middle folded over the thumb; ring and pinky closed beside",
    thumbPosition: "Tucked under the first two fingers",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "Two fingers rest over the thumb (mnemonic: N has two vertical legs).",
      "Keep knuckles clear and legible.",
      "Keep the pinky and ring fingers curled down."
    ],
    commonMistakes: [
      "Accidentally covering with three fingers (that makes M).",
      "Letting the thumb slide outside the fingers."
    ],
    imageUrl: "/signs/alphabet/n.gif",
    practiceTip: "M has 3 fingers, N has 2 fingers, T has 1 finger over the thumb.",
    difficulty: 'intermediate',
  },
  {
    id: 15,
    letter: 'O',
    title: 'Letter O',
    description: "Bring all your fingertips and thumb together to create a round circular O shape.",
    verbalInstruction: "To sign O, curve all four fingers and your thumb together until all fingertips touch the thumb pad, forming a complete circle.",
    handshape: "Closed oval / circle",
    fingerPosition: "All four fingers arched smoothly downward",
    thumbPosition: "Arched upward meeting the tips of all four fingers",
    orientation: "Palm facing forward, tilted slightly so the hole is visible",
    movement: "Static hold",
    keyPoints: [
      "All fingertips should gently touch the thumb tip.",
      "Maintain an open rounded hole inside the hand.",
      "Keep the curve natural, not strained."
    ],
    commonMistakes: [
      "Leaving a gap (that makes C).",
      "Flattening the fingers into an E."
    ],
    imageUrl: "/signs/alphabet/o.gif",
    practiceTip: "Look through your hand like a telescope; you should see a clear O opening.",
    difficulty: 'beginner',
  },
  {
    id: 16,
    letter: 'P',
    title: 'Letter P',
    description: "Make the K handshape and point your hand downward toward the floor.",
    verbalInstruction: "To sign P, make the K handshape with your index extended and thumb touching your middle finger, then rotate your wrist down so your index points forward and middle points down.",
    handshape: "Inverted K shape",
    fingerPosition: "Index pointing horizontally forward; middle finger pointing straight down",
    thumbPosition: "Resting against the middle finger knuckle",
    orientation: "Palm facing downward / inward",
    movement: "Static downward hold",
    keyPoints: [
      "P is literally the letter K turned downward.",
      "Middle finger points down toward the floor.",
      "Index finger points horizontally forward."
    ],
    commonMistakes: [
      "Keeping hand pointing up (that is K).",
      "Dropping the wrist too loosely without maintaining finger tension."
    ],
    imageUrl: "/signs/alphabet/p.gif",
    practiceTip: "Start with K, then tilt your wrist down: K points up, P points down.",
    difficulty: 'intermediate',
  },
  {
    id: 17,
    letter: 'Q',
    title: 'Letter Q',
    description: "Make the G handshape and point both your index finger and thumb straight down.",
    verbalInstruction: "To sign Q, form the G handshape with your index finger and thumb apart, then rotate your wrist downward so both fingers point at the floor.",
    handshape: "Inverted pinch pointing down",
    fingerPosition: "Index pointing down; other fingers curled into palm",
    thumbPosition: "Parallel to index finger pointing downward",
    orientation: "Back of hand facing camera, fingers directed toward the ground",
    movement: "Static downward hold",
    keyPoints: [
      "Q is the downward counterpart to G.",
      "Keep an inch gap between thumb and index.",
      "Point both fingertips straight down."
    ],
    commonMistakes: [
      "Pointing sideways (that makes G).",
      "Closing the gap so thumb and index touch."
    ],
    imageUrl: "/signs/alphabet/q.gif",
    practiceTip: "Pair G and Q in your mind: G points to the side, Q points to the ground.",
    difficulty: 'intermediate',
  },
  {
    id: 18,
    letter: 'R',
    title: 'Letter R',
    description: "Cross your index finger over your middle finger like wishing for good luck.",
    verbalInstruction: "To sign R, cross your index finger in front of your middle finger, extending both fingers vertically while holding your thumb over the remaining curled fingers.",
    handshape: "Crossed fingers",
    fingerPosition: "Index crossed over middle finger vertically; ring/pinky closed",
    thumbPosition: "Folded across ring and pinky fingers",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "Index crosses in front of the middle finger.",
      "Keep the crossed fingers pointed straight up.",
      "Hold the sign steady without wobbling."
    ],
    commonMistakes: [
      "Crossing middle over index (index must cross in front).",
      "Separating the fingers into an open V."
    ],
    imageUrl: "/signs/alphabet/r.gif",
    practiceTip: "Think of the universal 'fingers crossed for luck' gesture!",
    difficulty: 'beginner',
  },
  {
    id: 19,
    letter: 'S',
    title: 'Letter S',
    description: "Make a firm fist with your thumb wrapped snugly across the front of your curled fingers.",
    verbalInstruction: "To sign S, make a closed fist and wrap your thumb horizontally across the front of your curled fingers.",
    handshape: "Fist with thumb in front",
    fingerPosition: "All four fingers curled tightly into a fist",
    thumbPosition: "Folded across the front of the fingers, resting over the middle knuckles",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "Thumb MUST cross over the front of the knuckles.",
      "Contrast with A: in A, the thumb is on the side; in S, the thumb is in front.",
      "Keep the fist tight and secure."
    ],
    commonMistakes: [
      "Resting the thumb on the side (which turns it into A).",
      "Tucking the thumb under the fingers (which makes M, N, or T)."
    ],
    imageUrl: "/signs/alphabet/s.gif",
    practiceTip: "Remember: A = thumb at the side. S = thumb on top of the front.",
    difficulty: 'beginner',
  },
  {
    id: 20,
    letter: 'T',
    title: 'Letter T',
    description: "Tuck your thumb between your index and middle fingers, making a fist with thumb poking up.",
    verbalInstruction: "To sign T, make a fist and tuck your thumb between your index finger and middle finger, so the thumb tip peeks out over the top of the index finger.",
    handshape: "Fist with thumb between index and middle",
    fingerPosition: "Index folded over thumb; middle, ring, pinky curled into palm",
    thumbPosition: "Inserted between index and middle fingers, popping out over the index",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "Only ONE finger (the index) covers the thumb.",
      "Thumb tip clearly protrudes between the index and middle knuckles.",
      "M = 3 fingers, N = 2 fingers, T = 1 finger over thumb."
    ],
    commonMistakes: [
      "Using two fingers over the thumb (that makes N).",
      "Letting the thumb slip behind the index."
    ],
    imageUrl: "/signs/alphabet/t.gif",
    practiceTip: "Think of playing 'I've got your nose' with a baby: your thumb pokes through your first two fingers.",
    difficulty: 'intermediate',
  },
  {
    id: 21,
    letter: 'U',
    title: 'Letter U',
    description: "Extend your index and middle fingers straight up together, touching tightly.",
    verbalInstruction: "To sign U, extend both your index and middle fingers straight up and pressed tightly together, with your thumb holding down your ring and pinky fingers.",
    handshape: "Double vertical finger bar",
    fingerPosition: "Index and middle straight up and touching; ring/pinky closed",
    thumbPosition: "Folded across ring finger",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "Index and middle fingers must touch all the way along their edges.",
      "Contrast with V: in V they spread apart; in U they stay together.",
      "Keep fingers vertical and straight."
    ],
    commonMistakes: [
      "Spreading the fingers apart (that makes V).",
      "Crossing fingers (that makes R)."
    ],
    imageUrl: "/signs/alphabet/u.gif",
    practiceTip: "U is united: the two fingers stay united and touch together!",
    difficulty: 'beginner',
  },
  {
    id: 22,
    letter: 'V',
    title: 'Letter V',
    description: "Hold your index and middle fingers up in an open peace or victory sign.",
    verbalInstruction: "To sign V, extend your index and middle fingers straight up and spread them apart in a clear V shape, with your thumb folded across your other fingers.",
    handshape: "Peace / victory sign",
    fingerPosition: "Index and middle extended and spread into a V; ring/pinky closed",
    thumbPosition: "Folded across ring and pinky fingers",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "Spread index and middle fingers into a clean, distinct V angle.",
      "Contrast with U: U is closed together, V is spread apart.",
      "Contrast with K: V has thumb folded across front, K has thumb wedged between."
    ],
    commonMistakes: [
      "Keeping fingers together (that makes U).",
      "Placing thumb between the fingers (that makes K)."
    ],
    imageUrl: "/signs/alphabet/v.gif",
    practiceTip: "V stands for Victory and Peace: the classic two-finger spread!",
    difficulty: 'beginner',
  },
  {
    id: 23,
    letter: 'W',
    title: 'Letter W',
    description: "Extend your index, middle, and ring fingers straight up and slightly spread.",
    verbalInstruction: "To sign W, extend your index, middle, and ring fingers straight up and spread slightly apart, while your thumb holds down your pinky.",
    handshape: "Three extended fingers",
    fingerPosition: "Index, middle, ring extended upward and spread; pinky folded down",
    thumbPosition: "Touching or holding down the pinky tip",
    orientation: "Palm facing forward",
    movement: "Static hold",
    keyPoints: [
      "Three fingers extended straight up like the three peaks of a W.",
      "Thumb holds the pinky finger down against the palm.",
      "Keep all three fingers straight."
    ],
    commonMistakes: [
      "Extending all four fingers (that makes B or 4).",
      "Folding the ring finger down."
    ],
    imageUrl: "/signs/alphabet/w.gif",
    practiceTip: "Your three fingers naturally form the three prongs of the letter W.",
    difficulty: 'beginner',
  },
  {
    id: 24,
    letter: 'X',
    title: 'Letter X',
    description: "Bend your index finger into a hook shape, keeping all other fingers closed into a fist.",
    verbalInstruction: "To sign X, make a fist and raise your index finger, bending it at the middle knuckle into a curved hook or pirate hook shape.",
    handshape: "Hooked index finger",
    fingerPosition: "Index raised and bent into a hook; middle, ring, pinky closed",
    thumbPosition: "Tucked against the middle finger",
    orientation: "Palm facing forward or slightly angled sideways",
    movement: "Static hold",
    keyPoints: [
      "Only the index finger is raised, bent like Captain Hook's hook.",
      "All other fingers remain closed in the fist.",
      "Bend at the middle knuckle, not just the fingertip."
    ],
    commonMistakes: [
      "Extending the index finger straight (that makes 1 or D).",
      "Curling the index finger completely into the palm."
    ],
    imageUrl: "/signs/alphabet/x.gif",
    practiceTip: "Think of a pirate's hook or an anchor: a sharp, distinct curved finger.",
    difficulty: 'intermediate',
  },
  {
    id: 25,
    letter: 'Y',
    title: 'Letter Y',
    description: "Extend your thumb and pinky finger outward while keeping your middle three fingers curled in.",
    verbalInstruction: "To sign Y, extend your thumb and pinky finger far apart like a shaka or hang loose sign, while folding your index, middle, and ring fingers tightly into your palm.",
    handshape: "Hang loose / shaka sign",
    fingerPosition: "Thumb and pinky fully extended wide; index, middle, ring curled tightly",
    thumbPosition: "Extended out to the side",
    orientation: "Palm facing forward or slightly downward",
    movement: "Static hold",
    keyPoints: [
      "Extend both thumb and pinky as far apart as comfortably possible.",
      "The three middle fingers stay firmly folded into the palm.",
      "Hand forms the wide upper fork of the letter Y."
    ],
    commonMistakes: [
      "Extending index finger too (that makes 'I love you' sign).",
      "Letting the pinky droop."
    ],
    imageUrl: "/signs/alphabet/y.gif",
    practiceTip: "Think of a phone receiver or the classic surf 'hang loose' gesture.",
    difficulty: 'beginner',
  },
  {
    id: 26,
    letter: 'Z',
    title: 'Letter Z',
    description: "Point your index finger forward and trace the zig-zag letter Z in the air.",
    verbalInstruction: "To sign Z, point your index finger forward and draw the letter Z in the air: horizontal line right, diagonal line down-left, and horizontal line right.",
    handshape: "Index pointer tracing a path",
    fingerPosition: "Index extended straight forward; other fingers in a closed fist",
    thumbPosition: "Holding down the middle finger",
    orientation: "Palm facing forward/left, finger pointing toward camera",
    movement: "Dynamic three-stroke zig-zag: right, diagonal down-left, right",
    keyPoints: [
      "Z is the second moving letter in the ASL alphabet (with J).",
      "Trace the three strokes clearly in the space in front of your chest.",
      "Keep the index finger straight as you trace."
    ],
    commonMistakes: [
      "Drawing in reverse (draw as if writing on a whiteboard for someone to read).",
      "Holding static without drawing the Z."
    ],
    imageUrl: "/signs/alphabet/z.gif",
    practiceTip: "Imagine your index finger is a laser pointer carving the letter Z on a glass wall.",
    difficulty: 'intermediate',
  }
];

export function getLessonByLetter(letter: string): ASLLessonData | undefined {
  return ASL_CURRICULUM.find(l => l.letter.toUpperCase() === letter.toUpperCase());
}

export function getLessonById(id: number): ASLLessonData | undefined {
  return ASL_CURRICULUM.find(l => l.id === id);
}

export interface WordLessonData {
  id: number;
  word: string;
  category: string;
  meaning: string;
  verbalInstruction: string;
  handshape: string;
  movement: string;
  steps: string[];
  tips: string;
  mistakes: string[];
  imageUrl: string;
}

export const WORD_LESSONS: WordLessonData[] = [
  {
    id: 101,
    word: 'HELLO',
    category: 'Greetings',
    meaning: 'Friendly greeting, similar to a soft salute',
    verbalInstruction: 'To sign hello, touch the tips of your open hand near your temple and smoothly salute outward with a friendly smile.',
    handshape: 'Open flat hand (B handshape) with fingers together',
    movement: 'Start with fingertips touching near the forehead/temple and arc gently outward forward',
    steps: [
      '01 Form an open flat hand with fingers closed together.',
      '02 Touch the edge of your index finger to your temple.',
      '03 Move your hand outward away from your head like an open-palm salute.'
    ],
    tips: 'Pair this with a warm facial expression and direct eye contact.',
    mistakes: ['Making a rigid military salute instead of a gentle, smooth arc.'],
    imageUrl: '/signs/words/hello.jpg'
  },
  {
    id: 102,
    word: 'THANK YOU',
    category: 'Courtesy',
    meaning: 'Expressing gratitude',
    verbalInstruction: 'To sign thank you, touch the fingers of your flat open hand to your chin, then move your hand downward and forward toward the person.',
    handshape: 'Open flat hand with thumb extended outward',
    movement: 'Touch fingertips to chin and project forward towards the recipient',
    steps: [
      '01 Place the fingertips of your dominant flat hand against your chin or lower lip.',
      '02 Move your hand forward and slightly downward toward the listener.',
      '03 Nod slightly to emphasize sincerity.'
    ],
    tips: 'Ensure your palm faces slightly upward as you release forward.',
    mistakes: ['Starting from the forehead instead of the chin (forehead is "father").'],
    imageUrl: '/signs/words/thank-you.jpg'
  },
  {
    id: 103,
    word: 'PLEASE',
    category: 'Courtesy',
    meaning: 'Polite request',
    verbalInstruction: 'To sign please, place your open flat hand with thumb extended against the center of your chest and rub in a gentle clockwise circle.',
    handshape: 'Open flat hand placed over the chest',
    movement: 'Circular rubbing motion clockwise two or three times over the heart area',
    steps: [
      '01 Place your flat right hand on the center of your chest.',
      '02 Move your hand in circular motions a couple of times.',
      '03 Keep your palm touching your chest throughout.'
    ],
    tips: 'A pleasant, earnest facial expression is an essential grammar component.',
    mistakes: ['Circling in the air without maintaining gentle chest contact.'],
    imageUrl: '/signs/words/please.gif'
  },
  {
    id: 104,
    word: 'SORRY',
    category: 'Courtesy',
    meaning: 'Apology or regret',
    verbalInstruction: 'To sign sorry, form an A fist with your thumb across your knuckles, place it over your heart, and rub in small circular motions.',
    handshape: 'A-handshape fist with thumb folded over fingers',
    movement: 'Clockwise circular rubbing on the center of the chest',
    steps: [
      '01 Make an A-fist with your dominant hand.',
      '02 Place the fist knuckles against the center of your chest.',
      '03 Rub your fist in small circular motions.'
    ],
    tips: 'Show remorse or empathy with your face and eyebrow posture.',
    mistakes: ['Using an open hand (which is "please") instead of a closed fist.'],
    imageUrl: '/signs/words/sorry.jpg'
  },
  {
    id: 105,
    word: 'YES',
    category: 'Responses',
    meaning: 'Affirmative response',
    verbalInstruction: 'To sign yes, make an S fist with your thumb across your fingers and nod your wrist up and down, mimicking a nodding head.',
    handshape: 'S-handshape fist held at chest height',
    movement: 'Tilt the wrist forward and back in a steady nodding rhythm',
    steps: [
      '01 Form a fist (S-shape) with your dominant hand.',
      '02 Hold your fist in front of your shoulder with palm facing forward.',
      '03 Pivot your wrist down and up twice, imitating a nodding head.'
    ],
    tips: 'Nod your actual head simultaneously for natural conversational ASL.',
    mistakes: ['Moving the entire forearm up and down instead of pivoting at the wrist.'],
    imageUrl: '/signs/words/yes.jpg'
  },
  {
    id: 106,
    word: 'NO',
    category: 'Responses',
    meaning: 'Negative response',
    verbalInstruction: 'To sign no, snap your index and middle fingers down together onto your thumb, like a mouth snapping shut.',
    handshape: 'Index and middle fingers extended with thumb ready to meet them',
    movement: 'Rapid snap of the index and middle fingers tapping against the thumb pad',
    steps: [
      '01 Extend your index and middle fingers together, with your thumb beneath.',
      '02 Snap the two fingers firmly onto the thumb pad.',
      '03 Keep the motion crisp and quick.'
    ],
    tips: 'Shake your head side-to-side slightly to reinforce the negation.',
    mistakes: ['Using only the index finger, which looks like a tapping gesture.'],
    imageUrl: '/signs/words/no.jpg'
  },
  {
    id: 107,
    word: 'GOOD',
    category: 'Everyday',
    meaning: 'Positive condition or quality',
    verbalInstruction: 'To sign good, touch your flat right hand to your chin and bring it down into the open palm of your left hand.',
    handshape: 'Flat open hands',
    movement: 'Dominant hand touches chin and descends into base hand palm',
    steps: [
      '01 Touch fingertips of dominant hand to your lower lip/chin.',
      '02 Hold your non-dominant hand flat, palm facing upward.',
      '03 Lower your dominant hand to rest softly into your non-dominant palm.'
    ],
    tips: 'Contrast with "bad", which turns the hand downward as it moves away.',
    mistakes: ['Slapping the base hand aggressively instead of a gentle contact.'],
    imageUrl: '/signs/words/good.jpg'
  },
  {
    id: 108,
    word: 'HELP',
    category: 'Everyday',
    meaning: 'Assistance or aid',
    verbalInstruction: 'To sign help, place a thumbs-up fist onto your flat non-dominant palm, and lift both hands upward together.',
    handshape: 'Thumbs-up on base palm',
    movement: 'Both hands elevate upward towards chest level',
    steps: [
      '01 Form a flat base hand, palm up, with non-dominant hand.',
      '02 Place a dominant thumbs-up fist directly onto the base palm.',
      '03 Move both hands upward together.'
    ],
    tips: 'Directional verb: moving towards another person means "I help you"; towards yourself means "help me".',
    mistakes: ['Lifting only the fist without supporting it with the base palm.'],
    imageUrl: '/signs/words/help.jpg'
  },
  {
    id: 109,
    word: 'FRIEND',
    category: 'Social',
    meaning: 'Close companion',
    verbalInstruction: 'To sign friend, hook your index fingers together in front of you, then flip and hook them in the reverse direction.',
    handshape: 'Both hands form X/hooked index fingers',
    movement: 'Hook fingers together, detach, rotate, and hook opposite',
    steps: [
      '01 Make both hands into fists with curved hook index fingers.',
      '02 Hook your right index finger over the left index finger.',
      '03 Unhook, reverse, and hook your left index finger over the right.'
    ],
    tips: 'Represents the inseparable link between two people.',
    mistakes: ['Interlocking all fingers instead of only the index fingers.'],
    imageUrl: '/signs/words/friend.jpg'
  },
  {
    id: 110,
    word: 'WATER',
    category: 'Essentials',
    meaning: 'Liquid refreshment',
    verbalInstruction: 'To sign water, form the W handshape with your three middle fingers and tap your index finger against your lower lip twice.',
    handshape: 'W handshape (index, middle, ring fingers spread upright)',
    movement: 'Double tap against the chin/lower lip',
    steps: [
      '01 Hold up a clear W letter handshape.',
      '02 Tap the side of your index finger gently against your lower lip twice.',
      '03 Keep the sign near the corner of your mouth.'
    ],
    tips: 'Part of the classic food/drink signs that originate around the mouth.',
    mistakes: ['Tapping the chin with the palm rather than the side of the index finger.'],
    imageUrl: '/signs/words/water.jpg'
  },
  {
    id: 111,
    word: 'FAMILY',
    category: 'Social',
    meaning: 'Household or kin group',
    verbalInstruction: 'To sign family, form F handshapes with both hands touching index fingers and thumbs together in front of you, then circle outward and touch your pinkies together.',
    handshape: 'F handshapes (thumb and index finger forming a circle, other three fingers upright)',
    movement: 'Both hands trace a horizontal outward circle, starting with thumb/index touching and ending with pinkies touching',
    steps: [
      '01 Form both hands into F handshapes with thumbs and index fingers touching in circles.',
      '02 Touch the thumbs and index fingers of both hands together in front of your chest.',
      '03 Draw an outward circle with both hands until the pinky sides of both hands meet.'
    ],
    tips: 'Represents an embracing, unified circle of people.',
    mistakes: ['Using flat hands or not meeting the pinkies at the end.'],
    imageUrl: '/signs/words/family.jpg'
  }
];

export interface PhraseLessonData {
  id: number;
  phrase: string;
  breakdown: string[];
  meaning: string;
  verbalInstruction: string;
  steps: string[];
  facialGrammar: string;
}

export const PHRASE_LESSONS: PhraseLessonData[] = [
  {
    id: 201,
    phrase: 'HOW ARE YOU?',
    breakdown: ['HOW', 'YOU'],
    meaning: 'Inquiring about wellbeing (ASL typically omits the "to be" verb "are")',
    verbalInstruction: 'To sign How Are You, roll both curved hands inward to outward for HOW, then point cleanly at the person for YOU, lowering your eyebrows for the question.',
    steps: [
      '01 Place both curved hands knuckles-together, roll forward so palms face up (HOW).',
      '02 Point index finger directly at the conversational partner (YOU).',
      '03 Furrow eyebrows slightly (wh-question grammar).'
    ],
    facialGrammar: 'Furrow eyebrows downward because this is a WH-question (How).'
  },
  {
    id: 202,
    phrase: 'NICE TO MEET YOU',
    breakdown: ['NICE', 'MEET', 'YOU'],
    meaning: 'Warm introductory greeting',
    verbalInstruction: 'Slide your dominant hand across your base palm for NICE, bring both index fingers together for MEET, and point to the person for YOU.',
    steps: [
      '01 Slide dominant palm smoothly across base palm from heel to fingertips (NICE).',
      '02 Hold both index fingers upright and bring their knuckles together (MEET).',
      '03 Point forward to the partner (YOU).'
    ],
    facialGrammar: 'Gentle warm smile and direct friendly eye contact.'
  },
  {
    id: 203,
    phrase: 'MY NAME IS...',
    breakdown: ['MY', 'NAME', '[Fingerspell]'],
    meaning: 'Introducing oneself',
    verbalInstruction: 'Press your flat palm to your chest for MY, tap your H fingers in an X for NAME, then fingerspell your name letter by letter.',
    steps: [
      '01 Place flat palm on center of chest (MY).',
      '02 Tap the middle/index fingers of both hands together in a cross twice (NAME).',
      '03 Fingerspell your first name with your dominant hand at shoulder height.'
    ],
    facialGrammar: 'Relaxed neutral or smiling facial expression.'
  },
  {
    id: 204,
    phrase: 'SEE YOU LATER',
    breakdown: ['SEE', 'YOU', 'LATER'],
    meaning: 'Friendly parting',
    verbalInstruction: 'Touch a V handshape near your eyes and point outward for SEE, point to the person for YOU, then drop an L handshape forward at the wrist for LATER.',
    steps: [
      '01 Point V-hand fingertips near eyes and project forward (SEE).',
      '02 Point toward partner (YOU).',
      '03 Form an L handshape and pivot it forward at the wrist (LATER).'
    ],
    facialGrammar: 'Upbeat friendly nod.'
  },
  {
    id: 205,
    phrase: 'WHAT IS YOUR NAME?',
    breakdown: ['YOU', 'NAME', 'WHAT'],
    meaning: 'Asking someone their name with WH-question grammar',
    verbalInstruction: 'Point to the person for YOU, tap your H fingers together for NAME, then hold both open palms facing upward and shake them gently side-to-side with furrowed eyebrows for WHAT.',
    steps: [
      '01 Point index finger toward the person (YOU).',
      '02 Tap the middle and index fingers of both hands across each other twice (NAME).',
      '03 Hold both palms upward at waist level, shake gently side to side with furrowed brows (WHAT).'
    ],
    facialGrammar: 'Furrow your eyebrows down and tilt your head slightly forward.'
  },
  {
    id: 206,
    phrase: 'THANK YOU VERY MUCH',
    breakdown: ['THANK-YOU', 'BOTH-HANDS'],
    meaning: 'Heartfelt, emphatic gratitude',
    verbalInstruction: 'To express deep gratitude, touch both flat hands to your chin and project both hands outward toward the person with a gracious, warm nod.',
    steps: [
      '01 Touch the fingertips of both flat hands to your chin.',
      '02 Move both hands outward and forward toward the person.',
      '03 Accompany with an appreciative smile and gentle head nod.'
    ],
    facialGrammar: 'Warm, sincere facial expression with an appreciative nod.'
  }
];

export interface NumberLessonData {
  id: number;
  number: string;
  handshape: string;
  steps: string[];
  verbalInstruction: string;
  imageUrl: string;
}

export const NUMBER_LESSONS: NumberLessonData[] = [
  { id: 301, number: '1', handshape: 'Index finger vertical, palm inward', steps: ['01 Form a fist and extend index finger upward.', '02 Palm faces inward toward your chest.'], verbalInstruction: 'To sign the number 1, extend your index finger straight up with your palm facing toward you.', imageUrl: '/signs/numbers/1.jpg' },
  { id: 302, number: '2', handshape: 'Index and middle fingers vertical, palm inward', steps: ['01 Extend index and middle fingers in a V.', '02 Palm faces your body.'], verbalInstruction: 'To sign 2, extend your index and middle fingers upright with your palm facing inward.', imageUrl: '/signs/numbers/2.jpg' },
  { id: 303, number: '3', handshape: 'Thumb, index, and middle extended', steps: ['01 Note: in ASL, 3 uses the thumb, index, and middle fingers!', '02 Palm faces inward.'], verbalInstruction: 'Remember that in ASL, number 3 uses your thumb, index, and middle fingers with your palm facing you.', imageUrl: '/signs/numbers/3.jpg' },
  { id: 304, number: '4', handshape: 'Four fingers upright, thumb tucked', steps: ['01 Extend all four fingers upright.', '02 Tuck thumb into palm, palm facing inward.'], verbalInstruction: 'To sign 4, hold all four fingers straight up with your thumb folded across your palm.', imageUrl: '/signs/numbers/4.jpg' },
  { id: 305, number: '5', handshape: 'All five fingers spread open', steps: ['01 Open all five fingers wide and upright.', '02 Palm faces inward toward your chest.'], verbalInstruction: 'To sign 5, spread all five fingers wide with your palm facing inward.', imageUrl: '/signs/numbers/5.jpg' },
  { id: 306, number: '6', handshape: 'Thumb touches pinky fingernail, palm outward', steps: ['01 Palm turns to face outward!', '02 Touch the tip of your thumb to your pinky finger.'], verbalInstruction: 'For numbers 6 through 9, your palm turns outward. For 6, touch your thumb to your pinky.', imageUrl: '/signs/numbers/6.jpg' },
  { id: 307, number: '7', handshape: 'Thumb touches ring finger, palm outward', steps: ['01 Palm faces outward.', '02 Touch thumb tip to ring fingertip.'], verbalInstruction: 'To sign 7, touch your thumb to your ring finger with your palm facing forward.', imageUrl: '/signs/numbers/7.jpg' },
  { id: 308, number: '8', handshape: 'Thumb touches middle finger, palm outward', steps: ['01 Palm faces outward.', '02 Touch thumb tip to middle fingertip.'], verbalInstruction: 'To sign 8, touch your thumb to your middle finger with your palm facing outward.', imageUrl: '/signs/numbers/8.jpg' },
  { id: 309, number: '9', handshape: 'Thumb touches index finger (F handshape), palm outward', steps: ['01 Palm faces outward.', '02 Touch thumb tip to index fingertip.'], verbalInstruction: 'To sign 9, touch your thumb to your index finger with your palm facing outward.', imageUrl: '/signs/numbers/9.jpg' },
  { id: 310, number: '10', handshape: 'Thumbs-up fist shaking side to side', steps: ['01 Make a thumbs-up fist.', '02 Wiggle or twist your wrist side to side.'], verbalInstruction: 'To sign 10, make a thumbs-up fist and shake your wrist gently side to side.', imageUrl: '/signs/numbers/10.jpg' }
];

export interface ConversationLessonData {
  id: number;
  title: string;
  topic: string;
  description: string;
  dialogue: { speaker: string; text: string; signs: string[] }[];
  verbalInstruction: string;
  steps: string[];
}

export const CONVERSATION_LESSONS: ConversationLessonData[] = [
  {
    id: 401,
    title: 'Warm Greetings',
    topic: 'Greetings & Wellbeing',
    description: 'A standard daily encounter between two signers meeting each other.',
    verbalInstruction: 'In this greeting dialogue, start with a crisp HELLO salute, transition into the HOW ARE YOU sign with lowered eyebrows, and respond with GOOD followed by THANK YOU.',
    dialogue: [
      { speaker: 'Signer A', text: 'Hello! How are you?', signs: ['HELLO', 'HOW', 'YOU'] },
      { speaker: 'Signer B', text: "I'm good, thank you!", signs: ['GOOD', 'THANK-YOU'] }
    ],
    steps: [
      '01 Initiate with HELLO salute from your temple.',
      '02 Ask HOW ARE YOU with lowered eyebrows.',
      '03 Respond with GOOD (chin to palm) and THANK YOU (chin forward).'
    ]
  },
  {
    id: 402,
    title: 'Introductions & Names',
    topic: 'Exchanging Names',
    description: 'Learn how to introduce yourself and ask for someone else’s name.',
    verbalInstruction: 'To introduce yourself, place your palm on your chest for MY, cross your fingers for NAME, and fingerspell. Then point and ask WHAT IS YOUR NAME.',
    dialogue: [
      { speaker: 'Signer A', text: 'My name is Alex. What is your name?', signs: ['MY', 'NAME', 'A-L-E-X', 'YOU', 'NAME', 'WHAT'] },
      { speaker: 'Signer B', text: 'Nice to meet you! My name is Jordan.', signs: ['NICE', 'MEET', 'YOU', 'MY', 'NAME', 'J-O-R-D-A-N'] }
    ],
    steps: [
      '01 Sign MY NAME and fingerspell your name letter by letter.',
      '02 Inquire YOU NAME WHAT with lowered eyebrows.',
      '03 Express NICE TO MEET YOU with a friendly smile.'
    ]
  },
  {
    id: 403,
    title: 'Asking for Assistance',
    topic: 'Polite Requests & Help',
    description: 'How to ask for assistance or offer support respectfully.',
    verbalInstruction: 'Place a thumbs-up on your flat palm and move it forward to ask Can I help you, or towards yourself for Please help me.',
    dialogue: [
      { speaker: 'Signer A', text: 'Please help me.', signs: ['PLEASE', 'HELP', 'ME'] },
      { speaker: 'Signer B', text: 'Yes, I can help you!', signs: ['YES', 'I', 'HELP', 'YOU'] }
    ],
    steps: [
      '01 Circular rub on chest for PLEASE.',
      '02 Direct the HELP sign toward yourself or outward.',
      '03 Nod your fist up and down for YES.'
    ]
  },
  {
    id: 404,
    title: 'Parting & Farewell',
    topic: 'Social Farewells',
    description: 'Politely closing a conversation and parting ways.',
    verbalInstruction: 'Conclude with SEE YOU LATER and a warm nod, accompanied by THANK YOU and a soft parting wave.',
    dialogue: [
      { speaker: 'Signer A', text: 'Thank you very much! See you later.', signs: ['THANK-YOU', 'SEE', 'YOU', 'LATER'] },
      { speaker: 'Signer B', text: 'See you later, friend! Goodbye.', signs: ['SEE', 'YOU', 'LATER', 'FRIEND', 'GOODBYE'] }
    ],
    steps: [
      '01 Express two-handed gratitude for THANK YOU VERY MUCH.',
      '02 Form V-to-eyes and L-forward for SEE YOU LATER.',
      '03 Hook index fingers together for FRIEND.'
    ]
  }
];

export interface CurriculumLevel {
  level: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  itemCount: number;
  accent: string;
  icon: string;
  unlockedByDefault: boolean;
}

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    level: 1,
    slug: 'alphabet',
    title: 'ASL Alphabet',
    subtitle: '26 Letters (A – Z)',
    description: 'Master the foundation of American Sign Language fingerspelling with real-time on-device computer vision recognition.',
    itemCount: 26,
    accent: '#38bdf8',
    icon: '✋',
    unlockedByDefault: true,
  },
  {
    level: 2,
    slug: 'words',
    title: 'Essential Words',
    subtitle: '11 Core Vocabulary Signs',
    description: 'Learn everyday communicative vocabulary including greetings, gratitude, courtesy, and essential requests.',
    itemCount: 11,
    accent: '#facc15',
    icon: '💬',
    unlockedByDefault: true,
  },
  {
    level: 3,
    slug: 'phrases',
    title: 'Common Phrases',
    subtitle: 'Full Conversational Units',
    description: 'Combine vocabulary into multi-sign expressions with authentic non-manual facial grammar.',
    itemCount: 6,
    accent: '#4ade80',
    icon: '✨',
    unlockedByDefault: false,
  },
  {
    level: 4,
    slug: 'numbers',
    title: 'ASL Numbers',
    subtitle: 'Counting 1 – 10',
    description: 'Learn native ASL number orientations, including the distinct 3-finger handshape and palm transitions.',
    itemCount: 10,
    accent: '#c084fc',
    icon: '🔢',
    unlockedByDefault: false,
  },
  {
    level: 5,
    slug: 'conversation',
    title: 'Practical Conversation',
    subtitle: 'Dialogues & Scenarios',
    description: 'Practice real-life dialogue flow: introductions, asking for directions, ordering drinks, and social conversation.',
    itemCount: 4,
    accent: '#f43f5e',
    icon: '🤝',
    unlockedByDefault: false,
  }
];

export type LessonKind = 'alphabet' | 'word' | 'phrase' | 'number' | 'conversation';

export interface UnifiedLesson {
  id: number;
  kind: LessonKind;
  levelNumber: number;
  title: string;
  sign: string;
  badge: string;
  subtitle?: string;
  description: string;
  verbalInstruction: string;
  steps: string[];
  tips?: string;
  mistakes?: string[];
  handshape?: string;
  movement?: string;
  orientation?: string;
  breakdown?: string[];
  imageUrl?: string;
  signImage?: string;
  signAltText?: string;
  targetRecognition?: string;
  nextId?: number;
  prevId?: number;
}

export function getUnifiedLesson(id: number): UnifiedLesson | undefined {
  // 1. Alphabet 1 - 26
  if (id >= 1 && id <= 26) {
    const alpha = ASL_CURRICULUM.find(l => l.id === id);
    if (!alpha) return undefined;
    const visual = getSignVisualUrl(alpha.letter);
    const alt = getSignAltText(alpha.letter);
    return {
      id: alpha.id,
      kind: 'alphabet',
      levelNumber: 1,
      title: `Letter ${alpha.letter}`,
      sign: alpha.letter,
      badge: `Lesson ${alpha.id} of 26`,
      description: alpha.description,
      verbalInstruction: alpha.verbalInstruction,
      steps: alpha.keyPoints || [
        'Close your four fingers into a fist.',
        'Keep your thumb upright alongside index finger.',
        'Keep your wrist relaxed and held upright at chest height.'
      ],
      tips: alpha.practiceTip,
      mistakes: alpha.commonMistakes,
      handshape: alpha.handshape,
      movement: alpha.movement,
      orientation: alpha.orientation,
      imageUrl: visual,
      signImage: visual,
      signAltText: alt,
      targetRecognition: alpha.letter,
      nextId: id < 26 ? id + 1 : 101,
      prevId: id > 1 ? id - 1 : undefined,
    };
  }

  // 2. Words 101 - 111
  if (id >= 101 && id <= 111) {
    const wordIndex = WORD_LESSONS.findIndex(w => w.id === id);
    const word = WORD_LESSONS[wordIndex];
    if (!word) return undefined;
    const visual = getSignVisualUrl(word.word);
    const alt = getSignAltText(word.word);
    return {
      id: word.id,
      kind: 'word',
      levelNumber: 2,
      title: word.word,
      sign: word.word,
      badge: `Word ${wordIndex + 1} of ${WORD_LESSONS.length}`,
      subtitle: word.meaning,
      description: `Sign for "${word.word}" — ${word.meaning}. ${word.movement}.`,
      verbalInstruction: word.verbalInstruction,
      steps: word.steps,
      tips: word.tips,
      mistakes: word.mistakes,
      handshape: word.handshape,
      movement: word.movement,
      imageUrl: visual,
      signImage: visual,
      signAltText: alt,
      nextId: wordIndex < WORD_LESSONS.length - 1 ? WORD_LESSONS[wordIndex + 1].id : 201,
      prevId: wordIndex > 0 ? WORD_LESSONS[wordIndex - 1].id : 26,
    };
  }

  // 3. Phrases 201 - 206
  if (id >= 201 && id <= 206) {
    const phraseIndex = PHRASE_LESSONS.findIndex(p => p.id === id);
    const phrase = PHRASE_LESSONS[phraseIndex];
    if (!phrase) return undefined;
    const visual = getSignVisualUrl(phrase.phrase);
    const alt = getSignAltText(phrase.phrase);
    return {
      id: phrase.id,
      kind: 'phrase',
      levelNumber: 3,
      title: phrase.phrase,
      sign: phrase.phrase,
      badge: `Phrase ${phraseIndex + 1} of ${PHRASE_LESSONS.length}`,
      subtitle: phrase.meaning,
      description: phrase.meaning,
      verbalInstruction: phrase.verbalInstruction,
      steps: phrase.steps,
      tips: phrase.facialGrammar,
      breakdown: phrase.breakdown,
      imageUrl: visual,
      signImage: visual,
      signAltText: alt,
      nextId: phraseIndex < PHRASE_LESSONS.length - 1 ? PHRASE_LESSONS[phraseIndex + 1].id : 301,
      prevId: phraseIndex > 0 ? PHRASE_LESSONS[phraseIndex - 1].id : 111,
    };
  }

  // 4. Numbers 301 - 310
  if (id >= 301 && id <= 310) {
    const numIndex = NUMBER_LESSONS.findIndex(n => n.id === id);
    const num = NUMBER_LESSONS[numIndex];
    if (!num) return undefined;
    const visual = getSignVisualUrl(num.number);
    const alt = getSignAltText(num.number);
    return {
      id: num.id,
      kind: 'number',
      levelNumber: 4,
      title: `Number ${num.number}`,
      sign: num.number,
      badge: `Number ${numIndex + 1} of 10`,
      description: `ASL number ${num.number}: ${num.handshape}.`,
      verbalInstruction: num.verbalInstruction,
      steps: num.steps,
      handshape: num.handshape,
      imageUrl: visual,
      signImage: visual,
      signAltText: alt,
      targetRecognition: num.number,
      nextId: numIndex < NUMBER_LESSONS.length - 1 ? NUMBER_LESSONS[numIndex + 1].id : 401,
      prevId: numIndex > 0 ? NUMBER_LESSONS[numIndex - 1].id : 206,
    };
  }

  // 5. Conversation 401 - 404
  if (id >= 401 && id <= 404) {
    const convIndex = CONVERSATION_LESSONS.findIndex(c => c.id === id);
    const conv = CONVERSATION_LESSONS[convIndex];
    if (!conv) return undefined;
    const visual = getSignVisualUrl(conv.topic);
    const alt = getSignAltText(conv.topic);
    return {
      id: conv.id,
      kind: 'conversation',
      levelNumber: 5,
      title: conv.title,
      sign: conv.topic,
      badge: `Dialogue ${convIndex + 1} of ${CONVERSATION_LESSONS.length}`,
      subtitle: conv.topic,
      description: conv.description,
      verbalInstruction: conv.verbalInstruction,
      steps: conv.steps,
      breakdown: conv.dialogue.flatMap(d => d.signs),
      imageUrl: visual,
      signImage: visual,
      signAltText: alt,
      nextId: convIndex < CONVERSATION_LESSONS.length - 1 ? CONVERSATION_LESSONS[convIndex + 1].id : undefined,
      prevId: convIndex > 0 ? CONVERSATION_LESSONS[convIndex - 1].id : 310,
    };
  }

  return undefined;
}

