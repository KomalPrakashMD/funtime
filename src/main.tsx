import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createRoot } from 'react-dom/client'
import { ChevronRight, Heart, Leaf, Menu, Pause, Sparkles, Volume2, X } from 'lucide-react'
import './styles.css'

type GameId = 'garden' | 'safari' | 'cloud' | 'numbers' | 'pattern' | 'story' | 'memory' | 'shape' | 'sound' | 'doodle' | 'coloring' | 'voice' | 'difference' | 'grid' | 'missing' | 'maze' | 'codecolor' | 'rebus' | 'shadow' | 'oddone' | 'decode' | 'crossword'
type Age = '4–6' | '7–9' | '10–12'

const games: Record<GameId, { title: string; subtitle: string; icon: string; className: string; tag: string; minutes: string }> = {
  garden: { title: 'Color Garden', subtitle: 'Grow a rainbow', icon: '🌈', className: 'coral-card', tag: 'Creative', minutes: '5 min' },
  safari: { title: 'Word Safari', subtitle: 'Spot the word', icon: '🦉', className: 'sky-card', tag: 'Language', minutes: '7 min' },
  cloud: { title: 'Calm Cloud', subtitle: 'Breathe & reset', icon: '☁️', className: 'mint-card', tag: 'Mindful', minutes: '3 min' },
  numbers: { title: 'Dino Math', subtitle: 'Count the roar', icon: '🦕', className: 'sun-card', tag: 'Numbers', minutes: '6 min' },
  pattern: { title: 'Pattern Parade', subtitle: 'What comes next?', icon: '🎪', className: 'lavender-card', tag: 'Logic', minutes: '5 min' },
  story: { title: 'Story Spark', subtitle: 'Make it yours', icon: '🪄', className: 'peach-card', tag: 'Imagination', minutes: '6 min' },
  memory: { title: 'Memory Meadow', subtitle: 'Remember the pair', icon: '🧠', className: 'rose-card', tag: 'Memory', minutes: '5 min' },
  shape: { title: 'Shape Studio', subtitle: 'Build & notice', icon: '🔷', className: 'aqua-card', tag: 'Visual', minutes: '6 min' },
  sound: { title: 'Sound Detective', subtitle: 'Listen closely', icon: '🎧', className: 'butter-card', tag: 'Listening', minutes: '4 min' },
  doodle: { title: 'Doodle Dance', subtitle: 'Draw & animate', icon: '🖍️', className: 'aqua-card', tag: 'Create', minutes: '8 min' },
  coloring: { title: 'Coloring Studio', subtitle: 'Paint your world', icon: '🎨', className: 'color-card', tag: 'Art', minutes: '10 min' },
  voice: { title: 'Voice Lab', subtitle: 'Record & remix', icon: '🎙️', className: 'voice-card', tag: 'Express', minutes: '5 min' },
  difference: { title: 'Picture Detectives', subtitle: 'Spot the changes', icon: '🔎', className: 'rose-card', tag: 'Notice', minutes: '6 min' },
  grid: { title: 'Word Grid', subtitle: 'Find the hidden names', icon: '🔤', className: 'sky-card', tag: 'Words', minutes: '7 min' },
  missing: { title: 'Missing Magic', subtitle: 'What disappeared?', icon: '🧩', className: 'lavender-card', tag: 'Memory', minutes: '5 min' },
  maze: { title: 'Moon Maze', subtitle: 'Find the right path', icon: '🌀', className: 'mint-card', tag: 'Pathfinder', minutes: '6 min' },
  codecolor: { title: 'Color Code', subtitle: 'Paint by clues', icon: '🟨', className: 'sun-card', tag: 'Creative', minutes: '6 min' },
  rebus: { title: 'Rebus Riddles', subtitle: 'Read the picture clue', icon: '💡', className: 'peach-card', tag: 'Think', minutes: '5 min' },
  shadow: { title: 'Shadow Match', subtitle: 'Find the silhouette', icon: '🌗', className: 'aqua-card', tag: 'Visual', minutes: '5 min' },
  oddone: { title: 'Odd One Out', subtitle: 'Find the different one', icon: '🦄', className: 'color-card', tag: 'Focus', minutes: '5 min' },
  decode: { title: 'Word Decoder', subtitle: 'Unlock the letters', icon: '🔐', className: 'voice-card', tag: 'Language', minutes: '7 min' },
  crossword: { title: 'Mini Crosswords', subtitle: 'Clue by clue', icon: '✏️', className: 'butter-card', tag: 'Words', minutes: '8 min' },
}

const gardenRounds = [
  { target: 'SUNNY YELLOW', color: '#f6c453', options: ['#f6c453', '#ef897f', '#80b9d8', '#94c9af'] },
  { target: 'MEADOW GREEN', color: '#94c9af', options: ['#ef897f', '#94c9af', '#f6c453', '#a893c5'] },
  { target: 'SKY BLUE', color: '#80b9d8', options: ['#a893c5', '#f6c453', '#80b9d8', '#ef897f'] },
  { target: 'SUNSET CORAL', color: '#ef897f', options: ['#94c9af', '#80b9d8', '#ef897f', '#f6c453'] },
  { target: 'DREAMY LILAC', color: '#a893c5', options: ['#f6c453', '#a893c5', '#94c9af', '#80b9d8'] },
  { target: 'APPLE RED', color: '#d96364', options: ['#80b9d8', '#d96364', '#f6c453', '#94c9af'] },
  { target: 'OCEAN TEAL', color: '#5eaaa1', options: ['#a893c5', '#ef897f', '#5eaaa1', '#f6c453'] },
  { target: 'PEACHY ORANGE', color: '#f3a66f', options: ['#94c9af', '#f3a66f', '#80b9d8', '#a893c5'] },
  { target: 'CLOUD WHITE', color: '#fffdf9', options: ['#f3a66f', '#fffdf9', '#d96364', '#5eaaa1'] },
  { target: 'BERRY PINK', color: '#e28ca2', options: ['#e28ca2', '#80b9d8', '#f6c453', '#94c9af'] },
  { target: 'FOREST MOSS', color: '#6b9f7f', options: ['#a893c5', '#6b9f7f', '#ef897f', '#f3a66f'] },
  { target: 'LAGOON BLUE', color: '#5eaaa1', options: ['#d96364', '#f6c453', '#5eaaa1', '#a893c5'] },
  { target: 'LEMON GOLD', color: '#f6c453', options: ['#94c9af', '#f6c453', '#80b9d8', '#e28ca2'] },
  { target: 'PEARL CREAM', color: '#fffdf9', options: ['#6b9f7f', '#a893c5', '#fffdf9', '#d96364'] },
  { target: 'ROSE PINK', color: '#e28ca2', options: ['#80b9d8', '#e28ca2', '#6b9f7f', '#f6c453'] },
  { target: 'TWILIGHT PURPLE', color: '#a893c5', options: ['#ef897f', '#a893c5', '#f3a66f', '#94c9af'] },
  { target: 'GRASSY GREEN', color: '#6b9f7f', options: ['#6b9f7f', '#d96364', '#80b9d8', '#f6c453'] },
  { target: 'RAINY SKY', color: '#80b9d8', options: ['#f3a66f', '#94c9af', '#80b9d8', '#a893c5'] },
  { target: 'WARM APRICOT', color: '#f3a66f', options: ['#d96364', '#f3a66f', '#fffdf9', '#5eaaa1'] },
  { target: 'MINT LEAF', color: '#94c9af', options: ['#f6c453', '#94c9af', '#e28ca2', '#80b9d8'] },
  { target: 'CORAL BLOOM', color: '#ef897f', options: ['#a893c5', '#fffdf9', '#ef897f', '#6b9f7f'] },
  { target: 'DEEP OCEAN', color: '#5eaaa1', options: ['#5eaaa1', '#f3a66f', '#d96364', '#f6c453'] },
  { target: 'SUNNY CREAM', color: '#fffdf9', options: ['#e28ca2', '#fffdf9', '#6b9f7f', '#80b9d8'] },
  { target: 'GOLDEN HONEY', color: '#f6c453', options: ['#a893c5', '#ef897f', '#f6c453', '#94c9af'] },
  { target: 'SKY MIST', color: '#80b9d8', options: ['#80b9d8', '#e28ca2', '#6b9f7f', '#f3a66f'] },
]

const safariRounds = [
  { emoji: '🍎', prompt: 'Which word says apple?', options: ['APPLE', 'MOON', 'SHELL'], answer: 'APPLE' },
  { emoji: '🐢', prompt: 'Which word says turtle?', options: ['CLOUD', 'TURTLE', 'SUN'], answer: 'TURTLE' },
  { emoji: '🌙', prompt: 'Which word says moon?', options: ['TREE', 'MOON', 'FISH'], answer: 'MOON' },
  { emoji: '🐝', prompt: 'Which word says bee?', options: ['BEE', 'BOAT', 'BIRD'], answer: 'BEE' },
  { emoji: '🌻', prompt: 'Which word says flower?', options: ['FROG', 'FLOWER', 'FIRE'], answer: 'FLOWER' },
  { emoji: '🚲', prompt: 'Which word says bike?', options: ['BIKE', 'BOOK', 'BALL'], answer: 'BIKE' },
  { emoji: '🐱', prompt: 'Which word says cat?', options: ['CUP', 'CAT', 'CAR'], answer: 'CAT' },
  { emoji: '🌳', prompt: 'Which word says tree?', options: ['TREE', 'TRAIN', 'TOY'], answer: 'TREE' },
  { emoji: '🐟', prompt: 'Which word says fish?', options: ['FAN', 'FISH', 'FIRE'], answer: 'FISH' },
  { emoji: '🍌', prompt: 'Which word says banana?', options: ['BASKET', 'BANANA', 'BUTTON'], answer: 'BANANA' },
  { emoji: '⭐', prompt: 'Which word says star?', options: ['STAR', 'STONE', 'STOP'], answer: 'STAR' },
  { emoji: '🐶', prompt: 'Which word says dog?', options: ['DIG', 'DOG', 'DOT'], answer: 'DOG' },
  { emoji: '☀️', prompt: 'Which word says sun?', options: ['SUN', 'SOCK', 'SAND'], answer: 'SUN' },
  { emoji: '🍕', prompt: 'Which word says pizza?', options: ['PIG', 'PIZZA', 'PINK'], answer: 'PIZZA' },
  { emoji: '🏠', prompt: 'Which word says house?', options: ['HORSE', 'HOUSE', 'HAT'], answer: 'HOUSE' },
  { emoji: '🚂', prompt: 'Which word says train?', options: ['TREE', 'TRUCK', 'TRAIN'], answer: 'TRAIN' },
  { emoji: '🌈', prompt: 'Which word says rainbow?', options: ['RAINBOW', 'RABBIT', 'ROBOT'], answer: 'RAINBOW' },
  { emoji: '🥕', prompt: 'Which word says carrot?', options: ['CANDLE', 'CARROT', 'CROWN'], answer: 'CARROT' },
  { emoji: '🚌', prompt: 'Which word says bus?', options: ['BUN', 'BUS', 'BUG'], answer: 'BUS' },
  { emoji: '🦁', prompt: 'Which word says lion?', options: ['LION', 'LIGHT', 'LINE'], answer: 'LION' },
  { emoji: '🍪', prompt: 'Which word says cookie?', options: ['COAT', 'COOKIE', 'CORN'], answer: 'COOKIE' },
  { emoji: '🌊', prompt: 'Which word says wave?', options: ['WALL', 'WAVE', 'WAGON'], answer: 'WAVE' },
  { emoji: '🧸', prompt: 'Which word says teddy?', options: ['TENT', 'TEDDY', 'TEA'], answer: 'TEDDY' },
  { emoji: '🥁', prompt: 'Which word says drum?', options: ['DRUM', 'DRESS', 'DROP'], answer: 'DRUM' },
  { emoji: '🪁', prompt: 'Which word says kite?', options: ['KID', 'KITE', 'KING'], answer: 'KITE' },
]

