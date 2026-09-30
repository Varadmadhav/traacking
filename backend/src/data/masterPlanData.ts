export interface DailyTopicItem {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
  notes?: string;
}

export interface DayPlanRecord {
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 99
  dayName: string; // e.g. Thursday
  primarySubject: string;
  topics: DailyTopicItem[];
  dailyOutput: string;
  estimatedHours: number;
  pyqTarget: string;
  blockBreakdown?: {
    block1: string;
    block2: string;
    block3: string;
    block4: string;
  };
}

export const DEFAULT_TIMETABLE_TEMPLATE = [
  { id: 'tb-1', startTime: '07:30', endTime: '08:00', label: 'WAKE UP & HYDRATE', blockType: 'routine', defaultCategory: 'Routine' },
  { id: 'tb-2', startTime: '08:00', endTime: '08:30', label: 'BREAKFAST & PRE-STUDY', blockType: 'routine', defaultCategory: 'Nutrition' },
  { id: 'tb-3', startTime: '08:30', endTime: '10:30', label: 'GATE BLOCK 1 (2h)', blockType: 'gate', defaultCategory: 'Core Concepts' },
  { id: 'tb-4', startTime: '10:30', endTime: '11:00', label: 'BREAK & RECHARGE', blockType: 'break', defaultCategory: 'Break' },
  { id: 'tb-5', startTime: '11:00', endTime: '13:00', label: 'GATE BLOCK 2 (2h)', blockType: 'gate', defaultCategory: 'Deep Theory & Notes' },
  { id: 'tb-6', startTime: '13:00', endTime: '14:00', label: 'LUNCH & RECOVERY', blockType: 'routine', defaultCategory: 'Nutrition' },
  { id: 'tb-7', startTime: '14:00', endTime: '15:00', label: 'REST & POWER NAP', blockType: 'rest', defaultCategory: 'Recovery' },
  { id: 'tb-8', startTime: '15:00', endTime: '16:30', label: 'GATE BLOCK 3 (1.5h)', blockType: 'gate', defaultCategory: 'Problem Solving & Drills' },
  { id: 'tb-9', startTime: '16:30', endTime: '17:15', label: 'MATH + GENERAL APTITUDE (45m)', blockType: 'gate', defaultCategory: 'Math & Aptitude' },
  { id: 'tb-10', startTime: '17:30', endTime: '19:00', label: 'GYM & WORKOUT (1.5h)', blockType: 'fitness', defaultCategory: 'Fitness' },
  { id: 'tb-11', startTime: '19:00', endTime: '20:00', label: 'SHOWER + HIGH-PROTEIN DINNER', blockType: 'routine', defaultCategory: 'Nutrition' },
  { id: 'tb-12', startTime: '20:00', endTime: '21:30', label: 'GATE BLOCK 4 (1.5h)', blockType: 'gate', defaultCategory: 'PYQs & Error Log' },
  { id: 'tb-13', startTime: '21:30', endTime: '23:30', label: 'FREE TIME & EXTRA WORK', blockType: 'extra', defaultCategory: 'Extra / Personal' },
  { id: 'tb-14', startTime: '23:30', endTime: '00:00', label: 'WIND DOWN & NIGHT REVIEW', blockType: 'review', defaultCategory: 'Review' },
  { id: 'tb-15', startTime: '00:00', endTime: '07:30', label: 'SLEEP (7.5h - 8h)', blockType: 'sleep', defaultCategory: 'Sleep' },
];

