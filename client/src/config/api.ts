// API configuration and demo data for offline presentation mode

export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export type QuizData = {
  question: string
  options: string[]
  correctIndex: number
}

export type SubTopic = {
  label: string
  funFact: string
  quiz: QuizData | null
}

type DemoTopicData = {
  subTopics: SubTopic[]
  funFact?: string
}

// Pre-cached responses for demo mode (hackathon-safe offline presentation)
export const DEMO_DATA: Record<string, DemoTopicData> = {
  'The Universe': {
    funFact: 'The observable universe is about 93 billion light-years in diameter, but the entire universe could be infinite!',
    subTopics: [
      {
        label: 'Galaxies',
        funFact: 'There are approximately 2 trillion galaxies in the observable universe, each containing billions of stars!',
        quiz: {
          question: 'How many galaxies are estimated to exist in the observable universe?',
          options: ['About 100 million', 'About 2 billion', 'About 100 billion', 'About 2 trillion'],
          correctIndex: 3,
        },
      },
      {
        label: 'Dark Matter',
        funFact: 'Dark matter makes up about 27% of the universe, yet we cannot see it directly - we only detect it through gravity!',
        quiz: {
          question: 'What percentage of the universe is made up of dark matter?',
          options: ['5%', '15%', '27%', '68%'],
          correctIndex: 2,
        },
      },
      {
        label: 'Big Bang Theory',
        funFact: 'The Big Bang created all space, time, matter, and energy in the universe from an infinitely dense point!',
        quiz: {
          question: 'How long ago did the Big Bang occur?',
          options: ['6.8 billion years', '10.2 billion years', '13.8 billion years', '20.5 billion years'],
          correctIndex: 2,
        },
      },
      {
        label: 'Cosmic Microwave Background',
        funFact: 'The CMB is the oldest light in the universe, traveling for 13.8 billion years to reach us today!',
        quiz: {
          question: 'What is the temperature of the Cosmic Microwave Background?',
          options: ['2.7 Kelvin', '10 Kelvin', '100 Kelvin', '273 Kelvin'],
          correctIndex: 0,
        },
      },
    ],
  },
  Galaxies: {
    subTopics: [
      {
        label: 'Spiral Galaxies',
        funFact: 'Spiral galaxies like the Milky Way have beautiful pinwheel shapes created by rotating arms of stars, gas, and dust!',
        quiz: {
          question: 'What type of galaxy is the Milky Way?',
          options: ['Elliptical', 'Irregular', 'Spiral', 'Lenticular'],
          correctIndex: 2,
        },
      },
      {
        label: 'Elliptical Galaxies',
        funFact: 'Elliptical galaxies are the largest galaxies in the universe and can contain trillions of stars!',
        quiz: {
          question: 'What shape are elliptical galaxies?',
          options: ['Disk-shaped', 'Spherical or oval', 'Irregular', 'Ring-shaped'],
          correctIndex: 1,
        },
      },
      {
        label: 'Galaxy Clusters',
        funFact: 'Galaxy clusters are the largest structures in the universe held together by gravity, containing thousands of galaxies!',
        quiz: {
          question: 'What is the name of our local galaxy cluster?',
          options: ['Virgo Cluster', 'Coma Cluster', 'Local Group', 'Hercules Cluster'],
          correctIndex: 2,
        },
      },
      {
        label: 'Supermassive Black Holes',
        funFact: 'Every large galaxy has a supermassive black hole at its center, some with masses billions of times our Sun!',
        quiz: {
          question: 'Where are supermassive black holes typically found?',
          options: ['In spiral arms', 'At galaxy centers', 'Between galaxies', 'In globular clusters'],
          correctIndex: 1,
        },
      },
    ],
    funFact: 'Galaxies can collide and merge, but the stars within them rarely collide because of the vast distances between them.',
  },
  'Dark Matter': {
    subTopics: [
      {
        label: 'WIMPs',
        funFact: 'WIMPs (Weakly Interacting Massive Particles) are the leading candidates for dark matter particles!',
        quiz: {
          question: 'What does WIMP stand for?',
          options: [
            'Weakly Interacting Massive Particles',
            'Widely Infinite Matter Particles',
            'Weighted Inactive Mass Particles',
            'Weakly Illuminated Molecular Particles',
          ],
          correctIndex: 0,
        },
      },
      {
        label: 'Gravitational Lensing',
        funFact: 'Gravitational lensing bends light around massive objects, allowing us to "see" invisible dark matter!',
        quiz: {
          question: 'How does dark matter reveal itself through gravitational lensing?',
          options: [
            'It absorbs light',
            'It bends light from distant objects',
            'It emits infrared radiation',
            'It reflects radio waves',
          ],
          correctIndex: 1,
        },
      },
      {
        label: 'Dark Matter Halos',
        funFact: 'Dark matter halos extend far beyond visible galaxies, like invisible cosmic cocoons!',
        quiz: {
          question: 'What do dark matter halos surround?',
          options: ['Individual stars', 'Planets', 'Galaxies', 'Black holes only'],
          correctIndex: 2,
        },
      },
      {
        label: 'Detection Experiments',
        funFact: 'Dark matter detectors are placed deep underground to shield them from cosmic rays!',
        quiz: {
          question: 'What type of facility is used to detect dark matter particles?',
          options: ['Space telescopes', 'Underground detectors', 'Radio observatories', 'Particle accelerators only'],
          correctIndex: 1,
        },
      },
    ],
    funFact: 'Dark matter makes up 27% of the universe but has never been directly observed - we only know it exists through its gravitational effects!',
  },
  'Milky Way': {
    subTopics: [
      {
        label: 'Galactic Center',
        funFact: 'At the center of the Milky Way lies Sagittarius A*, a supermassive black hole 4 million times the mass of our Sun!',
        quiz: null,
      },
      {
        label: 'Spiral Arms',
        funFact: 'Our solar system is located in the Orion Arm, a minor spiral arm between the Sagittarius and Perseus arms!',
        quiz: null,
      },
      {
        label: 'Stellar Populations',
        funFact: 'The Milky Way creates about 3 new stars every year and contains stars older than 13 billion years!',
        quiz: null,
      },
      {
        label: 'Galactic Halo',
        funFact: 'The Milky Way\'s halo contains ancient globular clusters with some of the oldest stars in the universe!',
        quiz: null,
      },
    ],
    funFact: 'The Milky Way contains 100-400 billion stars and our solar system takes about 225-250 million years to complete one orbit!',
  },
  Andromeda: {
    subTopics: [
      {
        label: 'M31 Structure',
        funFact: 'Andromeda is the largest galaxy in our Local Group, containing about 1 trillion stars!',
        quiz: null,
      },
      {
        label: 'Andromeda-Milky Way Collision',
        funFact: 'In 4.5 billion years, Andromeda and the Milky Way will merge to form "Milkomeda" or "Milkdromeda"!',
        quiz: null,
      },
      {
        label: 'Satellite Galaxies',
        funFact: 'Andromeda has about 20 known satellite galaxies orbiting around it, including M32 and M110!',
        quiz: null,
      },
      {
        label: 'Star Formation Regions',
        funFact: 'Andromeda\'s star formation rate is about 1 solar mass per year, similar to the Milky Way!',
        quiz: null,
      },
    ],
    funFact: 'The Andromeda Galaxy is on a collision course with the Milky Way - they will merge in about 4.5 billion years!',
  },
  WIMPs: {
    subTopics: [
      {
        label: 'Neutralinos',
        funFact: 'Neutralinos are theoretical supersymmetric particles that could be the elusive WIMPs!',
        quiz: null,
      },
      {
        label: 'Detection Methods',
        funFact: 'Scientists use cryogenic detectors cooled to near absolute zero to search for WIMP interactions!',
        quiz: null,
      },
      {
        label: 'Mass Estimates',
        funFact: 'WIMPs are theorized to have masses between 10 and 10,000 times that of a proton!',
        quiz: null,
      },
      {
        label: 'Theoretical Predictions',
        funFact: 'The "WIMP miracle" suggests that WIMPs naturally produce the right amount of dark matter!',
        quiz: null,
      },
    ],
    funFact: 'WIMPs could be passing through your body right now at a rate of millions per second, but they interact so weakly that you would never notice!',
  },
  'Gravitational Lensing': {
    subTopics: [
      {
        label: 'Einstein Rings',
        funFact: 'When a distant light source perfectly aligns behind a massive object, it creates a complete ring of light!',
        quiz: null,
      },
      {
        label: 'Weak Lensing',
        funFact: 'Weak lensing slightly distorts the shapes of distant galaxies, helping map dark matter distribution!',
        quiz: null,
      },
      {
        label: 'Microlensing',
        funFact: 'Microlensing has been used to discover exoplanets by detecting the brightening of background stars!',
        quiz: null,
      },
      {
        label: 'Mass Mapping',
        funFact: 'Scientists use gravitational lensing to create invisible "mass maps" of the universe!',
        quiz: null,
      },
    ],
    funFact: 'Gravitational lensing was predicted by Einstein in 1915 and first observed during a solar eclipse in 1919, proving general relativity!',
  },
}