const numberRounds = [
  { prompt: 'A dino has 2 snacks and finds 3 more. How many?', options: ['4', '5', '6'], answer: '5' },
  { prompt: 'There are 7 eggs. 2 hatch. How many are left?', options: ['5', '6', '9'], answer: '5' },
  { prompt: 'Count the stars: ⭐ ⭐ ⭐ ⭐', options: ['3', '4', '5'], answer: '4' },
  { prompt: 'A nest has 4 eggs and 1 hatches. How many stay?', options: ['3', '4', '5'], answer: '3' },
  { prompt: 'You collect 2 shells, then 2 more. How many?', options: ['2', '3', '4'], answer: '4' },
  { prompt: 'Count the dots: 🔵 🔵 🔵 🔵 🔵', options: ['4', '5', '6'], answer: '5' },
  { prompt: 'You have 6 crayons and give away 2. How many remain?', options: ['3', '4', '5'], answer: '4' },
  { prompt: 'There are 3 birds, then 2 more fly over. How many now?', options: ['4', '5', '6'], answer: '5' },
  { prompt: 'Count the flowers: 🌸 🌸 🌸 🌸 🌸 🌸', options: ['5', '6', '7'], answer: '6' },
  { prompt: 'A frog takes 1 jump, then 4 more. How many jumps?', options: ['4', '5', '6'], answer: '5' },
  { prompt: 'You find 8 pebbles and hide 3. How many can you see?', options: ['5', '6', '7'], answer: '5' },
  { prompt: 'You have 5 stickers and get 3 more. How many?', options: ['7', '8', '9'], answer: '8' },
  { prompt: 'There are 9 balloons. 4 float away. How many remain?', options: ['4', '5', '6'], answer: '5' },
  { prompt: 'Count the dots: 🟣 🟣 🟣 🟣 🟣 🟣 🟣', options: ['6', '7', '8'], answer: '7' },
  { prompt: 'A squirrel hides 2 nuts, then 5 more. How many?', options: ['6', '7', '8'], answer: '7' },
  { prompt: 'You have 10 fingers and fold down 3. How many up?', options: ['6', '7', '8'], answer: '7' },
  { prompt: 'You find 4 shells and then 4 more. How many?', options: ['7', '8', '9'], answer: '8' },
  { prompt: 'There are 8 ducks and 3 swim away. How many stay?', options: ['4', '5', '6'], answer: '5' },
  { prompt: 'Count the hearts: ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️ ❤️', options: ['7', '8', '9'], answer: '8' },
  { prompt: 'A cat has 2 toys and gets 5 more. How many?', options: ['6', '7', '8'], answer: '7' },
  { prompt: 'You have 7 beads and lose 1. How many left?', options: ['5', '6', '7'], answer: '6' },
  { prompt: 'There are 2 red balloons and 6 blue ones. How many?', options: ['7', '8', '9'], answer: '8' },
  { prompt: 'Count the stars: ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐', options: ['8', '9', '10'], answer: '9' },
  { prompt: 'A bunny hops 3 times, then 3 more. How many?', options: ['5', '6', '7'], answer: '6' },
  { prompt: 'You share 6 grapes with a friend and each gets 3. How many each?', options: ['2', '3', '4'], answer: '3' },
]

const patternRounds = [
  { sequence: '🌸  🌿  🌸  🌿  ?', options: ['🌸', '🌞', '🌿'], answer: '🌸' },
  { sequence: '🔵  🔵  🟡  🔵  🔵  ?', options: ['🟡', '🔵', '🟢'], answer: '🟡' },
  { sequence: '🐝  🌼  🌼  🐝  🌼  🌼  ?', options: ['🌼', '🐝', '🍃'], answer: '🐝' },
  { sequence: '⭐  🌙  ⭐  🌙  ?', options: ['☁️', '⭐', '🌙'], answer: '⭐' },
  { sequence: '🍎  🍎  🍐  🍎  🍎  ?', options: ['🍎', '🍐', '🍊'], answer: '🍐' },
  { sequence: '🟢  🟡  🟢  🟡  ?', options: ['🔵', '🟢', '🟡'], answer: '🟢' },
  { sequence: '🐶  🐱  🐰  🐶  🐱  ?', options: ['🐭', '🐰', '🐶'], answer: '🐰' },
  { sequence: '🔺  🔺  🔵  🔺  🔺  ?', options: ['🔺', '🔵', '🟣'], answer: '🔵' },
  { sequence: '☀️  🌧️  ☀️  🌧️  ?', options: ['☀️', '❄️', '🌧️'], answer: '☀️' },
  { sequence: '🟣  🟢  🟢  🟣  🟢  🟢  ?', options: ['🟣', '🟢', '🟡'], answer: '🟣' },
  { sequence: '🍓  🍌  🍓  🍌  ?', options: ['🍎', '🍓', '🍌'], answer: '🍓' },
  { sequence: '1  2  1  2  ?', options: ['1', '2', '3'], answer: '1' },
  { sequence: '⬆️  ➡️  ⬆️  ➡️  ?', options: ['⬇️', '⬆️', '➡️'], answer: '⬆️' },
  { sequence: '🌈  ☁️  ☁️  🌈  ☁️  ☁️  ?', options: ['🌈', '☁️', '🌞'], answer: '🌈' },
  { sequence: '🔴  🔵  🟢  🔴  🔵  ?', options: ['🔴', '🟢', '🔵'], answer: '🟢' },
  { sequence: '🍪  🍪  🍎  🍪  🍪  ?', options: ['🍎', '🍪', '🍌'], answer: '🍎' },
  { sequence: '🌙  ⭐  ⭐  🌙  ⭐  ⭐  ?', options: ['🌙', '⭐', '☁️'], answer: '🌙' },
  { sequence: 'A  B  C  A  B  ?', options: ['A', 'B', 'C'], answer: 'C' },
  { sequence: '⬅️  ⬇️  ⬅️  ⬇️  ?', options: ['⬆️', '⬅️', '⬇️'], answer: '⬅️' },
  { sequence: '🐸  🐸  🐟  🐸  🐸  ?', options: ['🐸', '🐟', '🐢'], answer: '🐟' },
  { sequence: '🟡  🟢  🟡  🟢  ?', options: ['🟡', '🟢', '🔵'], answer: '🟡' },
  { sequence: '🌸  🌸  🌿  🌸  🌸  ?', options: ['🌿', '🌸', '🍃'], answer: '🌿' },
  { sequence: '2  4  2  4  ?', options: ['2', '3', '4'], answer: '2' },
  { sequence: '🎈  🎁  🎈  🎁  ?', options: ['🎈', '🎁', '🎉'], answer: '🎈' },
  { sequence: '🐝  🐝  🌼  🐝  🐝  ?', options: ['🐝', '🌼', '🦋'], answer: '🌼' },
]

const storyRounds = [
  { prompt: 'The tiny fox finds a door in a tree. What should be inside?', options: ['A secret library', 'A loud alarm', 'Nothing at all'], answer: 'A secret library' },
  { prompt: 'The moon feels lonely. Who can visit?', options: ['A friendly star', 'A grumpy cloud', 'A sleepy rock'], answer: 'A friendly star' },
  { prompt: 'The robot learns one new thing today. It learns to...', options: ['Help a friend', 'Hide forever', 'Forget its name'], answer: 'Help a friend' },
  { prompt: 'A little cloud wants to make someone smile. It sends...', options: ['A rainbow', 'A thunderclap', 'A blank note'], answer: 'A rainbow' },
  { prompt: 'The brave bunny sees a new path. It decides to...', options: ['Explore with a friend', 'Turn into a rock', 'Close its eyes'], answer: 'Explore with a friend' },
  { prompt: 'A shy star wants to join the party. It could...', options: ['Say hello', 'Hide behind the moon', 'Turn off the lights'], answer: 'Say hello' },
  { prompt: 'The garden is thirsty. What can help?', options: ['A gentle rain', 'More sand', 'A pillow'], answer: 'A gentle rain' },
  { prompt: 'A tiny dragon cannot reach the cookie. It asks for...', options: ['A helping hand', 'A thunderstorm', 'A sleepy hat'], answer: 'A helping hand' },
  { prompt: 'The friends build a fort. What should they add?', options: ['A cozy flag', 'A puddle', 'A hole in the roof'], answer: 'A cozy flag' },
  { prompt: 'The penguin wants to travel. What could it ride?', options: ['A tiny sled', 'A sandwich', 'A pillow'], answer: 'A tiny sled' },
  { prompt: 'The stars are sleepy. What can help?', options: ['A lullaby', 'A loud drum', 'A bright alarm'], answer: 'A lullaby' },
  { prompt: 'The little seed starts to grow. What does it need?', options: ['Sun and water', 'A backpack', 'A pair of shoes'], answer: 'Sun and water' },
  { prompt: 'The friends find a treasure map. Where should they look?', options: ['Under the old tree', 'Inside a cloud', 'On the moon'], answer: 'Under the old tree' },
  { prompt: 'A kind giant feels sad. What could cheer them up?', options: ['A warm hug', 'A storm', 'A locked door'], answer: 'A warm hug' },
  { prompt: 'The mouse hears music. What should it do?', options: ['Dance along', 'Hide the music', 'Fall asleep'], answer: 'Dance along' },
  { prompt: 'A cloud wants a new shape. What could it become?', options: ['A bunny', 'A brick', 'A shoe box'], answer: 'A bunny' },
  { prompt: 'The turtle reaches the finish line. Who celebrates?', options: ['All the friends', 'Nobody', 'The empty chair'], answer: 'All the friends' },
  { prompt: 'The fairy finds a seed. Where should she plant it?', options: ['In soft soil', 'On a rooftop', 'In a sock'], answer: 'In soft soil' },
  { prompt: 'The astronaut sees a new planet. What should they do?', options: ['Explore kindly', 'Break a star', 'Turn off the sun'], answer: 'Explore kindly' },
  { prompt: 'The bear wants to share honey. What is kind?', options: ['Offer some', 'Hide it all', 'Throw it away'], answer: 'Offer some' },
  { prompt: 'The kite is stuck in a tree. Who can help?', options: ['A tall friend', 'A tiny pebble', 'A sleepy cloud'], answer: 'A tall friend' },
  { prompt: 'The puppy finds a lost mitten. What should it do?', options: ['Return it', 'Bury it', 'Eat it'], answer: 'Return it' },
  { prompt: 'The rainbow fades. What can everyone do?', options: ['Wait for sunshine', 'Paint the sky black', 'Close every window'], answer: 'Wait for sunshine' },
  { prompt: 'The little boat feels wobbly. What helps?', options: ['A calm breath', 'A bigger wave', 'A heavy rock'], answer: 'A calm breath' },
  { prompt: 'The friends want a team name. Which sounds friendly?', options: ['The Kind Crew', 'The No-Fun Club', 'The Quiet Wall'], answer: 'The Kind Crew' },
]

