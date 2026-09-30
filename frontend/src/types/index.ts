export interface User {
  id: string;
  name: string;
  email: string;
  startDate: string; // YYYY-MM-DD
  examDate: string; // YYYY-MM-DD
  proteinTarget: number;
  stepTarget: number;
  studyTargetHours: number;
  sleepTargetHours: number;
  phoneTargetHours: number;
  workoutDaysPerWeek: number;
  theme: string;
  hasSeededPlan: boolean;
}

export interface TopicSubItem {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
  notes?: string;
}

export interface GatePlanDay {
  _id: string;
  userId: string;
  date: string;
  dayNumber: number;
  dayName: string;
  primarySubject: string;
  topics: TopicSubItem[];
  dailyOutput: string;
  estimatedHours: number;
  pyqTarget: string;
  status: 'not_started' | 'in_progress' | 'completed';
  notes: string;
  isCompleted: boolean;
  blockBreakdown?: {
    block1: string;
    block2: string;
    block3: string;
    block4: string;
  };
}

export interface ProteinEntry {
  id: string;
  grams: number;
  time?: string;
  label?: string;
}

export interface TimetableBlockState {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  subLabel?: string;
  blockType?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  notes?: string;
}

export interface DailyLog {
  _id?: string;
  userId?: string;
  date: string;
  sleep: {
    sleptAt?: string;
    wokeUpAt?: string;
    durationMinutes: number;
    qualityRating?: number;
    notes?: string;
  };
  protein: {
    entries: ProteinEntry[];
    totalGrams: number;
    target: number;
  };
  steps: {
    count: number;
    target: number;
  };
  workout: {
    completed: boolean;
    workoutType: string;
    durationMinutes?: number;
    notes?: string;
  };
  phone: {
    totalMinutes: number;
    instagramMinutes?: number;
    youtubeMinutes?: number;
    otherMinutes?: number;
    targetMinutes: number;
    notes?: string;
  };
  habits: {
    gateTarget: boolean;
    pyqsDone: boolean;
    gymDone: boolean;
    steps10k: boolean;
    proteinTarget: boolean;
    sleepTarget: boolean;
    phoneUnderTarget: boolean;
    dailyReviewDone: boolean;
    customHabits: Array<{ name: string; done: boolean }>;
  };
  review: {
    wentWell: string;
    improveTomorrow: string;
    dailyScore: number;
    status: 'pending' | 'completed';
    completedAt?: string;
  };
  dailyScoreBreakdown: {
    gate: number;
    studyConsistency: number;
    sleep: number;
    protein: number;
    gym: number;
    steps: number;
    phone: number;
    dailyReview: number;
    total: number;
  };
  timetableBlocks: TimetableBlockState[];
}

export interface DashboardSummary {
  currentDate: string;
  dayNumber: number;
  totalArcDays: number;
  daysLeftToGate: number;
  examDate: string;
  startDate: string;
  todayMission: GatePlanDay | null;
  progress: {
    gatePercent: number;
    topicsCompleted: number;
    totalTopics: number;
    studyHours: number;
    targetStudyHours: number;
    studyMinutes: number;
    pyqsSolved: number;
    pyqsCorrect: number;
    sleepMinutes: number;
    proteinGrams: number;
    targetProtein: number;
    stepsCount: number;
    targetSteps: number;
    workoutDone: boolean;
    workoutType: string;
    phoneMinutes: number;
    targetPhoneMinutes: number;
    dailyScore: number;
    scoreBreakdown: {
      gate: number;
      studyConsistency: number;
      sleep: number;
      protein: number;
      gym: number;
      steps: number;
      phone: number;
      dailyReview: number;
      total: number;
    };
  };
  dailyLog: DailyLog | null;
  studySessions: StudySession[];
  dueRevisions: RevisionItem[];
  extraTasks: ExtraTask[];
}

export interface StudySession {
  _id: string;
  userId: string;
  date: string;
  subject: string;
  topic: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  studyType: 'concept' | 'practice' | 'pyq' | 'revision' | 'mock';
  focusRating?: number;
  difficultyRating?: number;
  confidenceRating?: number;
  notes?: string;
  isActive?: boolean;
}

export interface PYQAttempt {
  _id: string;
  userId: string;
  date: string;
  subject: string;
  topic: string;
  year?: number;
  questionCode?: string;
  questionText?: string;
  questionType: 'MCQ' | 'MSQ' | 'NAT';
  marks: number;
  result: 'correct' | 'incorrect' | 'skipped';
  timeTakenSeconds: number;
  mistakeType: 'none' | 'concept' | 'calculation' | 'misread' | 'time' | 'guess' | 'silly_mistake';
  notes?: string;
  addedToErrorBook?: boolean;
}

export interface ErrorBookItem {
  _id: string;
  userId: string;
  date: string;
  pyqAttemptId?: string;
  question: string;
  subject: string;
  topic: string;
  year?: number;
  mistakeType: 'concept' | 'calculation' | 'misread' | 'time' | 'guess' | 'silly_mistake';
  whyWrong: string;
  correctConcept: string;
  whatToRemember: string;
  revisionDate?: string;
  status: 'pending' | 'reviewing' | 'mastered';
  tags?: string[];
  createdAt: string;
}

export interface RevisionItem {
  _id: string;
  userId: string;
  topicName: string;
  subject: string;
  dayPlanId?: string;
  revisionNumber: number;
  dueDate: string;
  originalDate: string;
  status: 'pending' | 'completed' | 'snoozed';
  completedAt?: string;
  notes?: string;
}

export interface ExtraTask {
  _id: string;
  userId: string;
  date: string;
  title: string;
  category: 'College' | 'Career' | 'Coding' | 'Personal' | 'Family' | 'Other';
  estimatedMinutes: number;
  actualMinutes: number;
  status: 'not_started' | 'in_progress' | 'completed';
  notes?: string;
}

export interface WeeklyReview {
  _id: string;
  userId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  metrics: {
    studyHours: number;
    pyqsAttempted: number;
    pyqAccuracy: number;
    topicsCompleted: number;
    revisionsDone: number;
    avgSleepMinutes: number;
    avgProteinGrams: number;
    avgSteps: number;
    gymDays: number;
    avgPhoneMinutes: number;
    extraTasksDone: number;
  };
  winOfTheWeek: string;
  biggestWeakness: string;
  nextWeekPriority: string;
  generalNotes?: string;
}

export interface MockTest {
  _id: string;
  userId: string;
  title: string;
  date: string;
  testType: 'Subject' | 'Multi-Subject' | 'Full-Length';
  subject?: string;
  totalMarks: number;
  score: number;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  timeTakenMinutes: number;
  mistakeBreakdown: {
    concept: number;
    application: number;
    calculation: number;
    time: number;
    selection: number;
    silly: number;
  };
  notes?: string;
}

export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  subject?: string;
  topic?: string;
  date?: string;
  tags?: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapSection {
  id: string;
  name: string;
  shortName: string;
  weightage: string;
  color: string;
  topics: string[];
  totalDaysAssigned: number;
  totalTopics: number;
  completedTopics: number;
  progress: number;
  pyqCount: number;
  revisionCount: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Needs Revision';
  assignedDays: Array<{
    date: string;
    dayNumber: number;
    primarySubject: string;
    status: string;
    topicsCount: number;
    completedCount: number;
  }>;
}