export const RAW_99_DAY_PLAN: Array<{
  date: string;
  dayNumber: number;
  primarySubject: string;
  topics: string[];
  dailyOutput: string;
  estimatedHours?: number;
  pyqTarget?: string;
}> = [
  // October 2026 (Days 1 to 31)
  { date: '2026-10-01', dayNumber: 1, primarySubject: 'C Programming', topics: ['Syntax', 'Data types', 'Operators', 'Control flow', 'Functions'], dailyOutput: '30–40 basic questions', estimatedHours: 6, pyqTarget: '30-40 Questions' },
  { date: '2026-10-02', dayNumber: 2, primarySubject: 'C Programming', topics: ['Arrays', 'Strings', '2D arrays', 'Character arrays'], dailyOutput: 'Topic questions + PYQs', estimatedHours: 6.5, pyqTarget: '25-35 PYQs' },
  { date: '2026-10-03', dayNumber: 3, primarySubject: 'C Programming', topics: ['Pointers', 'Pointer arithmetic', 'Arrays/functions'], dailyOutput: 'Pointer PYQs', estimatedHours: 7, pyqTarget: '30 Pointer PYQs' },
  { date: '2026-10-04', dayNumber: 4, primarySubject: 'C Programming', topics: ['Structures', 'Unions', 'Dynamic memory'], dailyOutput: 'C mini-test', estimatedHours: 6, pyqTarget: 'C Mini-Test (30 Qs)' },
  { date: '2026-10-05', dayNumber: 5, primarySubject: 'Programming/Data Structures', topics: ['Recursion', 'Call stack', 'Recursive complexity'], dailyOutput: 'Recursion PYQs', estimatedHours: 7, pyqTarget: '25 Recursion PYQs' },
  { date: '2026-10-06', dayNumber: 6, primarySubject: 'Data Structures', topics: ['Arrays + singly/doubly/circular linked lists'], dailyOutput: 'Implementation questions + PYQs', estimatedHours: 7, pyqTarget: 'Linked List PYQs' },
  { date: '2026-10-07', dayNumber: 7, primarySubject: 'Data Structures', topics: ['Stacks', 'Queues', 'Circular queue', 'Deque'], dailyOutput: 'PYQs + timed set', estimatedHours: 7, pyqTarget: 'Stack/Queue PYQs' },
  { date: '2026-10-08', dayNumber: 8, primarySubject: 'Data Structures', topics: ['Binary trees', 'Properties', 'Traversals'], dailyOutput: 'Tree PYQs', estimatedHours: 7.5, pyqTarget: 'Tree Traversal PYQs' },
  { date: '2026-10-09', dayNumber: 9, primarySubject: 'Data Structures', topics: ['BST', 'Insertion/deletion/search', 'Predecessor/successor'], dailyOutput: 'BST PYQs', estimatedHours: 7, pyqTarget: 'BST Operations PYQs' },
  { date: '2026-10-10', dayNumber: 10, primarySubject: 'Data Structures', topics: ['Binary heaps', 'Heapify', 'Heap sort', 'Priority queues'], dailyOutput: 'Heap PYQs', estimatedHours: 7, pyqTarget: 'Heap & Priority Queue PYQs' },
  { date: '2026-10-11', dayNumber: 11, primarySubject: 'Data Structures', topics: ['Hashing', 'Collisions', 'Chaining', 'Open addressing'], dailyOutput: 'DSA cumulative test', estimatedHours: 7.5, pyqTarget: 'DSA Cumulative Test (40 Qs)' },
  { date: '2026-10-12', dayNumber: 12, primarySubject: 'Data Structures', topics: ['Graphs', 'Representations', 'BFS'], dailyOutput: 'Graph questions', estimatedHours: 7, pyqTarget: 'Graph BFS PYQs' },
  { date: '2026-10-13', dayNumber: 13, primarySubject: 'Data Structures', topics: ['DFS', 'Components', 'Traversal properties'], dailyOutput: 'Graph PYQs', estimatedHours: 7, pyqTarget: 'DFS & Connectivity PYQs' },
  { date: '2026-10-14', dayNumber: 14, primarySubject: 'DSA Revision', topics: ['C + recursion + all data structures'], dailyOutput: '50–70 mixed PYQs', estimatedHours: 8, pyqTarget: '50-70 Mixed PYQs' },
  { date: '2026-10-15', dayNumber: 15, primarySubject: 'Algorithms', topics: ['Asymptotic notation', 'Best/average/worst case', 'Time/space'], dailyOutput: 'Complexity drills', estimatedHours: 7, pyqTarget: 'Asymptotic Drills (35 Qs)' },
  { date: '2026-10-16', dayNumber: 16, primarySubject: 'Algorithms', topics: ['Linear/binary search', 'Bubble/selection/insertion sort'], dailyOutput: 'Searching/sorting PYQs', estimatedHours: 7, pyqTarget: 'Search & Basic Sort PYQs' },
  { date: '2026-10-17', dayNumber: 17, primarySubject: 'Algorithms', topics: ['Merge sort', 'Quicksort', 'Heap sort', 'Comparisons'], dailyOutput: 'Sorting PYQs', estimatedHours: 7, pyqTarget: 'Advanced Sort PYQs' },
  { date: '2026-10-18', dayNumber: 18, primarySubject: 'Algorithms', topics: ['Divide-and-conquer', 'Recurrences', 'Master theorem'], dailyOutput: 'Recurrence problem set', estimatedHours: 7, pyqTarget: 'Master Theorem Problem Set' },
  { date: '2026-10-19', dayNumber: 19, primarySubject: 'Algorithms', topics: ['Greedy: activity selection', 'Fractional knapsack', 'Scheduling', 'Huffman'], dailyOutput: 'Greedy PYQs', estimatedHours: 7, pyqTarget: 'Greedy Strategy PYQs' },
  { date: '2026-10-20', dayNumber: 20, primarySubject: 'Algorithms', topics: ['DP fundamentals', 'Memoization', 'Tabulation', 'Optimal substructure'], dailyOutput: 'DP practice', estimatedHours: 7.5, pyqTarget: 'DP Foundation Sets' },
  { date: '2026-10-21', dayNumber: 21, primarySubject: 'Algorithms', topics: ['0/1 knapsack', 'LCS', 'LIS', 'Matrix-chain style DP'], dailyOutput: 'DP PYQs', estimatedHours: 7.5, pyqTarget: 'Classic DP PYQs' },
  { date: '2026-10-22', dayNumber: 22, primarySubject: 'Algorithms', topics: ['Shortest paths: Dijkstra', 'Bellman-Ford'], dailyOutput: 'Graph algorithm PYQs', estimatedHours: 7, pyqTarget: 'Shortest Path PYQs' },
  { date: '2026-10-23', dayNumber: 23, primarySubject: 'Algorithms', topics: ['MST: Prim, Kruskal', 'Union-find'], dailyOutput: 'MST PYQs', estimatedHours: 7, pyqTarget: 'MST & Disjoint Set PYQs' },
  { date: '2026-10-24', dayNumber: 24, primarySubject: 'Algorithms', topics: ['Full algorithms revision'], dailyOutput: 'Mixed PYQ set', estimatedHours: 7.5, pyqTarget: '40 Mixed Algo PYQs' },
  { date: '2026-10-25', dayNumber: 25, primarySubject: 'DSA + Algorithms', topics: ['Full test + deep analysis'], dailyOutput: '3-hour timed test + error log', estimatedHours: 8, pyqTarget: '3-Hour Full Test (65 Qs)' },
  { date: '2026-10-26', dayNumber: 26, primarySubject: 'Discrete Mathematics', topics: ['Propositional logic', 'Equivalence', 'Predicates', 'Quantifiers', 'Inference'], dailyOutput: 'Logic PYQs', estimatedHours: 7, pyqTarget: 'Logic & Inference PYQs' },
  { date: '2026-10-27', dayNumber: 27, primarySubject: 'Discrete Mathematics', topics: ['Sets', 'Cartesian products', 'Relations', 'Equivalence/closures'], dailyOutput: 'Relation PYQs', estimatedHours: 7, pyqTarget: 'Set & Relation PYQs' },
  { date: '2026-10-28', dayNumber: 28, primarySubject: 'Discrete Mathematics', topics: ['Functions: one-one', 'Onto', 'Bijection', 'Composition', 'Inverse'], dailyOutput: 'Function PYQs', estimatedHours: 7, pyqTarget: 'Function & Mapping PYQs' },
  { date: '2026-10-29', dayNumber: 29, primarySubject: 'Discrete Mathematics', topics: ['Partial orders', 'Posets', 'Hasse diagrams', 'Bounds', 'Lattices'], dailyOutput: 'Poset/lattice PYQs', estimatedHours: 7, pyqTarget: 'Poset & Lattice PYQs' },
  { date: '2026-10-30', dayNumber: 30, primarySubject: 'Discrete Mathematics', topics: ['Monoids', 'Groups', 'Subgroups', 'Algebraic properties'], dailyOutput: 'Algebra PYQs', estimatedHours: 7, pyqTarget: 'Group Theory PYQs' },
  { date: '2026-10-31', dayNumber: 31, primarySubject: 'Discrete Mathematics', topics: ['Graph connectivity/matching/colouring', 'Counting', 'Recurrence', 'Generating functions'], dailyOutput: 'Discrete test + October audit', estimatedHours: 8, pyqTarget: 'Discrete Full Test + Audit' },

  // November 2026 (Days 32 to 61)
  { date: '2026-11-01', dayNumber: 32, primarySubject: 'DBMS', topics: ['ER model', 'Entities', 'Attributes', 'Relationships', 'Cardinality', 'Participation'], dailyOutput: 'ER PYQs', estimatedHours: 7, pyqTarget: 'ER Modeling PYQs' },
  { date: '2026-11-02', dayNumber: 33, primarySubject: 'DBMS', topics: ['Relational model', 'Schemas', 'Tuples', 'Keys', 'Constraints'], dailyOutput: 'Relational model PYQs', estimatedHours: 7, pyqTarget: 'Relational Model PYQs' },
  { date: '2026-11-03', dayNumber: 34, primarySubject: 'DBMS', topics: ['Relational algebra: selection', 'Projection', 'Set ops', 'Joins', 'Division'], dailyOutput: 'RA PYQs', estimatedHours: 7.5, pyqTarget: 'Relational Algebra PYQs' },
  { date: '2026-11-04', dayNumber: 35, primarySubject: 'DBMS', topics: ['Tuple relational calculus'], dailyOutput: 'TRC practice', estimatedHours: 6.5, pyqTarget: 'TRC Problem Drills' },
  { date: '2026-11-05', dayNumber: 36, primarySubject: 'DBMS', topics: ['SQL SELECT/WHERE/GROUP BY/HAVING/ORDER BY/aggregates'], dailyOutput: 'SQL drills', estimatedHours: 7, pyqTarget: 'SQL Core Queries (30 Qs)' },
  { date: '2026-11-06', dayNumber: 37, primarySubject: 'DBMS', topics: ['Joins', 'Nested queries', 'EXISTS', 'IN', 'ANY/ALL', 'NULL'], dailyOutput: 'SQL PYQs', estimatedHours: 7.5, pyqTarget: 'Advanced SQL & Join PYQs' },
  { date: '2026-11-07', dayNumber: 38, primarySubject: 'DBMS', topics: ['Integrity constraints', 'Primary/candidate/foreign keys'], dailyOutput: 'Constraint PYQs', estimatedHours: 6.5, pyqTarget: 'Keys & Constraints PYQs' },
  { date: '2026-11-08', dayNumber: 39, primarySubject: 'DBMS', topics: ['Functional dependencies', 'Closure', 'Candidate keys', 'Armstrong axioms'], dailyOutput: 'FD drills', estimatedHours: 7.5, pyqTarget: 'FD & Key Finding Drills' },
  { date: '2026-11-09', dayNumber: 40, primarySubject: 'DBMS', topics: ['1NF', '2NF', '3NF', 'BCNF'], dailyOutput: 'Normalization PYQs', estimatedHours: 7.5, pyqTarget: 'Normalization PYQs (35 Qs)' },
  { date: '2026-11-10', dayNumber: 41, primarySubject: 'DBMS', topics: ['File organization', 'Indexing', 'B-tree', 'B+ tree'], dailyOutput: 'Indexing PYQs', estimatedHours: 7.5, pyqTarget: 'B-Tree & Indexing PYQs' },
  { date: '2026-11-11', dayNumber: 42, primarySubject: 'DBMS', topics: ['Transactions', 'ACID', 'Schedules', 'Serializability'], dailyOutput: 'Transaction PYQs', estimatedHours: 7.5, pyqTarget: 'Serializability Conflict PYQs' },
  { date: '2026-11-12', dayNumber: 43, primarySubject: 'DBMS', topics: ['Concurrency control', 'Locking', '2PL', 'Timestamps', 'Deadlocks'], dailyOutput: 'Concurrency PYQs', estimatedHours: 7, pyqTarget: '2PL & Concurrency PYQs' },
  { date: '2026-11-13', dayNumber: 44, primarySubject: 'DBMS', topics: ['Full DBMS revision'], dailyOutput: 'Topic-wise PYQs', estimatedHours: 7.5, pyqTarget: 'DBMS Mixed 50 PYQs' },
  { date: '2026-11-14', dayNumber: 45, primarySubject: 'DBMS', topics: ['Full test + analysis'], dailyOutput: 'Timed DBMS test', estimatedHours: 8, pyqTarget: 'Full DBMS Subject Test' },
  { date: '2026-11-15', dayNumber: 46, primarySubject: 'Operating Systems', topics: ['System calls', 'Processes', 'States', 'PCB', 'Context switching'], dailyOutput: 'OS basics PYQs', estimatedHours: 7, pyqTarget: 'Process & System Call PYQs' },
  { date: '2026-11-16', dayNumber: 47, primarySubject: 'Operating Systems', topics: ['Threads + IPC: shared memory', 'Message passing'], dailyOutput: 'Thread/IPC questions', estimatedHours: 7, pyqTarget: 'Threads & IPC PYQs' },
  { date: '2026-11-17', dayNumber: 48, primarySubject: 'Operating Systems', topics: ['CPU scheduling: FCFS', 'SJF/SRTF', 'Priority', 'RR'], dailyOutput: 'Scheduling numericals', estimatedHours: 7.5, pyqTarget: 'Scheduling Numerical Set' },
  { date: '2026-11-18', dayNumber: 49, primarySubject: 'Operating Systems', topics: ['Critical section', 'Race conditions', 'Peterson', 'Semaphores', 'Mutex', 'Monitors'], dailyOutput: 'Synchronization PYQs', estimatedHours: 8, pyqTarget: 'Semaphores & Sync PYQs' },
  { date: '2026-11-19', dayNumber: 50, primarySubject: 'Operating Systems', topics: ['Deadlock: conditions', 'Prevention', 'Avoidance', 'Banker', 'Detection/recovery'], dailyOutput: 'Deadlock PYQs', estimatedHours: 7.5, pyqTarget: 'Banker Algorithm & Deadlock PYQs' },
  { date: '2026-11-20', dayNumber: 51, primarySubject: 'Operating Systems', topics: ['Memory management', 'Allocation', 'Paging', 'Segmentation', 'Fragmentation'], dailyOutput: 'Memory PYQs', estimatedHours: 7.5, pyqTarget: 'Paging & Address Translation PYQs' },
  { date: '2026-11-21', dayNumber: 52, primarySubject: 'Operating Systems', topics: ['Virtual memory', 'Page faults', 'FIFO/LRU/optimal', 'Thrashing'], dailyOutput: 'VM PYQs', estimatedHours: 7.5, pyqTarget: 'Page Replacement Numericals' },
  { date: '2026-11-22', dayNumber: 53, primarySubject: 'Operating Systems', topics: ['File systems', 'Allocation', 'Directories', 'Inode', 'Disk organization'], dailyOutput: 'File-system PYQs', estimatedHours: 7, pyqTarget: 'Inode & File System PYQs' },
  { date: '2026-11-23', dayNumber: 54, primarySubject: 'Operating Systems', topics: ['File systems', 'Allocation', 'Directories', 'Inode', 'Disk organization', 'I/O scheduling (FCFS, SSTF, SCAN, C-SCAN, LOOK/C-LOOK)'], dailyOutput: 'File-system + I/O scheduling PYQs and numericals', estimatedHours: 7.5, pyqTarget: 'Disk & I/O Scheduling Numericals' },
  { date: '2026-11-24', dayNumber: 55, primarySubject: 'Operating Systems', topics: ['Full test + analysis'], dailyOutput: 'Timed OS test', estimatedHours: 8, pyqTarget: 'Full OS Subject Test' },
  { date: '2026-11-25', dayNumber: 56, primarySubject: 'Computer Networks', topics: ['Layering', 'OSI/TCP-IP', 'Circuit/packet/virtual circuit switching', 'Metrics'], dailyOutput: 'CN basics PYQs', estimatedHours: 7, pyqTarget: 'OSI/TCP-IP Model PYQs' },
  { date: '2026-11-26', dayNumber: 57, primarySubject: 'Computer Networks', topics: ['Data link: framing', 'Error detection', 'CRC/checksum', 'MAC'], dailyOutput: 'Datalink PYQs', estimatedHours: 7.5, pyqTarget: 'CRC & Framing PYQs' },
  { date: '2026-11-27', dayNumber: 58, primarySubject: 'Computer Networks', topics: ['Ethernet', 'CSMA/CD', 'Switching'], dailyOutput: 'Ethernet PYQs', estimatedHours: 7.5, pyqTarget: 'CSMA/CD Efficiency PYQs' },
  { date: '2026-11-28', dayNumber: 59, primarySubject: 'Computer Networks', topics: ['Distance-vector', 'Link-state routing'], dailyOutput: 'Routing PYQs', estimatedHours: 7.5, pyqTarget: 'Routing Algorithm PYQs' },
  { date: '2026-11-29', dayNumber: 60, primarySubject: 'Computer Networks', topics: ['IPv4', 'Addressing', 'Subnetting', 'CIDR', 'Fragmentation'], dailyOutput: 'IP numericals', estimatedHours: 8, pyqTarget: 'Subnetting & CIDR Numericals' },
  { date: '2026-11-30', dayNumber: 61, primarySubject: 'Computer Networks', topics: ['NAT', 'TCP flow/congestion control', 'Socket API', 'DNS', 'HTTP'], dailyOutput: 'CN PYQs + November audit', estimatedHours: 8, pyqTarget: 'TCP Congestion & CN Full Test' },

  // December 2026 (Days 62 to 92)
  { date: '2026-12-01', dayNumber: 62, primarySubject: 'Engineering Mathematics', topics: ['Matrices', 'Determinants', 'Systems of linear equations'], dailyOutput: 'Math PYQs', estimatedHours: 7, pyqTarget: 'Linear Systems PYQs' },
  { date: '2026-12-02', dayNumber: 63, primarySubject: 'Engineering Mathematics', topics: ['Rank', 'Eigenvalues', 'Eigenvectors'], dailyOutput: 'Linear algebra PYQs', estimatedHours: 7.5, pyqTarget: 'Eigenvalues & Rank PYQs' },
  { date: '2026-12-03', dayNumber: 64, primarySubject: 'Engineering Mathematics', topics: ['LU decomposition + linear algebra revision'], dailyOutput: 'Timed math set', estimatedHours: 7, pyqTarget: 'Linear Algebra Timed Set' },
  { date: '2026-12-04', dayNumber: 65, primarySubject: 'Engineering Mathematics', topics: ['Limits', 'Continuity', 'Differentiability'], dailyOutput: 'Calculus PYQs', estimatedHours: 7, pyqTarget: 'Limits & Continuity PYQs' },
  { date: '2026-12-05', dayNumber: 66, primarySubject: 'Engineering Mathematics', topics: ['Maxima/minima', 'Mean value theorem'], dailyOutput: 'Calculus PYQs', estimatedHours: 7, pyqTarget: 'Calculus Maxima/Minima PYQs' },
  { date: '2026-12-06', dayNumber: 67, primarySubject: 'Engineering Mathematics', topics: ['Integration and properties'], dailyOutput: 'Integration PYQs', estimatedHours: 7, pyqTarget: 'Definite Integrals PYQs' },
  { date: '2026-12-07', dayNumber: 68, primarySubject: 'Engineering Mathematics', topics: ['Random variables', 'Conditional probability', 'Bayes theorem'], dailyOutput: 'Probability PYQs', estimatedHours: 7.5, pyqTarget: 'Bayes Theorem & Prob PYQs' },
  { date: '2026-12-08', dayNumber: 69, primarySubject: 'Engineering Mathematics', topics: ['Uniform, normal, exponential, Poisson, binomial distributions'], dailyOutput: 'Distribution numericals', estimatedHours: 7.5, pyqTarget: 'Distributions Numericals' },
  { date: '2026-12-09', dayNumber: 70, primarySubject: 'Engineering Mathematics', topics: ['Mean, median, mode, variance, standard deviation'], dailyOutput: 'Statistics PYQs', estimatedHours: 7, pyqTarget: 'Statistics Measures PYQs' },
  { date: '2026-12-10', dayNumber: 71, primarySubject: 'Engineering Mathematics', topics: ['Full test + analysis'], dailyOutput: 'Timed Math test', estimatedHours: 8, pyqTarget: 'Full Engg Math Subject Test' },
  { date: '2026-12-11', dayNumber: 72, primarySubject: 'Digital Logic', topics: ['Boolean algebra', 'Gates', 'Simplification', 'Canonical forms'], dailyOutput: 'Boolean PYQs', estimatedHours: 7, pyqTarget: 'Boolean Gates PYQs' },
  { date: '2026-12-12', dayNumber: 73, primarySubject: 'Digital Logic', topics: ['K-map 2/3/4 variables', 'Don\'t cares'], dailyOutput: 'K-map drills', estimatedHours: 7, pyqTarget: 'K-Map Minimization Drills' },
  { date: '2026-12-13', dayNumber: 74, primarySubject: 'Digital Logic', topics: ['Tabular/Quine–McCluskey method'], dailyOutput: 'Minimization practice', estimatedHours: 6.5, pyqTarget: 'Tabular Method Practice' },
  { date: '2026-12-14', dayNumber: 75, primarySubject: 'Digital Logic', topics: ['Combinational circuits: adders, subtractors', 'MUX/DEMUX', 'Encoder/decoder'], dailyOutput: 'Circuit PYQs', estimatedHours: 7.5, pyqTarget: 'MUX & Combinational PYQs' },
  { date: '2026-12-15', dayNumber: 76, primarySubject: 'Digital Logic', topics: ['Sequential circuits: latches, flip-flops', 'Registers', 'Counters'], dailyOutput: 'Sequential PYQs', estimatedHours: 8, pyqTarget: 'Flip-Flops & Counter PYQs' },
  { date: '2026-12-16', dayNumber: 77, primarySubject: 'Digital Logic', topics: ['Number representation and arithmetic: binary/hex, signed', 'Complements'], dailyOutput: 'Number-system PYQs', estimatedHours: 7, pyqTarget: 'Complements & Number PYQs' },
  { date: '2026-12-17', dayNumber: 78, primarySubject: 'Digital Logic', topics: ['Fixed/floating point arithmetic + full revision'], dailyOutput: 'Digital Logic PYQs', estimatedHours: 7.5, pyqTarget: 'IEEE 754 & Full DL Revision' },
  { date: '2026-12-18', dayNumber: 79, primarySubject: 'Digital Logic', topics: ['Full test + analysis'], dailyOutput: 'Timed test', estimatedHours: 8, pyqTarget: 'Full Digital Logic Subject Test' },
  { date: '2026-12-19', dayNumber: 80, primarySubject: 'COA', topics: ['Instruction set', 'Instruction formats', 'Addressing modes'], dailyOutput: 'COA PYQs', estimatedHours: 7.5, pyqTarget: 'Addressing Modes PYQs' },
  { date: '2026-12-20', dayNumber: 81, primarySubject: 'COA', topics: ['ALU', 'Datapath', 'Arithmetic/logic operations'], dailyOutput: 'ALU PYQs', estimatedHours: 7, pyqTarget: 'Datapath & ALU PYQs' },
  { date: '2026-12-21', dayNumber: 82, primarySubject: 'COA', topics: ['Control unit: hardwired + microprogrammed'], dailyOutput: 'Control-unit PYQs', estimatedHours: 7, pyqTarget: 'Microprogrammed Control PYQs' },
  { date: '2026-12-22', dayNumber: 83, primarySubject: 'COA', topics: ['Memory hierarchy', 'Registers/cache/main/secondary memory'], dailyOutput: 'Memory PYQs', estimatedHours: 7.5, pyqTarget: 'Memory Organization PYQs' },
  { date: '2026-12-23', dayNumber: 84, primarySubject: 'COA', topics: ['Cache mapping: direct, associative, set associative', 'Hit/miss', 'AMAT'], dailyOutput: 'Cache numericals', estimatedHours: 8, pyqTarget: 'Cache Mapping & AMAT Numericals' },
  { date: '2026-12-24', dayNumber: 85, primarySubject: 'COA', topics: ['I/O interface', 'Interrupts', 'DMA'], dailyOutput: 'I/O PYQs', estimatedHours: 7, pyqTarget: 'Interrupts & DMA Cycle PYQs' },
  { date: '2026-12-25', dayNumber: 86, primarySubject: 'COA', topics: ['Instruction pipelining', 'Speedup', 'Throughput', 'Hazards'], dailyOutput: 'Pipeline numericals', estimatedHours: 8, pyqTarget: 'Pipeline Hazards Numericals' },
  { date: '2026-12-26', dayNumber: 87, primarySubject: 'COA', topics: ['Full COA revision'], dailyOutput: 'Mixed PYQs', estimatedHours: 7.5, pyqTarget: 'Full COA 40 Mixed PYQs' },
  { date: '2026-12-27', dayNumber: 88, primarySubject: 'COA', topics: ['Full test + analysis'], dailyOutput: 'Timed COA test', estimatedHours: 8, pyqTarget: 'Full COA Subject Test' },
  { date: '2026-12-28', dayNumber: 89, primarySubject: 'TOC', topics: ['Regular expressions', 'DFA', 'NFA', 'Epsilon-NFA', 'Conversions'], dailyOutput: 'Automata PYQs', estimatedHours: 7.5, pyqTarget: 'DFA & NFA Construction PYQs' },
  { date: '2026-12-29', dayNumber: 90, primarySubject: 'TOC', topics: ['Regular languages', 'Closure properties', 'Pumping lemma'], dailyOutput: 'Regular-language PYQs', estimatedHours: 7.5, pyqTarget: 'Closure Properties & Pumping Lemma PYQs' },
  { date: '2026-12-30', dayNumber: 91, primarySubject: 'TOC', topics: ['CFG', 'Derivations', 'Parse trees', 'Ambiguity', 'Normal forms'], dailyOutput: 'CFG PYQs', estimatedHours: 7.5, pyqTarget: 'CFG Ambiguity & CNF PYQs' },
  { date: '2026-12-31', dayNumber: 92, primarySubject: 'TOC', topics: ['PDA', 'CFL', 'Turing machines', 'Undecidability'], dailyOutput: 'TOC cumulative test', estimatedHours: 8, pyqTarget: 'TOC Subject Test + Year-End Audit' },

  // January 2027 (Days 93 to 99)
  { date: '2027-01-01', dayNumber: 93, primarySubject: 'Compiler Design', topics: ['Lexical analysis', 'Tokens/lexemes', 'Regex/automata connection'], dailyOutput: 'Compiler PYQs', estimatedHours: 7, pyqTarget: 'Lexer & Token PYQs' },
  { date: '2027-01-02', dayNumber: 94, primarySubject: 'Compiler Design', topics: ['Parsing', 'FIRST/FOLLOW', 'Top-down', 'Bottom-up', 'LL/LR concepts'], dailyOutput: 'Parsing drills', estimatedHours: 8, pyqTarget: 'FIRST/FOLLOW & LR Parsing Drills' },
  { date: '2027-01-03', dayNumber: 95, primarySubject: 'Compiler Design', topics: ['Syntax-directed translation', 'Definitions', 'Translation schemes'], dailyOutput: 'Compiler PYQs', estimatedHours: 7.5, pyqTarget: 'SDT & S-attributed/L-attributed PYQs' },
  { date: '2027-01-04', dayNumber: 96, primarySubject: 'Compiler Design', topics: ['Runtime environments', 'Activation records', 'Stack/heap', 'Parameter passing'], dailyOutput: 'Runtime questions', estimatedHours: 7, pyqTarget: 'Activation Records & Runtime PYQs' },
  { date: '2027-01-05', dayNumber: 97, primarySubject: 'Compiler Design', topics: ['Intermediate code: TAC', 'Quadruples', 'Triples', 'IR'], dailyOutput: 'IR PYQs', estimatedHours: 7, pyqTarget: 'Three Address Code PYQs' },
  { date: '2027-01-06', dayNumber: 98, primarySubject: 'Compiler Design', topics: ['Local optimization', 'Constant propagation', 'Liveness', 'Common subexpression elimination', 'Data-flow analysis'], dailyOutput: 'Optimization PYQs', estimatedHours: 7.5, pyqTarget: 'Code Optimization Drills' },
  { date: '2027-01-07', dayNumber: 99, primarySubject: 'Compiler Design', topics: ['Full compiler revision + test + syllabus audit'], dailyOutput: 'Mark every syllabus item green', estimatedHours: 8, pyqTarget: 'Final Syllabus Master Test & Green Audit' },
];