const memoryRounds = [
  { prompt: 'Which one did you see in the garden?', options: ['🌻', '🚀', '🎸'], answer: '🌻' },
  { prompt: 'Remember this friendly face:', options: ['🐼', '🦊', '🐸'], answer: '🦊' },
  { prompt: 'Which snack was in the picnic basket?', options: ['🍉', '🍪', '🥕'], answer: '🍪' },
  { prompt: 'Which color appeared first?', options: ['💙', '💛', '💚'], answer: '💛' },
  { prompt: 'Which animal did you see hop?', options: ['🐰', '🐳', '🐌'], answer: '🐰' },
  { prompt: 'Remember the picnic fruit:', options: ['🍓', '🍋', '🍇'], answer: '🍓' },
  { prompt: 'Which vehicle zoomed by?', options: ['🚗', '⛵', '🚲'], answer: '🚲' },
  { prompt: 'Which weather appeared?', options: ['🌧️', '☀️', '🌪️'], answer: '☀️' },
  { prompt: 'Which animal was wearing a hat?', options: ['🐻', '🐸', '🦁'], answer: '🐻' },
  { prompt: 'Which toy was on the rug?', options: ['🧸', '🚂', '🪁'], answer: '🪁' },
  { prompt: 'Which snack did you see?', options: ['🍿', '🍎', '🍩'], answer: '🍩' },
  { prompt: 'Which color was on the kite?', options: ['🔴', '🔵', '🟢'], answer: '🔵' },
  { prompt: 'Which sound did the bell make?', options: ['🔔', '🥁', '🎺'], answer: '🔔' },
  { prompt: 'Which animal was hiding behind the bush?', options: ['🦔', '🦒', '🐙'], answer: '🦔' },
  { prompt: 'Which animal did you see swim?', options: ['🐠', '🐰', '🐔'], answer: '🐠' },
  { prompt: 'Which object was beside the book?', options: ['✏️', '🍎', '🧦'], answer: '✏️' },
  { prompt: 'Which color did the balloon become?', options: ['🟠', '🟣', '🟢'], answer: '🟣' },
  { prompt: 'Which fruit was on the plate?', options: ['🍉', '🍌', '🍓'], answer: '🍉' },
  { prompt: 'Which animal opened the door?', options: ['🐭', '🐘', '🐧'], answer: '🐭' },
  { prompt: 'Which shape did you see first?', options: ['🔺', '⭐', '❤️'], answer: '⭐' },
  { prompt: 'Which character wore boots?', options: ['🐸', '🐱', '🐶'], answer: '🐶' },
  { prompt: 'Which flower was tallest?', options: ['🌷', '🌻', '🌹'], answer: '🌻' },
  { prompt: 'Which vehicle made a beep?', options: ['🚗', '🚲', '🛶'], answer: '🚗' },
  { prompt: 'Which instrument was loudest?', options: ['🎺', '🔔', '🎻'], answer: '🎺' },
  { prompt: 'Which weather came after the rain?', options: ['🌈', '❄️', '🌪️'], answer: '🌈' },
]

const shapeRounds = [
  { prompt: 'Which shape has no corners?', options: ['○', '△', '□'], answer: '○' },
  { prompt: 'Which shape has three sides?', options: ['◇', '△', '▭'], answer: '△' },
  { prompt: 'Which shape is hiding in the kite?', options: ['□', '○', '◇'], answer: '◇' },
  { prompt: 'Which shape can roll like a wheel?', options: ['△', '○', '▭'], answer: '○' },
  { prompt: 'Which shape has four equal sides?', options: ['□', '○', '△'], answer: '□' },
  { prompt: 'Which shape looks like an egg?', options: ['○', '⬭', '◇'], answer: '⬭' },
  { prompt: 'Which shape has one long side and one short side?', options: ['▭', '○', '△'], answer: '▭' },
  { prompt: 'Which shape has four corners?', options: ['△', '□', '○'], answer: '□' },
  { prompt: 'Which shape looks like a slice of pizza?', options: ['△', '○', '□'], answer: '△' },
  { prompt: 'Which shape has no straight sides?', options: ['○', '◇', '▭'], answer: '○' },
  { prompt: 'Which shape looks like a diamond?', options: ['◇', '□', '△'], answer: '◇' },
  { prompt: 'Which shape looks like a door?', options: ['▭', '○', '△'], answer: '▭' },
  { prompt: 'Which shape has three corners?', options: ['□', '△', '○'], answer: '△' },
  { prompt: 'Which shape looks like a coin?', options: ['○', '△', '□'], answer: '○' },
  { prompt: 'Which shape has four sides?', options: ['△', '□', '○'], answer: '□' },
  { prompt: 'Which shape points upward?', options: ['△', '○', '▭'], answer: '△' },
  { prompt: 'Which shape is widest?', options: ['▭', '○', '◇'], answer: '▭' },
  { prompt: 'Which shape has slanted sides?', options: ['◇', '□', '○'], answer: '◇' },
  { prompt: 'Which shape would fit a round button?', options: ['○', '△', '□'], answer: '○' },
  { prompt: 'Which shape looks like a window?', options: ['□', '○', '△'], answer: '□' },
  { prompt: 'Which shape has a point at the top?', options: ['△', '○', '▭'], answer: '△' },
  { prompt: 'Which shape is like a stretched circle?', options: ['⬭', '□', '◇'], answer: '⬭' },
  { prompt: 'Which shape could be a treasure tile?', options: ['◇', '○', '△'], answer: '◇' },
  { prompt: 'Which shape has a flat top and bottom?', options: ['▭', '○', '△'], answer: '▭' },
  { prompt: 'Which shape can be split into two triangles?', options: ['◇', '○', '▭'], answer: '◇' },
]

const soundRounds = [
  { prompt: 'Which word rhymes with CAT?', options: ['SUN', 'HAT', 'BEE'], answer: 'HAT' },
  { prompt: 'Which word starts like MOON?', options: ['MAP', 'SOCK', 'RAIN'], answer: 'MAP' },
  { prompt: 'Which word sounds like a tiny bell?', options: ['DING', 'SPLASH', 'WHOOSH'], answer: 'DING' },
  { prompt: 'Which word has two claps?', options: ['SUN', 'BUTTERFLY', 'CAT'], answer: 'BUTTERFLY' },
  { prompt: 'Which word rhymes with DOG?', options: ['LOG', 'FISH', 'MOON'], answer: 'LOG' },
  { prompt: 'Which word starts like SUN?', options: ['SOCK', 'MOON', 'TREE'], answer: 'SOCK' },
  { prompt: 'Which word rhymes with BEE?', options: ['TREE', 'DOG', 'CAR'], answer: 'TREE' },
  { prompt: 'Which word has three claps?', options: ['ELEPHANT', 'BIRD', 'SUN'], answer: 'ELEPHANT' },
  { prompt: 'Which word rhymes with FROG?', options: ['LOG', 'FISH', 'TREE'], answer: 'LOG' },
  { prompt: 'Which word starts like FISH?', options: ['FAN', 'MOON', 'DOG'], answer: 'FAN' },
  { prompt: 'Which word rhymes with CAKE?', options: ['LAKE', 'SUN', 'BEE'], answer: 'LAKE' },
  { prompt: 'Which word has one clap?', options: ['RAINBOW', 'CAT', 'BUTTERFLY'], answer: 'CAT' },
  { prompt: 'Which word starts like BALL?', options: ['BEE', 'MOON', 'SUN'], answer: 'BEE' },
  { prompt: 'Which word rhymes with SUN?', options: ['FUN', 'FISH', 'TREE'], answer: 'FUN' },
  { prompt: 'Which word starts like MOON?', options: ['MOP', 'CAT', 'SUN'], answer: 'MOP' },
  { prompt: 'Which word rhymes with STAR?', options: ['CAR', 'BEE', 'DOG'], answer: 'CAR' },
  { prompt: 'Which word has two claps?', options: ['RAINBOW', 'DOG', 'SUN'], answer: 'RAINBOW' },
  { prompt: 'Which word starts like TREE?', options: ['TRAIN', 'FISH', 'MOON'], answer: 'TRAIN' },
  { prompt: 'Which word rhymes with FOX?', options: ['BOX', 'SUN', 'BEE'], answer: 'BOX' },
  { prompt: 'Which word has one clap?', options: ['KITE', 'BUTTERFLY', 'ELEPHANT'], answer: 'KITE' },
  { prompt: 'Which word starts like PIG?', options: ['PIZZA', 'MOON', 'TREE'], answer: 'PIZZA' },
  { prompt: 'Which word rhymes with TREE?', options: ['BEE', 'DOG', 'CAR'], answer: 'BEE' },
  { prompt: 'Which word has three claps?', options: ['BANANA', 'FISH', 'CAT'], answer: 'BANANA' },
  { prompt: 'Which word starts like CAKE?', options: ['CAR', 'MOON', 'SUN'], answer: 'CAR' },
  { prompt: 'Which word rhymes with LIGHT?', options: ['NIGHT', 'DOG', 'TREE'], answer: 'NIGHT' },
]

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

