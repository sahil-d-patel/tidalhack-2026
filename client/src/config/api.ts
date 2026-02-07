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
  quiz: QuizData | null
}

type DemoTopicData = {
  subTopics: SubTopic[]
  funFact: string
}

// Pre-cached responses for demo mode (hackathon-safe offline presentation)
export const DEMO_DATA: Record<string, DemoTopicData> = {
  'The Universe': {
    subTopics: [
      {
        label: 'Galaxies',
        quiz: {
          question: 'How many galaxies are estimated to exist in the observable universe?',
          options: ['About 100 million', 'About 2 billion', 'About 100 billion', 'About 2 trillion'],
          correctIndex: 3,
        },
      },
      {
        label: 'Dark Matter',
        quiz: {
          question: 'What percentage of the universe is made up of dark matter?',
          options: ['5%', '15%', '27%', '68%'],
          correctIndex: 2,
        },
      },
      {
        label: 'Big Bang Theory',
        quiz: {
          question: 'How long ago did the Big Bang occur?',
          options: ['6.8 billion years', '10.2 billion years', '13.8 billion years', '20.5 billion years'],
          correctIndex: 2,
        },
      },
      {
        label: 'Cosmic Microwave Background',
        quiz: {
          question: 'What is the temperature of the Cosmic Microwave Background?',
          options: ['2.7 Kelvin', '10 Kelvin', '100 Kelvin', '273 Kelvin'],
          correctIndex: 0,
        },
      },
    ],
    funFact: 'The observable universe is about 93 billion light-years in diameter, but the entire universe could be infinite!',
  },
  Galaxies: {
    subTopics: [
      {
        label: 'Spiral Galaxies',
        quiz: {
          question: 'What type of galaxy is the Milky Way?',
          options: ['Elliptical', 'Irregular', 'Spiral', 'Lenticular'],
          correctIndex: 2,
        },
      },
      {
        label: 'Elliptical Galaxies',
        quiz: {
          question: 'What shape are elliptical galaxies?',
          options: ['Disk-shaped', 'Spherical or oval', 'Irregular', 'Ring-shaped'],
          correctIndex: 1,
        },
      },
      {
        label: 'Galaxy Clusters',
        quiz: {
          question: 'What is the name of our local galaxy cluster?',
          options: ['Virgo Cluster', 'Coma Cluster', 'Local Group', 'Hercules Cluster'],
          correctIndex: 2,
        },
      },
      {
        label: 'Supermassive Black Holes',
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
        quiz: {
          question: 'What do dark matter halos surround?',
          options: ['Individual stars', 'Planets', 'Galaxies', 'Black holes only'],
          correctIndex: 2,
        },
      },
      {
        label: 'Detection Experiments',
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
        quiz: null,
      },
      {
        label: 'Spiral Arms',
        quiz: null,
      },
      {
        label: 'Stellar Populations',
        quiz: null,
      },
      {
        label: 'Galactic Halo',
        quiz: null,
      },
    ],
    funFact: 'The Milky Way contains 100-400 billion stars and our solar system takes about 225-250 million years to complete one orbit!',
  },
  Andromeda: {
    subTopics: [
      {
        label: 'M31 Structure',
        quiz: null,
      },
      {
        label: 'Andromeda-Milky Way Collision',
        quiz: null,
      },
      {
        label: 'Satellite Galaxies',
        quiz: null,
      },
      {
        label: 'Star Formation Regions',
        quiz: null,
      },
    ],
    funFact: 'The Andromeda Galaxy is on a collision course with the Milky Way - they will merge in about 4.5 billion years!',
  },
  WIMPs: {
    subTopics: [
      {
        label: 'Neutralinos',
        quiz: null,
      },
      {
        label: 'Detection Methods',
        quiz: null,
      },
      {
        label: 'Mass Estimates',
        quiz: null,
      },
      {
        label: 'Theoretical Predictions',
        quiz: null,
      },
    ],
    funFact: 'WIMPs could be passing through your body right now at a rate of millions per second, but they interact so weakly that you would never notice!',
  },
  'Gravitational Lensing': {
    subTopics: [
      {
        label: 'Einstein Rings',
        quiz: null,
      },
      {
        label: 'Weak Lensing',
        quiz: null,
      },
      {
        label: 'Microlensing',
        quiz: null,
      },
      {
        label: 'Mass Mapping',
        quiz: null,
      },
    ],
    funFact: 'Gravitational lensing was predicted by Einstein in 1915 and first observed during a solar eclipse in 1919, proving general relativity!',
  },
}