export const GATE_10_ROADMAP_SECTIONS = [
  {
    id: 'sec-1',
    name: 'Engineering Mathematics',
    shortName: 'Math & Discrete',
    weightage: '13-15 Marks',
    color: '#3B82F6',
    topics: [
      'Propositional and First-Order Logic',
      'Sets, Relations, Functions, Partial Orders, Lattices, Groups',
      'Combinatorics, Counting, Recurrence Relations, Generating Functions',
      'Graph Theory: Connectivity, Matching, Coloring',
      'Matrices, Determinants, Linear Systems, Eigenvalues, Eigenvectors, LU Decomposition',
      'Calculus: Limits, Continuity, Differentiability, Maxima/Minima, Integration',
      'Probability: Conditional Probability, Bayes Theorem, Random Variables, Distributions, Statistics'
    ]
  },
  {
    id: 'sec-2',
    name: 'Digital Logic',
    shortName: 'Digital Logic',
    weightage: '5-7 Marks',
    color: '#10B981',
    topics: [
      'Boolean Algebra & Logic Gates',
      'K-Maps & Tabular Minimization (Quine-McCluskey)',
      'Combinational Circuits: Adders, Subtractors, MUX, Decoders, Encoders',
      'Sequential Circuits: Latches, Flip-Flops, Registers, Counters',
      'Number Representations & Signed Arithmetic',
      'Fixed and Floating-Point Representations (IEEE 754)'
    ]
  },
  {
    id: 'sec-3',
    name: 'Computer Organization and Architecture',
    shortName: 'COA',
    weightage: '7-9 Marks',
    color: '#8B5CF6',
    topics: [
      'Machine Instructions & Addressing Modes',
      'ALU, Data Path & Control Unit (Hardwired & Microprogrammed)',
      'Memory Hierarchy: Cache Memory, Mapping Techniques, AMAT',
      'Main Memory & Secondary Storage Organization',
      'I/O Interface: Interrupts & DMA',
      'Instruction Pipelining, Hazards, Speedup & Throughput'
    ]
  },
  {
    id: 'sec-4',
    name: 'Programming and Data Structures',
    shortName: 'C & Data Structures',
    weightage: '10-12 Marks',
    color: '#F59E0B',
    topics: [
      'C Programming: Syntax, Data Types, Control Flow, Functions',
      'Pointers, Arrays, Dynamic Memory Allocation, Strings, Structures',
      'Recursion, Call Stack Analysis & Complexity',
      'Linear Data Structures: Arrays, Linked Lists (Singly, Doubly, Circular)',
      'Stacks, Queues, Circular Queues, Deques',
      'Trees: Binary Trees, BSTs, Traversals, Properties',
      'Binary Heaps, Priority Queues, Heap Sort',
      'Hashing: Hash Functions, Collisions, Chaining, Open Addressing',
      'Graphs: Adjacency Representations, BFS, DFS, Connected Components'
    ]
  },
  {
    id: 'sec-5',
    name: 'Algorithms',
    shortName: 'Algorithms',
    weightage: '8-10 Marks',
    color: '#EC4899',
    topics: [
      'Asymptotic Analysis (Best, Worst, Average), Big-O, Theta, Omega',
      'Searching & Sorting Algorithms, Lower Bounds for Comparison Sorts',
      'Divide and Conquer: Recurrence Relations & Master Theorem',
      'Greedy Algorithms: Huffman Coding, Fractional Knapsack, Activity Selection',
      'Dynamic Programming: 0/1 Knapsack, LCS, LIS, Matrix Chain Multiplication',
      'Graph Algorithms: Shortest Paths (Dijkstra, Bellman-Ford), Minimum Spanning Trees (Prim, Kruskal)'
    ]
  },
  {
    id: 'sec-6',
    name: 'Theory of Computation',
    shortName: 'TOC',
    weightage: '7-9 Marks',
    color: '#06B6D4',
    topics: [
      'Regular Expressions, Finite Automata (DFA, NFA, Epsilon-NFA, Minimization)',
      'Regular Languages & Pumping Lemma, Closure Properties',
      'Context-Free Grammars, Derivations, Parse Trees, Ambiguity',
      'Pushdown Automata (PDA) & Context-Free Languages',
      'Turing Machines & Undecidability, Halting Problem, Rice\'s Theorem'
    ]
  },
  {
    id: 'sec-7',
    name: 'Compiler Design',
    shortName: 'Compilers',
    weightage: '4-6 Marks',
    color: '#6366F1',
    topics: [
      'Lexical Analysis: Tokens, Lexemes, Regular Expressions to DFAs',
      'Parsing: LL(1), LR(0), SLR(1), LALR(1), CLR(1), FIRST and FOLLOW sets',
      'Syntax-Directed Translation (SDT): S-attributed & L-attributed Definitions',
      'Intermediate Code Generation: Three-Address Code, Triples, Quadruples',
      'Runtime Environments: Activation Records, Stack Allocation, Parameter Passing',
      'Code Optimization: Basic Blocks, Control Flow Graphs, Common Subexpression, Liveness'
    ]
  },
  {
    id: 'sec-8',
    name: 'Operating Systems',
    shortName: 'Operating Systems',
    weightage: '8-10 Marks',
    color: '#14B8A6',
    topics: [
      'System Calls, Process States, PCB, Context Switching',
      'Threads, Multi-threading Models, Inter-process Communication (IPC)',
      'CPU Scheduling Algorithms: FCFS, SJF, SRTF, Priority, Round Robin',
      'Process Synchronization: Critical Section, Peterson\'s Solution, Semaphores, Mutex, Monitors',
      'Deadlocks: Necessary Conditions, Prevention, Avoidance (Banker\'s Algorithm), Detection & Recovery',
      'Memory Management: Paging, Segmentation, Multi-level Paging, TLB',
      'Virtual Memory: Page Faults, Page Replacement Algorithms (FIFO, LRU, Optimal), Thrashing',
      'File Systems & Disk Organization: Inode, Allocation Methods, Disk & I/O Scheduling (FCFS, SSTF, SCAN, LOOK)'
    ]
  },
  {
    id: 'sec-9',
    name: 'Databases (DBMS)',
    shortName: 'DBMS',
    weightage: '7-9 Marks',
    color: '#F97316',
    topics: [
      'ER Model, Entities, Attributes, Relationships, Cardinality & Participation Constraints',
      'Relational Model: Relational Algebra & Tuple Relational Calculus',
      'SQL Queries: DDL, DML, Joins, Nested Queries, Aggregations, Grouping',
      'Integrity Constraints: Primary, Foreign, Candidate Keys, Referential Integrity',
      'Functional Dependencies, Closure, Minimal Cover, Candidate Key Derivation',
      'Normalization: 1NF, 2NF, 3NF, BCNF, Lossless Join & Dependency Preservation',
      'Indexing & File Organization: B-Trees, B+ Trees, Dense/Sparse Indexing',
      'Transactions & Concurrency: ACID Properties, Serializability, 2PL, Deadlock & Recovery'
    ]
  },
  {
    id: 'sec-10',
    name: 'Computer Networks',
    shortName: 'Networks',
    weightage: '8-10 Marks',
    color: '#0EA5E9',
    topics: [
      'OSI and TCP/IP Architecture, Layering Principles, Switching Types',
      'Data Link Layer: Framing, Error Detection (CRC, Checksum), Flow Control (Sliding Window)',
      'Medium Access Control (MAC): CSMA/CD, Ethernet, Collision Resolution',
      'Network Layer: IPv4 Addressing, Subnetting, CIDR, Fragmentation, Packet Routing',
      'Routing Protocols: Distance Vector Routing, Link State Routing',
      'Transport Layer: TCP, UDP, Flow Control, Congestion Control, TCP Header',
      'Application Layer Protocols: DNS, HTTP, SMTP, FTP, Sockets, NAT'
    ]
  }
];