const ageSettings: Record<Age, { rounds: number; label: string; helper: string }> = {
  '4–6': { rounds: 5, label: 'Gentle play', helper: 'Short, friendly adventures with extra breathing room.' },
  '7–9': { rounds: 8, label: 'Explorer mode', helper: 'A balanced mix of play, practice, and surprises.' },
  '10–12': { rounds: 10, label: 'Challenge mode', helper: 'Longer sessions with more chances to stretch your thinking.' },
}

function playTone(frequency = 520, duration = 0.12, type: OscillatorType = 'sine') {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return
  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = type
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + duration + 0.02)
  window.setTimeout(() => void context.close(), duration * 1000 + 80)
}

function App() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null)
  const [age, setAge] = useState<Age>('7–9')
  const [stars, setStars] = useState(12)
  const [streak, setStreak] = useState(4)
  const [showMenu, setShowMenu] = useState(false)

  const openGame = (game: GameId) => setActiveGame(game)
  const closeGame = () => setActiveGame(null)

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={closeGame} aria-label="Go to home">
          <span className="brand-mark"><Leaf size={19} strokeWidth={2.5} /></span>
          <span>Fun<span>Times</span></span>
        </button>
        <div className="top-actions">
          <div className="streak-pill"><span className="flame">✦</span><strong>{streak}</strong><span>day streak</span></div>
          <button className="icon-button" onClick={() => setShowMenu((value) => !value)} aria-label="Open menu"><Menu size={21} /></button>
          {showMenu && <div className="account-menu"><strong>Grown-up corner</strong><span>Progress is looking lovely.</span><button onClick={() => setShowMenu(false)}>Close</button></div>}
        </div>
      </header>

      {activeGame ? <GameRoom game={activeGame} age={age} onClose={closeGame} onReward={() => { setStars((value) => value + 3); setStreak((value) => Math.min(value + 1, 99)) }} /> : <Home age={age} setAge={setAge} stars={stars} onOpen={openGame} />}

      <footer className="footer-note"><span className="green-dot" />A gentle place to play, learn, and feel good.</footer>
    </main>
  )
}

function Home({ age, setAge, stars, onOpen }: { age: Age; setAge: (age: Age) => void; stars: number; onOpen: (game: GameId) => void }) {
  return (
    <div className="home-page">
      <section className="welcome-grid">
        <div className="welcome-copy">
          <p className="eyebrow"><Sparkles size={14} /> YOUR LITTLE UNIVERSE</p>
          <h1>Hi, <span>Amelia.</span><br />Ready to wonder?</h1>
          <p className="intro">A few tiny adventures are waiting for you today. Pick one that feels good.</p>
          <div className="age-picker" aria-label="Choose age range">
            <span>Playing for</span>
            {(['4–6', '7–9', '10–12'] as Age[]).map((option) => <button key={option} className={age === option ? 'selected' : ''} onClick={() => setAge(option)}>{option}</button>)}
          </div>
          <p className="age-mode"><strong>{ageSettings[age].label}</strong><span>{ageSettings[age].helper}</span></p>
        </div>
        <div className="hero-art" aria-label="Illustration of a happy sprout in a garden" role="img">
          <div className="sun-disc" />
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
          <div className="hill hill-back" /><div className="hill hill-front" />
          <div className="sprout-character"><div className="sprout-face">•ᴗ•</div><div className="sprout-leaves"><i /><i /></div></div>
          <div className="flower flower-one">✦</div><div className="flower flower-two">✿</div><div className="pebble pebble-one" /><div className="pebble pebble-two" />
          <span className="art-caption">small steps<br /><strong>big wonder</strong></span>
        </div>
      </section>

      <section className="section-heading"><div><p className="eyebrow">PICK YOUR PATH</p><h2>What feels fun today?</h2></div><button className="text-button">See all <ChevronRight size={17} /></button></section>
      <section className="game-grid">
        <GameCard game="garden" onOpen={onOpen} large />
        <GameCard game="safari" onOpen={onOpen} />
        <GameCard game="cloud" onOpen={onOpen} />
        <GameCard game="numbers" onOpen={onOpen} />
        <GameCard game="pattern" onOpen={onOpen} />
        <GameCard game="story" onOpen={onOpen} />
        <GameCard game="memory" onOpen={onOpen} />
        <GameCard game="shape" onOpen={onOpen} />
        <GameCard game="sound" onOpen={onOpen} />
        <GameCard game="doodle" onOpen={onOpen} />
        <GameCard game="coloring" onOpen={onOpen} />
        <GameCard game="voice" onOpen={onOpen} />
        <GameCard game="difference" onOpen={onOpen} />
        <GameCard game="grid" onOpen={onOpen} />
        <GameCard game="missing" onOpen={onOpen} />
        <GameCard game="maze" onOpen={onOpen} />
        <GameCard game="codecolor" onOpen={onOpen} />
        <GameCard game="rebus" onOpen={onOpen} />
        <GameCard game="shadow" onOpen={onOpen} />
        <GameCard game="oddone" onOpen={onOpen} />
        <GameCard game="decode" onOpen={onOpen} />
        <GameCard game="crossword" onOpen={onOpen} />
      </section>

      <section className="progress-strip">
        <div className="progress-copy"><div className="progress-icon">✦</div><div><p className="eyebrow">YOUR GARDEN</p><h3>Growing beautifully</h3><p>{stars} bright stars collected this week</p></div></div>
        <div className="progress-track"><div style={{ width: `${Math.min(stars / 20 * 100, 100)}%` }} /></div><span className="progress-count">{stars}<small>/ 20</small></span>
      </section>
    </div>
  )
}

function GameCard({ game, onOpen, large = false }: { game: GameId; onOpen: (game: GameId) => void; large?: boolean }) {
  const data = games[game]
  return <article className={`game-card ${data.className} ${large ? 'large-card' : ''}`} onClick={() => onOpen(game)}>
    <div className="card-top"><span className="game-tag">{data.tag}</span><span className="duration">{data.minutes}</span></div>
    <div className="game-emoji">{data.icon}</div><div className="game-card-copy"><h3>{data.title}</h3><p>{data.subtitle}</p></div><button className="play-button" aria-label={`Play ${data.title}`}><ChevronRight size={22} /></button>
  </article>
}

