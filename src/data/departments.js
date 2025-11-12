export const departments = [
  {
    id: 'cse',
    name: 'Computer Science Engineering',
    shortName: 'CSE',
    code: 'CS',
    description: 'Computer Science and Engineering focuses on software development, algorithms, and computing systems.',
    duration: '4 years',
    totalSemesters: 8,
    subjects: [
      'Programming Fundamentals',
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Computer Networks',
      'Operating Systems',
      'Software Engineering',
      'Web Technologies',
      'Machine Learning',
      'Artificial Intelligence',
      'Cybersecurity'
    ]
  },
  {
    id: 'me',
    name: 'Mechanical Engineering',
    shortName: 'ME',
    code: 'ME',
    description: 'Mechanical Engineering deals with design, manufacturing, and maintenance of mechanical systems.',
    duration: '4 years',
    totalSemesters: 8,
    subjects: [
      'Engineering Mechanics',
      'Thermodynamics',
      'Fluid Mechanics',
      'Machine Design',
      'Manufacturing Processes',
      'Heat Transfer',
      'Automobile Engineering',
      'Robotics',
      'CAD/CAM',
      'Industrial Engineering'
    ]
  },
  {
    id: 'ee',
    name: 'Electrical Engineering',
    shortName: 'EE',
    code: 'EE',
    description: 'Electrical Engineering focuses on electrical systems, power generation, and electronic devices.',
    duration: '4 years',
    totalSemesters: 8,
    subjects: [
      'Circuit Analysis',
      'Electromagnetic Theory',
      'Power Systems',
      'Control Systems',
      'Digital Electronics',
      'Microprocessors',
      'Power Electronics',
      'Renewable Energy',
      'Electric Machines',
      'Signal Processing'
    ]
  },
  {
    id: 'ce',
    name: 'Civil Engineering',
    shortName: 'CE',
    code: 'CE',
    description: 'Civil Engineering involves design and construction of infrastructure and buildings.',
    duration: '4 years',
    totalSemesters: 8,
    subjects: [
      'Structural Analysis',
      'Concrete Technology',
      'Geotechnical Engineering',
      'Transportation Engineering',
      'Water Resources Engineering',
      'Environmental Engineering',
      'Construction Management',
      'Surveying',
      'Building Materials',
      'Urban Planning'
    ]
  },
  {
    id: 'ece',
    name: 'Electronics & Communication Engineering',
    shortName: 'ECE',
    code: 'EC',
    description: 'Electronics & Communication Engineering focuses on electronic devices and communication systems.',
    duration: '4 years',
    totalSemesters: 8,
    subjects: [
      'Analog Electronics',
      'Digital Electronics',
      'Communication Systems',
      'Microwave Engineering',
      'VLSI Design',
      'Embedded Systems',
      'Digital Signal Processing',
      'Antenna Theory',
      'Optical Communication',
      'Wireless Networks'
    ]
  }
]

export const getDepartmentById = (id) => {
  return departments.find(dept => dept.id === id)
}

export const getDepartmentByName = (name) => {
  return departments.find(dept => dept.name === name || dept.shortName === name)
}

export const getDepartmentOptions = () => {
  return departments.map(dept => ({
    value: dept.id,
    label: dept.name,
    shortLabel: dept.shortName
  }))
}

export const getSemesterOptions = () => {
  return [
    { value: '1', label: '1st Semester' },
    { value: '2', label: '2nd Semester' },
    { value: '3', label: '3rd Semester' },
    { value: '4', label: '4th Semester' },
    { value: '5', label: '5th Semester' },
    { value: '6', label: '6th Semester' },
    { value: '7', label: '7th Semester' },
    { value: '8', label: '8th Semester' }
  ]
}

export const getBatchOptions = () => {
  const currentYear = new Date().getFullYear()
  const batches = []
  
  for (let i = 0; i < 5; i++) {
    const startYear = currentYear - i
    const endYear = startYear + 4
    batches.push({
      value: `${startYear}-${endYear}`,
      label: `${startYear}-${endYear}`
    })
  }
  
  return batches
}