function GameRoom({ game, age, onClose, onReward }: { game: GameId; age: Age; onClose: () => void; onReward: () => void }) {
  const [round, setRound] = useState(0)
  const [complete, setComplete] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [breathing, setBreathing] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const data = games[game]
  const totalRounds = ageSettings[age].rounds
  const SESSION_ROUNDS = totalRounds
  const [sessionRounds] = useState(() => ({
    garden: shuffle(gardenRounds),
    safari: shuffle(safariRounds),
    numbers: shuffle(numberRounds),
    pattern: shuffle(patternRounds),
    story: shuffle(storyRounds),
    memory: shuffle(memoryRounds),
    shape: shuffle(shapeRounds),
    sound: shuffle(soundRounds),
  }))
  const gardenRound = sessionRounds.garden[round]
  const safariRound = sessionRounds.safari[round]
  const numberRound = sessionRounds.numbers[round]
  const patternRound = sessionRounds.pattern[round]
  const storyRound = sessionRounds.story[round]
  const memoryRound = sessionRounds.memory[round]
  const shapeRound = sessionRounds.shape[round]
  const soundRound = sessionRounds.sound[round]

    const choose = (answer: string, correct: boolean) => {
    setSelected(answer)
    if (soundEnabled) playTone(correct ? 660 : 220, correct ? 0.18 : 0.1, correct ? 'triangle' : 'sine')
    if (correct) {
      window.setTimeout(() => {
        if (round >= totalRounds - 1) { setComplete(true); onReward() } else { setRound((value) => value + 1); setSelected(null) }
      }, 500)
    }
  }

  return <div className={`game-room ${data.className}`}>
    <div className="game-room-header"><button className="back-button" onClick={onClose}><X size={20} /> Exit game</button><div className="room-progress"><span style={{ width: `${game === 'doodle' || game === 'coloring' || game === 'voice' || complete ? 100 : (round + 1) / totalRounds * 100}%` }} /></div><span className="mode-pill">{ageSettings[age].label}</span><button className="icon-button" aria-label="Pause"><Pause size={19} /></button></div>
    {!complete && game === 'garden' && <div className="activity-panel garden-panel"><div className="activity-intro"><span className="big-game-icon">🌈</span><p className="eyebrow">COLOR GARDEN · {round + 1} OF {SESSION_ROUNDS}</p><h1>Find the {gardenRound.target.toLowerCase()}.</h1><p>Tap the flower that matches the color.</p></div><div className="color-options">{gardenRound.options.map((color) => <button key={color} className={`color-choice ${selected === color ? 'chosen' : ''}`} style={{ background: color }} onClick={() => choose(color, color === gardenRound.color)} aria-label={`Choose ${gardenRound.target}`} />)}</div></div>}
    {!complete && game === 'safari' && <div className="activity-panel safari-panel"><div className="activity-intro"><span className="big-game-icon safari-emoji">{safariRound.emoji}</span><p className="eyebrow">WORD SAFARI · {round + 1} OF {SESSION_ROUNDS}</p><h1>{safariRound.prompt}</h1><p>Take your time. You are doing great.</p></div><div className="word-options">{safariRound.options.map((word) => <button key={word} className={selected === word ? 'chosen' : ''} onClick={() => choose(word, word === safariRound.answer)}>{word}</button>)}</div></div>}
    {!complete && game === 'numbers' && <div className="activity-panel numbers-panel"><div className="activity-intro"><span className="big-game-icon">🦕</span><p className="eyebrow">DINO MATH · {round + 1} OF {SESSION_ROUNDS}</p><h1>{numberRound.prompt}</h1><p>Use your super brain. Every try is a good try.</p></div><div className="word-options number-options">{numberRound.options.map((answer) => <button key={answer} className={selected === answer ? 'chosen' : ''} onClick={() => choose(answer, answer === numberRound.answer)}>{answer}</button>)}</div></div>}
    {!complete && game === 'pattern' && <div className="activity-panel pattern-panel"><div className="activity-intro"><span className="big-game-icon">🎪</span><p className="eyebrow">PATTERN PARADE · {round + 1} OF {SESSION_ROUNDS}</p><h1>What comes next?</h1><p className="pattern-sequence">{patternRound.sequence}</p></div><div className="word-options pattern-options">{patternRound.options.map((answer) => <button key={answer} className={selected === answer ? 'chosen' : ''} onClick={() => choose(answer, answer === patternRound.answer)}>{answer}</button>)}</div></div>}
    {!complete && game === 'story' && <div className="activity-panel story-panel"><div className="activity-intro"><span className="big-game-icon">🪄</span><p className="eyebrow">STORY SPARK · {round + 1} OF {SESSION_ROUNDS}</p><h1>{storyRound.prompt}</h1><p>There is no wrong story. Pick what feels like you.</p></div><div className="word-options story-options">{storyRound.options.map((answer) => <button key={answer} className={selected === answer ? 'chosen' : ''} onClick={() => choose(answer, answer === storyRound.answer)}>{answer}</button>)}</div></div>}
    {!complete && game === 'memory' && <div className="activity-panel memory-panel"><div className="activity-intro"><span className="big-game-icon">🧠</span><p className="eyebrow">MEMORY MEADOW · {round + 1} OF {SESSION_ROUNDS}</p><h1>{memoryRound.prompt}</h1><p>Take a tiny peek, then trust your memory.</p></div><div className="word-options picture-options">{memoryRound.options.map((answer) => <button key={answer} className={selected === answer ? 'chosen' : ''} onClick={() => choose(answer, answer === memoryRound.answer)}>{answer}</button>)}</div></div>}
    {!complete && game === 'shape' && <div className="activity-panel shape-panel"><div className="activity-intro"><span className="big-game-icon">🔷</span><p className="eyebrow">SHAPE STUDIO · {round + 1} OF {SESSION_ROUNDS}</p><h1>{shapeRound.prompt}</h1><p>Look carefully. Shapes are everywhere.</p></div><div className="word-options shape-options">{shapeRound.options.map((answer) => <button key={answer} className={selected === answer ? 'chosen' : ''} onClick={() => choose(answer, answer === shapeRound.answer)}>{answer}</button>)}</div></div>}
    {!complete && game === 'sound' && <div className="activity-panel sound-panel"><div className="activity-intro"><span className="big-game-icon">🎧</span><p className="eyebrow">SOUND DETECTIVE · {round + 1} OF {SESSION_ROUNDS}</p><h1>{soundRound.prompt}</h1><p>Listen to the words in your head and choose your best match.</p></div><div className="word-options sound-options">{soundRound.options.map((answer) => <button key={answer} className={selected === answer ? 'chosen' : ''} onClick={() => choose(answer, answer === soundRound.answer)}>{answer}</button>)}</div></div>}
    {!complete && game === 'doodle' && <DoodleDance onReward={onReward} soundEnabled={soundEnabled} />}
    {!complete && game === 'coloring' && <ColoringStudio onReward={onReward} soundEnabled={soundEnabled} />}
    {!complete && game === 'voice' && <VoiceLab onReward={onReward} soundEnabled={soundEnabled} />}
    {!complete && isDiscoveryGame(game) && <DiscoveryGame game={game} onReward={onReward} soundEnabled={soundEnabled} />}
    {!complete && game === 'cloud' && <CalmCloud breathing={breathing} setBreathing={setBreathing} soundEnabled={soundEnabled} />}
    {complete && <div className="complete-panel"><div className="complete-sparkle">✦</div><p className="eyebrow">BEAUTIFUL WORK</p><h1>You made it bloom.</h1><p>You found your flow and added <strong>3 stars</strong> to your garden.</p><div className="reward-row"><span>✦</span><span>✦</span><span>✦</span></div><button className="primary-button" onClick={onClose}>Choose another adventure <ChevronRight size={18} /></button></div>}
    <div className="game-room-footer"><button className={`sound-toggle ${soundEnabled ? 'enabled' : ''}`} onClick={() => setSoundEnabled((value) => !value)}><Volume2 size={16} /> {soundEnabled ? 'Sound on' : 'Sound off'}</button><span><Heart size={16} /> No wrong turns here</span></div>
  </div>
}

type Point = { x: number; y: number }

function DoodleDance({ onReward, soundEnabled }: { onReward: () => void; soundEnabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [strokes, setStrokes] = useState<Point[][]>([])
  const [drawing, setDrawing] = useState(false)
  const [dancing, setDancing] = useState(false)
  const rewarded = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    strokes.forEach((stroke, index) => {
      if (stroke.length < 2) return
      context.strokeStyle = ['#e87873', '#5e9f88', '#e4b33d', '#719fc0', '#9a7fc0'][index % 5]
      context.lineWidth = 9
      context.beginPath()
      context.moveTo(stroke[0].x, stroke[0].y)
      stroke.slice(1).forEach((point) => context.lineTo(point.x, point.y))
      context.stroke()
    })
  }, [strokes])

  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const bounds = canvas.getBoundingClientRect()
    return { x: (event.clientX - bounds.left) * canvas.width / bounds.width, y: (event.clientY - bounds.top) * canvas.height / bounds.height }
  }

  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setDrawing(true)
    setDancing(false)
    if (soundEnabled) playTone(340, 0.07, 'sine')
    setStrokes((current) => [...current, [pointFromEvent(event)]])
  }

  const draw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const point = pointFromEvent(event)
    setStrokes((current) => current.map((stroke, index) => index === current.length - 1 ? [...stroke, point] : stroke))
  }

  const finishDrawing = () => setDrawing(false)
  const clearDoodle = () => { setStrokes([]); setDancing(false); rewarded.current = false }
  const makeDance = () => {
    if (strokes.length === 0) return
    setDancing(false)
    window.requestAnimationFrame(() => setDancing(true))
    if (soundEnabled) { playTone(523, 0.12, 'triangle'); window.setTimeout(() => playTone(784, 0.18, 'triangle'), 120) }
    if (!rewarded.current) { rewarded.current = true; onReward() }
  }

  return <div className="activity-panel doodle-panel">
    <div className="activity-intro"><span className="big-game-icon">🖍️</span><p className="eyebrow">DOODLE DANCE · YOUR CANVAS</p><h1>What will your imagination draw?</h1><p>Draw anything you like. Then watch your lines come alive.</p></div>
    <div className="doodle-stage">
      <canvas ref={canvasRef} width="720" height="380" onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={finishDrawing} onPointerCancel={finishDrawing} aria-label="Drawing canvas" />
      {dancing && <div className="dance-badge">✦ Dancing!</div>}
      {dancing && <svg className="doodle-animation" viewBox="0 0 720 380" aria-label="Your doodle is dancing">{strokes.map((stroke, index) => stroke.length > 1 && <g key={`${index}-${stroke.length}`} className="doodle-group"><path className="doodle-glow" d={`M ${stroke.map((point) => `${point.x} ${point.y}`).join(' L ')}`} style={{ stroke: ['#e87873', '#5e9f88', '#e4b33d', '#719fc0', '#9a7fc0'][index % 5] }} /><path className="doodle-path" d={`M ${stroke.map((point) => `${point.x} ${point.y}`).join(' L ')}`} style={{ stroke: ['#e87873', '#5e9f88', '#e4b33d', '#719fc0', '#9a7fc0'][index % 5], animationDelay: `${index * 140}ms` }} /><circle className="dance-spark" cx={stroke[0].x} cy={stroke[0].y} r="8" /><circle className="dance-spark" cx={stroke[stroke.length - 1].x} cy={stroke[stroke.length - 1].y} r="6" /></g>)}</svg>}
      {strokes.length === 0 && <span className="doodle-hint">your canvas is waiting ✦</span>}
    </div>
    <div className="doodle-actions"><button className="secondary-button" onClick={clearDoodle}>Start over</button><button className="primary-button" onClick={makeDance} disabled={strokes.length === 0}>Make it dance <Sparkles size={17} /></button></div>
  </div>
}

type ColoringArt = 'butterfly' | 'rocket' | 'garden'

const coloringArts: { id: ColoringArt; label: string; icon: string }[] = [
  { id: 'butterfly', label: 'Butterfly', icon: '🦋' },
  { id: 'rocket', label: 'Rocket', icon: '🚀' },
  { id: 'garden', label: 'Garden', icon: '🌻' },
]

function ColoringStudio({ onReward, soundEnabled }: { onReward: () => void; soundEnabled: boolean }) {
  const [art, setArt] = useState<ColoringArt>('butterfly')
  const [ownArt, setOwnArt] = useState(false)
  const [color, setColor] = useState('#ef897f')
  const [filled, setFilled] = useState<Record<string, string>>({})
  const [ownStrokes, setOwnStrokes] = useState<Point[][]>([])
  const [drawing, setDrawing] = useState(false)
  const [finished, setFinished] = useState(false)
  const rewarded = useRef(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const palette = ['#ef897f', '#f6c453', '#80b9d8', '#94c9af', '#a893c5', '#f3a66f', '#28433f']

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = 10
    ownStrokes.forEach((stroke, index) => {
      if (stroke.length < 2) return
      context.strokeStyle = palette[index % palette.length]
      context.beginPath()
      context.moveTo(stroke[0].x, stroke[0].y)
      stroke.slice(1).forEach((point) => context.lineTo(point.x, point.y))
      context.stroke()
    })
  }, [ownStrokes])

  const colorRegion = (region: string) => {
    setFilled((current) => ({ ...current, [region]: color }))
    if (soundEnabled) playTone(420 + Object.keys(filled).length * 35, 0.09, 'sine')
  }

  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const bounds = canvas.getBoundingClientRect()
    return { x: (event.clientX - bounds.left) * canvas.width / bounds.width, y: (event.clientY - bounds.top) * canvas.height / bounds.height }
  }

  const startOwnDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setDrawing(true)
    setOwnStrokes((current) => [...current, [pointFromEvent(event)]])
  }
  const drawOwnArt = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const point = pointFromEvent(event)
    setOwnStrokes((current) => current.map((stroke, index) => index === current.length - 1 ? [...stroke, point] : stroke))
  }
  const resetArt = () => { setFilled({}); setOwnStrokes([]); setFinished(false); rewarded.current = false }
  const finishArt = () => { setFinished(true); if (soundEnabled) playTone(660, 0.18, 'triangle'); if (!rewarded.current) { rewarded.current = true; onReward() } }

  return <div className="activity-panel coloring-panel">
    <div className="activity-intro"><span className="big-game-icon">🎨</span><p className="eyebrow">COLORING STUDIO · YOUR ART SPACE</p><h1>Make the world your color.</h1><p>Pick a picture to paint, or make your very own masterpiece.</p></div>
    <div className="art-tabs">{coloringArts.map((item) => <button key={item.id} className={!ownArt && art === item.id ? 'selected' : ''} onClick={() => { setArt(item.id); setOwnArt(false); setFinished(false) }}>{item.icon} {item.label}</button>)}<button className={ownArt ? 'selected' : ''} onClick={() => { setOwnArt(true); setFinished(false) }}>✏️ Create your own</button></div>
    <div className="color-palette" aria-label="Choose a color">{palette.map((swatch) => <button key={swatch} className={color === swatch ? 'active' : ''} style={{ background: swatch }} onClick={() => setColor(swatch)} aria-label={`Choose color ${swatch}`} />)}</div>
    {!ownArt && <ColoringPage art={art} filled={filled} onColor={colorRegion} />}
    {ownArt && <div className="own-art-stage"><canvas ref={canvasRef} width="720" height="350" onPointerDown={startOwnDrawing} onPointerMove={drawOwnArt} onPointerUp={() => setDrawing(false)} onPointerCancel={() => setDrawing(false)} aria-label="Create your own art canvas" />{ownStrokes.length === 0 && <span>Draw your own bright idea here ✦</span>}</div>}
    <div className="doodle-actions"><button className="secondary-button" onClick={resetArt}>Start over</button><button className="primary-button" onClick={finishArt}>{finished ? 'Beautiful!' : 'I love my art'} <Sparkles size={17} /></button></div>
  </div>
}

function ColoringPage({ art, filled, onColor }: { art: ColoringArt; filled: Record<string, string>; onColor: (region: string) => void }) {
  const fill = (region: string) => filled[region] ?? '#fffdf9'
  const outline = { stroke: '#28433f', strokeWidth: 5, strokeLinejoin: 'round' as const }
  return <div className="coloring-canvas"><svg viewBox="0 0 600 350" role="img" aria-label={`${art} coloring page`}>
    {art === 'butterfly' && <g><ellipse {...outline} fill={fill('left-wing')} cx="220" cy="150" rx="90" ry="112" onClick={() => onColor('left-wing')} /><ellipse {...outline} fill={fill('right-wing')} cx="380" cy="150" rx="90" ry="112" onClick={() => onColor('right-wing')} /><ellipse {...outline} fill={fill('top-left')} cx="248" cy="82" rx="40" ry="58" onClick={() => onColor('top-left')} /><ellipse {...outline} fill={fill('top-right')} cx="352" cy="82" rx="40" ry="58" onClick={() => onColor('top-right')} /><rect {...outline} fill={fill('body')} x="280" y="88" width="40" height="145" rx="20" onClick={() => onColor('body')} /><path {...outline} fill="none" d="M295 91 Q260 45 238 55 M305 91 Q340 45 362 55" onClick={() => onColor('body')} /></g>}
    {art === 'rocket' && <g><path {...outline} fill={fill('ship')} d="M300 35 C390 80 410 170 350 260 L300 305 L250 260 C190 170 210 80 300 35Z" onClick={() => onColor('ship')} /><circle {...outline} fill={fill('window')} cx="300" cy="135" r="32" onClick={() => onColor('window')} /><path {...outline} fill={fill('left-fin')} d="M245 220 L180 270 L250 270" onClick={() => onColor('left-fin')} /><path {...outline} fill={fill('right-fin')} d="M355 220 L420 270 L350 270" onClick={() => onColor('right-fin')} /><path {...outline} fill={fill('flame')} d="M275 278 Q300 335 325 278 Q300 300 275 278" onClick={() => onColor('flame')} /></g>}
    {art === 'garden' && <g><path {...outline} fill={fill('sun')} d="M300 60 L315 98 L355 85 L330 120 L365 140 L325 145 L330 188 L300 155 L270 188 L275 145 L235 140 L270 120 L245 85 L285 98Z" onClick={() => onColor('sun')} /><path {...outline} fill={fill('stem')} d="M293 155 L307 155 L307 285 L293 285Z" onClick={() => onColor('stem')} /><ellipse {...outline} fill={fill('leaf-left')} cx="260" cy="230" rx="55" ry="25" transform="rotate(-25 260 230)" onClick={() => onColor('leaf-left')} /><ellipse {...outline} fill={fill('leaf-right')} cx="340" cy="250" rx="55" ry="25" transform="rotate(25 340 250)" onClick={() => onColor('leaf-right')} /><path {...outline} fill={fill('pot')} d="M245 280 L355 280 L335 330 L265 330Z" onClick={() => onColor('pot')} /></g>}
  </svg></div>
}

type VoiceEffect = 'natural' | 'chipmunk' | 'deep' | 'echo' | 'robot' | 'alien' | 'slow'

function VoiceLab({ onReward, soundEnabled }: { onReward: () => void; soundEnabled: boolean }) {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [effect, setEffect] = useState<VoiceEffect>('natural')
  const [message, setMessage] = useState('Tap record and say something wonderful.')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const echoRef = useRef<DelayNode | null>(null)
  const feedbackRef = useRef<GainNode | null>(null)
  const rewarded = useRef(false)

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    void contextRef.current?.close()
  }, [audioUrl])

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        setMessage('Voice recording is not supported in this browser yet.')
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        setAudioUrl((current) => { if (current) URL.revokeObjectURL(current); return URL.createObjectURL(blob) })
        stream.getTracks().forEach((track) => track.stop())
        setMessage('Great recording. Pick a voice style and press play.')
        if (!rewarded.current) { rewarded.current = true; onReward() }
      }
      recorder.start()
      setRecording(true)
      setMessage('Listening... tell us your best story voice!')
      if (soundEnabled) playTone(520, 0.1, 'triangle')
    } catch {
      setMessage('Microphone permission was not available. You can try again.')
    }
  }

  const stopRecording = () => {
    recorderRef.current?.stop()
    setRecording(false)
    if (soundEnabled) playTone(330, 0.12, 'triangle')
  }

  const applyEffect = async (nextEffect: VoiceEffect) => {
    setEffect(nextEffect)
    const audio = audioRef.current
    if (!audio || !audioUrl) return
    audio.pause()
    audio.currentTime = 0
    audio.playbackRate = nextEffect === 'chipmunk' ? 1.45 : nextEffect === 'deep' ? 0.72 : nextEffect === 'alien' ? 1.85 : nextEffect === 'slow' ? 0.55 : 1
    if (nextEffect === 'echo' || nextEffect === 'robot') {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass && !contextRef.current) {
        const context = new AudioContextClass()
        const source = context.createMediaElementSource(audio)
        const delay = context.createDelay(1)
        const feedback = context.createGain()
        source.connect(context.destination)
        source.connect(delay)
        delay.connect(feedback)
        feedback.connect(delay)
        delay.connect(context.destination)
        delay.delayTime.value = nextEffect === 'robot' ? 0.06 : 0.26
        feedback.gain.value = nextEffect === 'robot' ? 0.62 : 0.34
        contextRef.current = context
        sourceRef.current = source
        echoRef.current = delay
        feedbackRef.current = feedback
      }
      if (feedbackRef.current) feedbackRef.current.gain.value = nextEffect === 'robot' ? 0.62 : 0.34
      if (contextRef.current?.state === 'suspended') await contextRef.current.resume()
    } else if (feedbackRef.current) {
      feedbackRef.current.gain.value = 0
    }
    await audio.play()
  }

  const effectLabels: { id: VoiceEffect; label: string; icon: string }[] = [
    { id: 'natural', label: 'Natural', icon: '🙂' },
    { id: 'chipmunk', label: 'Squeaky', icon: '🐿️' },
    { id: 'deep', label: 'Giant', icon: '🦁' },
    { id: 'echo', label: 'Echo cave', icon: '🏔️' },
    { id: 'robot', label: 'Robot', icon: '🤖' },
    { id: 'alien', label: 'Alien', icon: '👽' },
    { id: 'slow', label: 'Slow-Mo', icon: '🐢' },
  ]

  return <div className="activity-panel voice-panel">
    <div className="activity-intro"><span className="big-game-icon">🎙️</span><p className="eyebrow">VOICE LAB · YOUR SOUND STUDIO</p><h1>Give your voice a little magic.</h1><p>Record a message, then try a playful new voice.</p></div>
    <div className={`voice-orb ${recording ? 'recording' : ''}`}><span>{recording ? '●' : '🎙️'}</span></div>
    <p className="voice-message">{message}</p>
    <div className="voice-actions"><button className={`primary-button record-button ${recording ? 'recording-button' : ''}`} onClick={recording ? stopRecording : startRecording}>{recording ? 'Stop recording' : audioUrl ? 'Record again' : 'Start recording'}</button>{audioUrl && <audio ref={audioRef} src={audioUrl} controls aria-label="Your recorded voice" />}</div>
    {audioUrl && <div className="voice-effects"><p className="eyebrow">TRY A NEW VOICE</p><div className="effect-grid">{effectLabels.map((item) => <button key={item.id} className={effect === item.id ? 'selected' : ''} onClick={() => void applyEffect(item.id)}><span>{item.icon}</span><small>{item.label}</small></button>)}</div></div>}
    <button className="secondary-button voice-clear" onClick={() => { setAudioUrl(null); setMessage('Tap record and say something wonderful.'); setEffect('natural'); rewarded.current = false }}>Clear recording</button>
  </div>
}

type DiscoveryGameId = 'difference' | 'grid' | 'missing' | 'maze' | 'codecolor' | 'rebus' | 'shadow' | 'oddone' | 'decode' | 'crossword'
type DiscoveryRound = { prompt: string; board: string; options: string[]; answer: string }
const discoveryGameIds: DiscoveryGameId[] = ['difference', 'grid', 'missing', 'maze', 'codecolor', 'rebus', 'shadow', 'oddone', 'decode', 'crossword']
const isDiscoveryGame = (game: GameId): game is DiscoveryGameId => discoveryGameIds.includes(game as DiscoveryGameId)

const discoveryRounds: Record<DiscoveryGameId, DiscoveryRound[]> = {
  difference: [
    { prompt: 'Which detail changed?', board: '🌳 🌸 🐝 ☀️  →  🌳 🌸 🦋 ☀️', options: ['The tree', 'The bug', 'The sun'], answer: 'The bug' },
    { prompt: 'Look closely. What is different?', board: '🐰 🥕 🌼 ⭐  →  🐰 🍎 🌼 ⭐', options: ['The snack', 'The flower', 'The star'], answer: 'The snack' },
    { prompt: 'Which picture changed?', board: '🚀 🌙 ⭐ 🪐  →  🚀 ☀️ ⭐ 🪐', options: ['The middle sky', 'The rocket', 'The planet'], answer: 'The middle sky' },
    { prompt: 'Spot the tiny change.', board: '🍎 🍐 🍊 🍋  →  🍎 🍐 🍉 🍋', options: ['Third fruit', 'First fruit', 'Last fruit'], answer: 'Third fruit' },
    { prompt: 'Can you catch the change?', board: '🐳 🌊 🐚 ⭐  →  🐳 🌊 🦀 ⭐', options: ['The shell friend', 'The whale', 'The star'], answer: 'The shell friend' },
    { prompt: 'Which detail is new?', board: '🎈 🎁 🎂 🎉  →  🎈 🎁 🧁 🎉', options: ['The cake', 'The gift', 'The balloon'], answer: 'The cake' },
    { prompt: 'What changed places?', board: '🐝 🌼 🍃 ☀️  →  🐝 🌼 ☀️ ☀️', options: ['The leaf', 'The flower', 'The bee'], answer: 'The leaf' },
    { prompt: 'Find the different picture.', board: '🦊 🌲 🌙 🦊  →  🦊 🌲 ⭐ 🦊', options: ['The sky symbol', 'The fox', 'The tree'], answer: 'The sky symbol' },
  ],
  grid: [
    { prompt: 'Find the hidden animal name.', board: 'C A T · S U N · F I S H · B E E', options: ['FISH', 'SUN', 'BEE'], answer: 'FISH' },
    { prompt: 'Which name is hiding in the grid?', board: 'M O O N · T R E E · B I R D · F O X', options: ['MOON', 'BIRD', 'FOX'], answer: 'TREE' },
    { prompt: 'Find the food word.', board: 'C A K E · R A I N · P I Z Z A · S E A', options: ['RAIN', 'CAKE', 'SEA'], answer: 'PIZZA' },
    { prompt: 'Find the nature word.', board: 'R O C K · L E A F · S T A R · W I N D', options: ['ROCK', 'STAR', 'WIND'], answer: 'LEAF' },
    { prompt: 'Find the animal hiding in the grid.', board: 'B E A R · R A I N · F O X · T R E E', options: ['BEAR', 'RAIN', 'TREE'], answer: 'FOX' },
    { prompt: 'Which color word is hiding?', board: 'B L U E · S U N · P I N K · M O O N', options: ['SUN', 'BLUE', 'MOON'], answer: 'PINK' },
    { prompt: 'Find the action word.', board: 'J U M P · S L E E P · R U N · S M I L E', options: ['JUMP', 'RUN', 'SMILE'], answer: 'SLEEP' },
    { prompt: 'Find the place word.', board: 'P A R K · H O M E · S E A · T R E E', options: ['TREE', 'PARK', 'SEA'], answer: 'HOME' },
  ],
  missing: [
    { prompt: 'What is missing from the picnic?', board: '🧺 🍎 🥪  ❓  🧃', options: ['🍪', '🚲', '🌙'], answer: '🍪' },
    { prompt: 'Which friend disappeared?', board: '🐶 🐱  ❓  🐸 🐰', options: ['🐻', '🐵', '🦊'], answer: '🦊' },
    { prompt: 'What belongs in the sky?', board: '🌳 🌷  ❓  🪨 🌿', options: ['☁️', '🥕', '🐢'], answer: '☁️' },
    { prompt: 'Which toy is missing?', board: '🧸 🚂  ❓  🪁 🎈', options: ['🧩', '🍌', '🌧️'], answer: '🧩' },
    { prompt: 'What is missing from the beach?', board: '🏖️ 🐚 🕶️  ❓  🌊', options: ['🪣', '🦕', '🎩'], answer: '🪣' },
    { prompt: 'Which animal is missing?', board: '🦁 🐯  ❓  🐼 🐨', options: ['🐘', '🐸', '🐟'], answer: '🐘' },
    { prompt: 'What belongs in the art box?', board: '🖍️ ✂️  ❓  🖌️ 📒', options: ['🎨', '🍪', '🧦'], answer: '🎨' },
    { prompt: 'Which fruit is missing?', board: '🍎 🍌  ❓  🍇 🍊', options: ['🍓', '🥕', '🌽'], answer: '🍓' },
  ],
  maze: [
    { prompt: 'Choose the path that reaches the moon.', board: 'START → ⭐ → 🌙', options: ['A: ⭐ → 🌙', 'B: ⭐ → 🪨', 'C: 🌧️ → 🪨'], answer: 'A: ⭐ → 🌙' },
    { prompt: 'Help the bee find the flower.', board: 'BEE → 🌿 → 🌼', options: ['A: 🌿 → 🌼', 'B: 🌊 → 🪨', 'C: 🌙 → ☁️'], answer: 'A: 🌿 → 🌼' },
    { prompt: 'Guide the boat to the island.', board: 'BOAT → 🌊 → 🏝️', options: ['A: 🌊 → 🏝️', 'B: 🔥 → 🏠', 'C: 🌵 → 🌋'], answer: 'A: 🌊 → 🏝️' },
    { prompt: 'Which path leads home?', board: '🐰 → 🌼 → 🏠', options: ['A: 🌼 → 🏠', 'B: 🪐 → 🌙', 'C: 🧊 → 🐳'], answer: 'A: 🌼 → 🏠' },
    { prompt: 'Help the star reach its cloud.', board: '⭐ → 🌈 → ☁️', options: ['A: 🌈 → ☁️', 'B: 🔥 → 🪨', 'C: 🌊 → 🐟'], answer: 'A: 🌈 → ☁️' },
    { prompt: 'Guide the fox to the den.', board: '🦊 → 🌲 → 🏡', options: ['A: 🌲 → 🏡', 'B: 🌙 → 🪐', 'C: 🌊 → 🚢'], answer: 'A: 🌲 → 🏡' },
    { prompt: 'Which path reaches the treasure?', board: '🗺️ → 🌴 → 💎', options: ['A: 🌴 → 💎', 'B: 🧊 → ☁️', 'C: 🐝 → 🌼'], answer: 'A: 🌴 → 💎' },
    { prompt: 'Lead the duck to the pond.', board: '🦆 → 🌱 → 🫧', options: ['A: 🌱 → 🫧', 'B: 🔥 → 🌋', 'C: ⭐ → 🚀'], answer: 'A: 🌱 → 🫧' },
  ],
  codecolor: [
    { prompt: 'Code: circle = blue. What color is the circle?', board: '○  △  □', options: ['Blue', 'Yellow', 'Pink'], answer: 'Blue' },
    { prompt: 'Code: star = gold. Paint the star!', board: '★  ♥  ◆', options: ['Gold', 'Mint', 'Coral'], answer: 'Gold' },
    { prompt: 'Code: triangle = green. Which color clue?', board: '△  ○  ☆', options: ['Green', 'Sky blue', 'Lilac'], answer: 'Green' },
    { prompt: 'Code: heart = coral. Choose its color.', board: '♥  ◇  ☀️', options: ['Coral', 'Ocean blue', 'Cream'], answer: 'Coral' },
    { prompt: 'Code: diamond = lilac. Paint it!', board: '◇  ○  △', options: ['Lilac', 'Lemon', 'Mint'], answer: 'Lilac' },
    { prompt: 'Code: sun = yellow. Follow the code.', board: '☀️  ★  ♥', options: ['Yellow', 'Coral', 'Sky blue'], answer: 'Yellow' },
    { prompt: 'Code: square = mint. Which color?', board: '□  ○  ☆', options: ['Mint', 'Pink', 'Orange'], answer: 'Mint' },
    { prompt: 'Code: moon = sky blue. Choose carefully.', board: '🌙  ☁️  ⭐', options: ['Sky blue', 'Gold', 'Green'], answer: 'Sky blue' },
  ],
  rebus: [
    { prompt: 'Solve the picture clue.', board: '🌧️ + ☂️ = ?', options: ['Rainy day', 'Hot sun', 'Snow ball'], answer: 'Rainy day' },
    { prompt: 'What word do these pictures make?', board: '🐝 + 🍃 = ?', options: ['Bee leaf', 'Believe', 'Blue tree'], answer: 'Believe' },
    { prompt: 'Read the rebus.', board: '⭐ + 🐟 = ?', options: ['Starfish', 'Moon fish', 'Fish bowl'], answer: 'Starfish' },
    { prompt: 'What is the picture phrase?', board: '🌞 + 🌼 = ?', options: ['Sunflower', 'Sunshine', 'Yellow day'], answer: 'Sunflower' },
    { prompt: 'Solve this picture clue.', board: '🦋 + 🧁 = ?', options: ['Butter cake', 'Cupcake', 'Flying cake'], answer: 'Butter cake' },
    { prompt: 'What phrase do you see?', board: '🌧️ + 🎩 = ?', options: ['Rain hat', 'Raincoat', 'Storm hat'], answer: 'Rain hat' },
    { prompt: 'Read the picture words.', board: '🐴 + 👞 = ?', options: ['Horseshoe', 'Horse foot', 'Shoe horse'], answer: 'Horseshoe' },
    { prompt: 'What do these make together?', board: '🌟 + 💡 = ?', options: ['Bright idea', 'Star light', 'Idea star'], answer: 'Bright idea' },
  ],
  shadow: [
    { prompt: 'Which object makes this shadow?', board: 'Shadow: ◼︎  ·  Picture: ?', options: ['🌳', '☀️', '🐟'], answer: '🌳' },
    { prompt: 'Match the silhouette.', board: 'Shadow: ◇  ·  Picture: ?', options: ['🔷', '🌈', '🌻'], answer: '🔷' },
    { prompt: 'Who owns this shadow?', board: 'Shadow: 🐾  ·  Picture: ?', options: ['🐶', '🚀', '🍎'], answer: '🐶' },
    { prompt: 'Which picture fits the outline?', board: 'Shadow: ◯  ·  Picture: ?', options: ['🌙', '🦋', '🧁'], answer: '🌙' },
    { prompt: 'Which object makes this shadow?', board: 'Shadow: ♡  ·  Picture: ?', options: ['❤️', '🍎', '🎈'], answer: '❤️' },
    { prompt: 'Match the dark shape.', board: 'Shadow: ★  ·  Picture: ?', options: ['⭐', '🌻', '☁️'], answer: '⭐' },
    { prompt: 'Who makes this silhouette?', board: 'Shadow: 🪽  ·  Picture: ?', options: ['🦋', '🚲', '🍪'], answer: '🦋' },
    { prompt: 'Which picture matches the shadow?', board: 'Shadow: 🥕  ·  Picture: ?', options: ['🥕', '🌽', '🍌'], answer: '🥕' },
  ],
  oddone: [
    { prompt: 'Which one does not belong?', board: '🍎  🍐  🍌  🚲', options: ['🍎', '🍌', '🚲'], answer: '🚲' },
    { prompt: 'Find the odd one out.', board: '🐶  🐱  🐰  🌳', options: ['🐶', '🐰', '🌳'], answer: '🌳' },
    { prompt: 'Which one is different?', board: '🔵  🔵  🔵  🔺', options: ['First blue', 'Last triangle', 'Middle blue'], answer: 'Last triangle' },
    { prompt: 'Which does not match the group?', board: '☀️  ⭐  🌙  🥕', options: ['☀️', '🌙', '🥕'], answer: '🥕' },
    { prompt: 'Spot the odd one out.', board: '🔺  🔺  🔵  🔺', options: ['First triangle', 'The circle', 'Last triangle'], answer: 'The circle' },
    { prompt: 'Which one is not a fruit?', board: '🍎  🍓  🥕  🍌', options: ['🍎', '🥕', '🍌'], answer: '🥕' },
    { prompt: 'Which one does not fly?', board: '🐦  🦋  🐢  🦅', options: ['🐦', '🐢', '🦅'], answer: '🐢' },
    { prompt: 'Find the different weather sign.', board: '☀️  ☀️  ☀️  ❄️', options: ['First sun', 'Last snow', 'Middle sun'], answer: 'Last snow' },
  ],
  decode: [
    { prompt: 'Decode the mixed-up word.', board: 'T A C  →  ?', options: ['CAT', 'TAC', 'ACT'], answer: 'CAT' },
    { prompt: 'Unlock the letters.', board: 'N U S  →  ?', options: ['SUN', 'NUS', 'SNU'], answer: 'SUN' },
    { prompt: 'Can you decode this?', board: 'R A E B  →  ?', options: ['BEAR', 'BARE', 'BEER'], answer: 'BEAR' },
    { prompt: 'Put the letters in order.', board: 'E R T E  →  ?', options: ['TREE', 'TEER', 'TREEE'], answer: 'TREE' },
    { prompt: 'Decode the animal.', board: 'G O F  →  ?', options: ['FOG', 'DOG', 'GOT'], answer: 'DOG' },
    { prompt: 'Unlock this word.', board: 'H S I F  →  ?', options: ['FISH', 'HIFS', 'SHIP'], answer: 'FISH' },
    { prompt: 'Can you solve the letters?', board: 'O M H E  →  ?', options: ['HOME', 'HOMO', 'HOPE'], answer: 'HOME' },
    { prompt: 'Put this food word right.', board: 'E K A C  →  ?', options: ['CAKE', 'CAVE', 'KACE'], answer: 'CAKE' },
  ],
  crossword: [
    { prompt: 'Mini crossword clue: It shines in the day.', board: '□ □ □', options: ['SUN', 'MOON', 'RAIN'], answer: 'SUN' },
    { prompt: 'Mini crossword clue: You wear it on your head.', board: '□ □ □', options: ['HAT', 'SHOE', 'CUP'], answer: 'HAT' },
    { prompt: 'Mini crossword clue: It says meow.', board: '□ □ □', options: ['DOG', 'CAT', 'COW'], answer: 'CAT' },
    { prompt: 'Mini crossword clue: It flies and has wings.', board: '□ □ □', options: ['FISH', 'BIRD', 'TREE'], answer: 'BIRD' },
    { prompt: 'Mini crossword clue: It is bright at night.', board: '□ □ □', options: ['SUN', 'MOON', 'CLOUD'], answer: 'MOON' },
    { prompt: 'Mini crossword clue: It grows in a garden.', board: '□ □ □', options: ['FLOWER', 'SPOON', 'SHOE'], answer: 'FLOWER' },
    { prompt: 'Mini crossword clue: You use it to write.', board: '□ □ □', options: ['PENCIL', 'PLATE', 'PILLOW'], answer: 'PENCIL' },
    { prompt: 'Mini crossword clue: It swims in water.', board: '□ □ □', options: ['FISH', 'FROG', 'FOX'], answer: 'FISH' },
  ],
}

function DiscoveryGame({ game, onReward, soundEnabled }: { game: DiscoveryGameId; onReward: () => void; soundEnabled: boolean }) {
  const [round, setRound] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [complete, setComplete] = useState(false)
  const [crosswordLetters, setCrosswordLetters] = useState<string[]>([])
  const [rounds] = useState(() => shuffle(discoveryRounds[game]))
  const current = rounds[round % rounds.length]
  const isCrossword = game === 'crossword'
  const givenIndexes = isCrossword ? current.answer.split('').map((_, index) => index % 2 === 0) : []

  useEffect(() => {
    if (isCrossword) setCrosswordLetters(current.answer.split('').map((letter, index) => givenIndexes[index] ? letter : ''))
  }, [current.answer, isCrossword])

  const choose = (answer: string) => {
    setSelected(answer)
    const correct = answer === current.answer
    if (soundEnabled) playTone(correct ? 660 : 220, correct ? .18 : .1, correct ? 'triangle' : 'sine')
    if (correct) window.setTimeout(() => { if (round >= 2) { setComplete(true); onReward() } else { setRound((value) => value + 1); setSelected(null) } }, 450)
  }
  const chooseCrosswordLetter = (letter: string) => {
    const nextIndex = crosswordLetters.findIndex((value, index) => !value && !givenIndexes[index])
    if (nextIndex < 0) return
    const nextLetters = crosswordLetters.map((value, index) => index === nextIndex ? letter : value)
    setCrosswordLetters(nextLetters)
    if (soundEnabled) playTone(520 + nextIndex * 18, 0.07, 'sine')
    if (nextLetters.every(Boolean)) {
      const correct = nextLetters.join('') === current.answer
      if (soundEnabled) playTone(correct ? 720 : 220, correct ? .18 : .1, correct ? 'triangle' : 'sine')
      if (correct) window.setTimeout(() => { if (round >= 2) { setComplete(true); onReward() } else { setRound((value) => value + 1) } }, 500)
    }
  }
  const eraseCrosswordLetter = () => {
    const eraseIndex = [...crosswordLetters].map((value, index) => ({ value, index })).reverse().find(({ value, index }) => value && !givenIndexes[index])?.index
    if (eraseIndex === undefined) return
    setCrosswordLetters((letters) => letters.map((value, index) => index === eraseIndex ? '' : value))
  }
  const crosswordChoices = isCrossword ? shuffle(Array.from(new Set([...current.answer.split(''), 'A', 'E', 'I', 'O', 'R', 'T', 'S']))) : []
  if (complete) return <div className="activity-panel discovery-panel"><div className="complete-sparkle">✦</div><p className="eyebrow">BRILLIANT DETECTIVE WORK</p><h1>You solved the mystery.</h1><p>You found the clues and added <strong>3 stars</strong> to your garden.</p></div>
  return <div className="activity-panel discovery-panel"><div className="activity-intro"><span className="big-game-icon">{games[game].icon}</span><p className="eyebrow">{games[game].title.toUpperCase()} · {round + 1} OF 3</p><h1>{current.prompt}</h1></div>{isCrossword ? <div className="crossword-builder"><div className="crossword-clue-board">{current.board}</div><div className="letter-boxes">{crosswordLetters.map((letter, index) => <span key={`${current.answer}-${index}`} className={givenIndexes[index] ? 'given' : letter ? 'filled' : ''}>{letter || '?'}</span>)}</div><p className="crossword-hint">Fill the missing letters to solve the clue.</p><div className="letter-bank">{crosswordChoices.map((letter) => <button key={letter} onClick={() => chooseCrosswordLetter(letter)}>{letter}</button>)}<button className="erase-letter" onClick={eraseCrosswordLetter} aria-label="Erase last letter">⌫</button></div></div> : <><div className={`discovery-board discovery-${game}`}>{current.board}</div><div className="word-options discovery-options">{current.options.map((option) => <button key={option} className={selected === option ? 'chosen' : ''} onClick={() => choose(option)}>{option}</button>)}</div></>}</div>
}

function CalmCloud({ breathing, setBreathing, soundEnabled }: { breathing: boolean; setBreathing: (value: boolean) => void; soundEnabled: boolean }) {
  const [breathCount, setBreathCount] = useState(0)
  useEffect(() => { if (!breathing) return; const timer = window.setInterval(() => setBreathCount((value) => Math.min(value + 1, 3)), 4000); return () => window.clearInterval(timer) }, [breathing])
  useEffect(() => { if (breathCount >= 3) setBreathing(false) }, [breathCount, setBreathing])
  return <div className="activity-panel calm-panel"><div className="activity-intro"><span className="big-game-icon">☁️</span><p className="eyebrow">CALM CLOUD · A QUIET MOMENT</p><h1>Let your thoughts float by.</h1><p>Follow the cloud. In, and out. Just like that.</p></div><button className={`breath-orb ${breathing ? 'is-breathing' : ''}`} onClick={() => { setBreathing(true); if (soundEnabled) playTone(390, 0.25, 'sine') }}><span>{breathing ? (breathCount % 2 === 0 ? 'breathe in' : 'breathe out') : breathCount >= 3 ? 'lovely' : 'tap to begin'}</span></button><div className="breath-dots">{[0, 1, 2].map((item) => <i key={item} className={item < breathCount ? 'filled' : ''} />)}</div></div>
}

const appWindow = window as Window & { __wonderSproutRoot?: ReturnType<typeof createRoot> }
const appRoot = appWindow.__wonderSproutRoot ?? createRoot(document.getElementById('root')!)
appWindow.__wonderSproutRoot = appRoot
appRoot.render(<App />)

export default App
