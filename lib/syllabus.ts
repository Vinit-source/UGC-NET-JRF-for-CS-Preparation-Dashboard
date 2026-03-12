export type SyllabusItem = {
  id: string;
  title: string;
  type: 'unit' | 'topic' | 'subtopic';
  children?: SyllabusItem[];
};

export const syllabus: SyllabusItem[] = [
  {
    id: 'p1',
    title: 'Paper 1: General',
    type: 'unit',
    children: [
      {
        id: 'p1-u1',
        title: 'I. Teaching Aptitude',
        type: 'unit',
        children: [
          {
            id: 'p1-u1-t1',
            title: 'Teaching',
            type: 'topic',
            children: [
              { id: 'p1-u1-t1-s1', title: 'Concept, Objectives, Levels of teaching', type: 'subtopic' },
              { id: 'p1-u1-t1-s2', title: 'Characteristics, and basic requirements', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u1-t2',
            title: 'Learner\'s characteristics',
            type: 'topic',
            children: [
              { id: 'p1-u1-t2-s1', title: 'Characteristics of adolescent and adult learners', type: 'subtopic' },
              { id: 'p1-u1-t2-s2', title: 'Individual differences', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u1-t3',
            title: 'Factors affecting teaching related to',
            type: 'topic',
            children: [
              { id: 'p1-u1-t3-s1', title: 'Teacher, Learner, Support material', type: 'subtopic' },
              { id: 'p1-u1-t3-s2', title: 'Instructional facilities, Learning environment, and Institution', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u1-t4',
            title: 'Methods of teaching in Institutions of higher learning',
            type: 'topic',
            children: [
              { id: 'p1-u1-t4-s1', title: 'Teacher-centred vs. Learner-centred methods', type: 'subtopic' },
              { id: 'p1-u1-t4-s2', title: 'Off-line vs. On-line methods (Swayam, Swayamprabha, MOOCs etc.)', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u1-t5',
            title: 'Teaching Support System',
            type: 'topic',
            children: [
              { id: 'p1-u1-t5-s1', title: 'Traditional, Modern, and ICT based', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u1-t6',
            title: 'Evaluation Systems',
            type: 'topic',
            children: [
              { id: 'p1-u1-t6-s1', title: 'Elements and Types of evaluation', type: 'subtopic' },
              { id: 'p1-u1-t6-s2', title: 'Evaluation in Choice Based Credit System in Higher education', type: 'subtopic' },
              { id: 'p1-u1-t6-s3', title: 'Computer-based testing, Innovations in evaluation systems', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p1-u2',
        title: 'II. Research Aptitude',
        type: 'unit',
        children: [
          {
            id: 'p1-u2-t1',
            title: 'Research',
            type: 'topic',
            children: [
              { id: 'p1-u2-t1-s1', title: 'Meaning, Types, and Characteristics', type: 'subtopic' },
              { id: 'p1-u2-t1-s2', title: 'Positivism and Post-positivistic approach to research', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u2-t2',
            title: 'Methods of Research',
            type: 'topic',
            children: [
              { id: 'p1-u2-t2-s1', title: 'Experimental, Descriptive, Historical, Qualitative, and Quantitative methods', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u2-t3',
            title: 'Steps of Research',
            type: 'topic'
          },
          {
            id: 'p1-u2-t4',
            title: 'Thesis and Article writing',
            type: 'topic',
            children: [
              { id: 'p1-u2-t4-s1', title: 'Format and styles of referencing', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u2-t5',
            title: 'Application of ICT in research',
            type: 'topic'
          },
          {
            id: 'p1-u2-t6',
            title: 'Research ethics',
            type: 'topic'
          }
        ]
      },
      {
        id: 'p1-u3',
        title: 'III. Comprehension',
        type: 'unit',
        children: [
          {
            id: 'p1-u3-t1',
            title: 'Comprehension',
            type: 'topic',
            children: [
              { id: 'p1-u3-t1-s1', title: 'A passage of text be given. Questions be asked from the passage to be answered.', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p1-u4',
        title: 'IV. Communication',
        type: 'unit',
        children: [
          {
            id: 'p1-u4-t1',
            title: 'Communication',
            type: 'topic',
            children: [
              { id: 'p1-u4-t1-s1', title: 'Meaning, types, and characteristics of communication', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u4-t2',
            title: 'Effective communication',
            type: 'topic',
            children: [
              { id: 'p1-u4-t2-s1', title: 'Verbal and Non-verbal, Inter-Cultural and group communications, Classroom communication', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u4-t3',
            title: 'Barriers to effective communication',
            type: 'topic'
          },
          {
            id: 'p1-u4-t4',
            title: 'Mass-Media and Society',
            type: 'topic'
          }
        ]
      },
      {
        id: 'p1-u5',
        title: 'V. Mathematical Reasoning and Aptitude',
        type: 'unit',
        children: [
          {
            id: 'p1-u5-t1',
            title: 'Types of reasoning',
            type: 'topic'
          },
          {
            id: 'p1-u5-t2',
            title: 'Number series, Letter series, Codes, and Relationships',
            type: 'topic'
          },
          {
            id: 'p1-u5-t3',
            title: 'Mathematical Aptitude',
            type: 'topic',
            children: [
              { id: 'p1-u5-t3-s1', title: 'Fraction, Time & Distance, Ratio, Proportion and Percentage, Profit and Loss, Interest and Discounting, Averages etc.', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p1-u6',
        title: 'VI. Logical Reasoning',
        type: 'unit',
        children: [
          {
            id: 'p1-u6-t1',
            title: 'Understanding the structure of arguments',
            type: 'topic',
            children: [
              { id: 'p1-u6-t1-s1', title: 'argument forms, structure of categorical propositions, Mood and Figure, Formal and Informal fallacies, Uses of language, Connotations and denotations of terms, Classical square of opposition', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u6-t2',
            title: 'Evaluating and distinguishing deductive and inductive reasoning',
            type: 'topic'
          },
          {
            id: 'p1-u6-t3',
            title: 'Analogies',
            type: 'topic'
          },
          {
            id: 'p1-u6-t4',
            title: 'Venn diagram',
            type: 'topic',
            children: [
              { id: 'p1-u6-t4-s1', title: 'Simple and multiple use for establishing validity of arguments', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u6-t5',
            title: 'Indian Logic',
            type: 'topic',
            children: [
              { id: 'p1-u6-t5-s1', title: 'Means of knowledge', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u6-t6',
            title: 'Pramanas',
            type: 'topic',
            children: [
              { id: 'p1-u6-t6-s1', title: 'Pratyaksha (Perception), Anumana (Inference), Upamana (Comparison), Shabda (Verbal testimony), Arthapatti (Implication) and Anupalabdhi (Non-apprehension)', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u6-t7',
            title: 'Structure and kinds of Anumana (inference)',
            type: 'topic',
            children: [
              { id: 'p1-u6-t7-s1', title: 'Vyapti (invariable relation), Hetvabhasas (fallacies of inference)', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p1-u7',
        title: 'VII. Data Interpretation',
        type: 'unit',
        children: [
          {
            id: 'p1-u7-t1',
            title: 'Sources, acquisition, and classification of Data',
            type: 'topic'
          },
          {
            id: 'p1-u7-t2',
            title: 'Quantitative and Qualitative Data',
            type: 'topic'
          },
          {
            id: 'p1-u7-t3',
            title: 'Graphical representation and mapping of Data',
            type: 'topic',
            children: [
              { id: 'p1-u7-t3-s1', title: 'Bar-chart, Histograms, Pie-chart, Table-chart and Line-chart', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u7-t4',
            title: 'Data Interpretation',
            type: 'topic'
          },
          {
            id: 'p1-u7-t5',
            title: 'Data and Governance',
            type: 'topic'
          }
        ]
      },
      {
        id: 'p1-u8',
        title: 'VIII. Information and Communication Technology (ICT)',
        type: 'unit',
        children: [
          {
            id: 'p1-u8-t1',
            title: 'ICT',
            type: 'topic',
            children: [
              { id: 'p1-u8-t1-s1', title: 'General abbreviations and terminology', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u8-t2',
            title: 'Basics of Internet, Intranet, E-mail, Audio and Video-conferencing',
            type: 'topic'
          },
          {
            id: 'p1-u8-t3',
            title: 'Digital initiatives in higher education',
            type: 'topic'
          },
          {
            id: 'p1-u8-t4',
            title: 'ICT and Governance',
            type: 'topic'
          }
        ]
      },
      {
        id: 'p1-u9',
        title: 'IX. People, Development and Environment',
        type: 'unit',
        children: [
          {
            id: 'p1-u9-t1',
            title: 'Development and environment',
            type: 'topic',
            children: [
              { id: 'p1-u9-t1-s1', title: 'Millennium development and Sustainable development goals', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u9-t2',
            title: 'Human and environment interaction',
            type: 'topic',
            children: [
              { id: 'p1-u9-t2-s1', title: 'Anthropogenic activities and their impacts on environment', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u9-t3',
            title: 'Environmental issues',
            type: 'topic',
            children: [
              { id: 'p1-u9-t3-s1', title: 'Local, Regional and Global; Air pollution, Water pollution, Soil pollution, Noise pollution, Waste (solid, liquid, biomedical, hazardous, electronic), Climate change and its Socio-Economic and Political dimensions', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u9-t4',
            title: 'Impacts of pollutants on human health',
            type: 'topic'
          },
          {
            id: 'p1-u9-t5',
            title: 'Natural and energy resources',
            type: 'topic',
            children: [
              { id: 'p1-u9-t5-s1', title: 'Solar, Wind, Soil, Hydro, Geothermal, Biomass, Nuclear and Forests', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u9-t6',
            title: 'Natural hazards and disasters',
            type: 'topic',
            children: [
              { id: 'p1-u9-t6-s1', title: 'Mitigation strategies', type: 'subtopic' }
            ]
          },
          {
            id: 'p1-u9-t7',
            title: 'Environmental Protection Act (1986)',
            type: 'topic',
            children: [
              { id: 'p1-u9-t7-s1', title: 'National Action Plan on Climate Change, International agreements/efforts—Montreal Protocol, Rio Summit, Convention on Biodiversity, Kyoto Protocol, Paris Agreement, International Solar Alliance', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p1-u10',
        title: 'X. Higher Education System',
        type: 'unit',
        children: [
          {
            id: 'p1-u10-t1',
            title: 'Institutions of higher learning and education in ancient India',
            type: 'topic'
          },
          {
            id: 'p1-u10-t2',
            title: 'Evolution of higher learning and research in Post Independence India',
            type: 'topic'
          },
          {
            id: 'p1-u10-t3',
            title: 'Oriental, Conventional and Non-conventional learning programmes in India',
            type: 'topic'
          },
          {
            id: 'p1-u10-t4',
            title: 'Professional, Technical and Skill Based education',
            type: 'topic'
          },
          {
            id: 'p1-u10-t5',
            title: 'Value education and environmental education',
            type: 'topic'
          },
          {
            id: 'p1-u10-t6',
            title: 'Policies, Governance, and Administration',
            type: 'topic'
          }
        ]
      }
    ]
  },
  {
    id: 'p2',
    title: 'Paper 2: Computer Science and Applications',
    type: 'unit',
    children: [
      {
        id: 'p2-u1',
        title: 'Unit-1: Discrete Structures and Optimization',
        type: 'unit',
        children: [
          {
            id: 'p2-u1-t1',
            title: 'Mathematical Logic',
            type: 'topic',
            children: [
              { id: 'p2-u1-t1-s1', title: 'Propositional and Predicate Logic, Propositional Equivalences, Normal Forms, Predicates and Quantifiers, Nested Quantifiers, and Rules of Inference', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u1-t2',
            title: 'Sets and Relations',
            type: 'topic',
            children: [
              { id: 'p2-u1-t2-s1', title: 'Set Operations, Representation and Properties of Relations, Equivalence Relations, and Partially Ordering', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u1-t3',
            title: 'Counting, Mathematical Induction and Discrete Probability',
            type: 'topic',
            children: [
              { id: 'p2-u1-t3-s1', title: 'Basics of Counting, Pigeonhole Principle, Permutations and Combinations, Inclusion-Exclusion Principle, Mathematical Induction, Probability, and Bayes Theorem', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u1-t4',
            title: 'Group Theory',
            type: 'topic',
            children: [
              { id: 'p2-u1-t4-s1', title: 'Groups, Subgroups, Semi Groups, Product and Quotients of Algebraic Structures, Isomorphism, Homomorphism, Automorphism, Rings, Integral Domains, Fields, and Applications of Group Theory', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u1-t5',
            title: 'Graph Theory',
            type: 'topic',
            children: [
              { id: 'p2-u1-t5-s1', title: 'Simple Graph, Multigraph, Weighted Graph, Paths and Circuits, Shortest Paths in Weighted Graphs, Eulerian and Hamiltonian Paths and Circuits, Planner graph, Graph Coloring, Bipartite Graphs, Trees, Prefix Codes, Tree Traversals, Spanning Trees, and Cut-Sets', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u1-t6',
            title: 'Boolean Algebra',
            type: 'topic',
            children: [
              { id: 'p2-u1-t6-s1', title: 'Boolean Functions and its Representation, and Simplifications of Boolean Functions', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u1-t7',
            title: 'Optimization',
            type: 'topic',
            children: [
              { id: 'p2-u1-t7-s1', title: 'Linear Programming, Integer Programming, Transportation and Assignment Models, and PERT-CPM', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p2-u2',
        title: 'Unit-2: Computer System Architecture',
        type: 'unit',
        children: [
          {
            id: 'p2-u2-t1',
            title: 'Digital Logic Circuits and Components',
            type: 'topic',
            children: [
              { id: 'p2-u2-t1-s1', title: 'Digital Computers, Logic Gates, Boolean Algebra, Map Simplifications, Combinational and Sequential Circuits, Flip-Flops, Integrated Circuits, Decoders, Multiplexers, Registers, Counters, and Memory Unit', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u2-t2',
            title: 'Data Representation',
            type: 'topic',
            children: [
              { id: 'p2-u2-t2-s1', title: 'Data Types, Number Systems and Conversion, Complements, Fixed and Floating Point Representation, Error Detection Codes, and Computer Arithmetic', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u2-t3',
            title: 'Register Transfer and Microoperations',
            type: 'topic',
            children: [
              { id: 'p2-u2-t3-s1', title: 'Register Transfer Language, Bus and Memory Transfers, and Arithmetic, Logic, and Shift Microoperations', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u2-t4',
            title: 'Basic Computer Organization and Design',
            type: 'topic',
            children: [
              { id: 'p2-u2-t4-s1', title: 'Stored Program Organization, Instruction Codes, Computer Registers and Instructions, Timing and Control, Instruction Cycle, Memory-Reference Instructions, Input-Output, and Interrupt', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u2-t5',
            title: 'Programming the Basic Computer',
            type: 'topic',
            children: [
              { id: 'p2-u2-t5-s1', title: 'Machine Language, Assembly Language, Assembler, Program Loops, Subroutines, and Input-Output Programming', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u2-t6',
            title: 'Microprogrammed Control',
            type: 'topic',
            children: [
              { id: 'p2-u2-t6-s1', title: 'Control Memory, Address Sequencing, and Design of Control Unit', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u2-t7',
            title: 'Central Processing Unit',
            type: 'topic',
            children: [
              { id: 'p2-u2-t7-s1', title: 'General Register Organization, Stack Organization, Instruction Formats, Addressing Modes, RISC, and CISC', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u2-t8',
            title: 'Pipeline and Vector Processing',
            type: 'topic',
            children: [
              { id: 'p2-u2-t8-s1', title: 'Parallel Processing, Pipelining, Arithmetic and Instruction Pipelines, Vector Processing, and Array Processors', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u2-t9',
            title: 'Input-Output Organization',
            type: 'topic',
            children: [
              { id: 'p2-u2-t9-s1', title: 'Peripheral Devices, Input-Output Interface, Asynchronous Data Transfer, Modes of Transfer, Priority Interrupt, DMA, and Serial Communication', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u2-t10',
            title: 'Memory Hierarchy',
            type: 'topic',
            children: [
              { id: 'p2-u2-t10-s1', title: 'Main, Auxiliary, Associative, Cache, and Virtual Memory, and Memory Management Hardware', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u2-t11',
            title: 'Multiprocessors',
            type: 'topic',
            children: [
              { id: 'p2-u2-t11-s1', title: 'Characteristics, Interconnection Structures, Interprocessor Arbitration, Communication and Synchronization, Cache Coherence, and Multicore Processors', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p2-u3',
        title: 'Unit-3: Programming Languages and Computer Graphics',
        type: 'unit',
        children: [
          {
            id: 'p2-u3-t1',
            title: 'Language Design and Translation Issues',
            type: 'topic',
            children: [
              { id: 'p2-u3-t1-s1', title: 'Concepts, Paradigms, Models, Environments, Virtual Computers, Binding Times, Syntax, Stages in Translation, and Formal Transition Models', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u3-t2',
            title: 'Elementary Data Types',
            type: 'topic',
            children: [
              { id: 'p2-u3-t2-s1', title: 'Properties of Types and Objects, and Scalar and Composite Data Types', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u3-t3',
            title: 'Programming in C',
            type: 'topic',
            children: [
              { id: 'p2-u3-t3-s1', title: 'Tokens, Identifiers, Sequence Control, Subprogram Control, Arrays, Structures, Union, String, Pointers, Functions, File Handling, Command Line Arguments, and Preprocessors', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u3-t4',
            title: 'Object Oriented Programming',
            type: 'topic',
            children: [
              { id: 'p2-u3-t4-s1', title: 'Class, Object, Instantiation, Inheritance, Encapsulation, Abstract Class, and Polymorphism', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u3-t5',
            title: 'Programming in C++',
            type: 'topic',
            children: [
              { id: 'p2-u3-t5-s1', title: 'Tokens, Variables, Constants, Operators, Control statements, Parameter Passing, Virtual Functions, Constructors, Destructors, Overloading, Templates, Exception and Event Handling, and Streams and Files', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u3-t6',
            title: 'Web Programming',
            type: 'topic',
            children: [
              { id: 'p2-u3-t6-s1', title: 'HTML, DHTML, XML, Scripting, Java, Servlets, and Applets', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u3-t7',
            title: 'Computer Graphics',
            type: 'topic',
            children: [
              { id: 'p2-u3-t7-s1', title: 'Video-Display Devices, Raster-Scan and Random-Scan Systems, Input Devices, Line Drawing Algorithms, Scan Line Polygon Fill, and Boundary/Flood-Fill', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u3-t8',
            title: '2-D Geometrical Transforms and Viewing',
            type: 'topic',
            children: [
              { id: 'p2-u3-t8-s1', title: 'Translation, Scaling, Rotation, Reflection, Shear, Matrix Representations, Composite Transforms, Viewing Pipeline, and Line/Polygon Clipping Algorithms', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u3-t9',
            title: '3-D Object Representation and Viewing',
            type: 'topic',
            children: [
              { id: 'p2-u3-t9-s1', title: 'Polygon and Quadric Surfaces, Spline Representation, Illumination Models, Polygon Rendering, and Projection Transforms', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p2-u4',
        title: 'Unit-4: Database Management Systems',
        type: 'unit',
        children: [
          {
            id: 'p2-u4-t1',
            title: 'Database System Concepts and Architecture',
            type: 'topic',
            children: [
              { id: 'p2-u4-t1-s1', title: 'Data Models, Schemas, Instances, Three-Schema Architecture, Data Independence, Languages, Interfaces, and Centralized/Client-Server Architectures', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u4-t2',
            title: 'Data Modeling',
            type: 'topic',
            children: [
              { id: 'p2-u4-t2-s1', title: 'ER Diagrams, Relational Model, Relational Algebra and Calculus, and Codd Rules', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u4-t3',
            title: 'SQL',
            type: 'topic',
            children: [
              { id: 'p2-u4-t3-s1', title: 'Data Definition/Types, Constraints, Queries, DML Statements, Views, Stored Procedures, Functions, Triggers, and SQL Injection', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u4-t4',
            title: 'Normalization and Transaction Processing',
            type: 'topic',
            children: [
              { id: 'p2-u4-t4-s1', title: 'Functional Dependencies, Query Optimization, Concurrency Control, Recovery Techniques, Object-Relational Databases, and Security', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u4-t5',
            title: 'Enhanced Data Models',
            type: 'topic',
            children: [
              { id: 'p2-u4-t5-s1', title: 'Temporal, Multimedia, Deductive, XML, Mobile, GIS, Genome, and Distributed Databases', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u4-t6',
            title: 'Data Warehousing and Data Mining',
            type: 'topic',
            children: [
              { id: 'p2-u4-t6-s1', title: 'Data Modeling, OLAP/OLTP, Association Rules, Classification, Clustering, Regression, SVM, K-Nearest Neighbour, and Social Network Analysis', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u4-t7',
            title: 'Big Data and NoSQL',
            type: 'topic',
            children: [
              { id: 'p2-u4-t7-s1', title: 'Big Data Architecture, Map-Reduce, Hadoop, HDFS, NoSQL Products, and NoSQL in Cloud', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p2-u5',
        title: 'Unit-5: System Software and Operating System',
        type: 'unit',
        children: [
          {
            id: 'p2-u5-t1',
            title: 'System Software',
            type: 'topic',
            children: [
              { id: 'p2-u5-t1-s1', title: 'Languages, Compilers, Interpreters, Loading, Linking, Relocation, Macros, and Debuggers', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u5-t2',
            title: 'Basics of Operating Systems',
            type: 'topic',
            children: [
              { id: 'p2-u5-t2-s1', title: 'Structure, Operations, Services, System Calls, and System Boot', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u5-t3',
            title: 'Process Management',
            type: 'topic',
            children: [
              { id: 'p2-u5-t3-s1', title: 'Scheduling, Interprocess Communication, Synchronization, Critical-Section Problem, Semaphores, and Threads', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u5-t4',
            title: 'CPU Scheduling and Deadlocks',
            type: 'topic',
            children: [
              { id: 'p2-u5-t4-s1', title: 'Scheduling Algorithms, Deadlock Characterization, Prevention, Avoidance, Detection, and Recovery', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u5-t5',
            title: 'Memory and Storage Management',
            type: 'topic',
            children: [
              { id: 'p2-u5-t5-s1', title: 'Paging, Segmentation, Demand Paging, Page Replacement, Thrashing, Disk Structure, Scheduling, and RAID', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u5-t6',
            title: 'File and I/O Systems',
            type: 'topic',
            children: [
              { id: 'p2-u5-t6-s1', title: 'Access Methods, Directory Structure, File-System Implementation, Allocation Methods, Free-Space Management, and I/O Hardware', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u5-t7',
            title: 'Security and Virtualization',
            type: 'topic',
            children: [
              { id: 'p2-u5-t7-s1', title: 'Protection, Access Matrix, Cryptography, Authentication, and Types of Virtual Machines', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u5-t8',
            title: 'Specific OS and Distributed Systems',
            type: 'topic',
            children: [
              { id: 'p2-u5-t8-s1', title: 'Linux, Windows, and Distributed Systems', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p2-u6',
        title: 'Unit-6: Software Engineering',
        type: 'unit',
        children: [
          {
            id: 'p2-u6-t1',
            title: 'Software Process Models',
            type: 'topic',
            children: [
              { id: 'p2-u6-t1-s1', title: 'Lifecycle, Prescriptive Models, Project Management, Agile, and Web Engineering', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u6-t2',
            title: 'Software Requirements',
            type: 'topic',
            children: [
              { id: 'p2-u6-t2-s1', title: 'Functional/Non-Functional, Elicitation, Use Cases, Analysis, and SRS Document', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u6-t3',
            title: 'Software Design',
            type: 'topic',
            children: [
              { id: 'p2-u6-t3-s1', title: 'Abstraction, Architecture, Modularity, Cohesion, Coupling, and User Interface Design', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u6-t4',
            title: 'Software Quality',
            type: 'topic',
            children: [
              { id: 'p2-u6-t4-s1', title: 'McCall’s and ISO 9126 Factors, Quality Assurance, Risk Management, and Reliability', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u6-t5',
            title: 'Estimation and Scheduling',
            type: 'topic',
            children: [
              { id: 'p2-u6-t5-s1', title: 'Sizing, Cost/Effort Estimation, COCOMO, and Time-line Charts', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u6-t6',
            title: 'Software Testing',
            type: 'topic',
            children: [
              { id: 'p2-u6-t6-s1', title: 'Verification, Validation, White-box/Black-box Testing, Unit/Integration/Regression/Stress Testing, and Alpha/Beta Testing', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u6-t7',
            title: 'Software Configuration Management',
            type: 'topic',
            children: [
              { id: 'p2-u6-t7-s1', title: 'Version Control, Reuse, Re-engineering, and Reverse Engineering', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p2-u7',
        title: 'Unit-7: Data Structures and Algorithms',
        type: 'unit',
        children: [
          {
            id: 'p2-u7-t1',
            title: 'Data Structures',
            type: 'topic',
            children: [
              { id: 'p2-u7-t1-s1', title: 'Arrays, Stacks, Queues, Linked Lists, Trees, Graphs, and Hashing', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u7-t2',
            title: 'Performance Analysis',
            type: 'topic',
            children: [
              { id: 'p2-u7-t2-s1', title: 'Time and Space Complexities, Asymptotic Notation, and Recurrence Relations', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u7-t3',
            title: 'Design Techniques',
            type: 'topic',
            children: [
              { id: 'p2-u7-t3-s1', title: 'Divide and Conquer, Dynamic Programming, Greedy Algorithms, Backtracking, and Branch and Bound', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u7-t4',
            title: 'Lower Bound Theory and Complexity',
            type: 'topic',
            children: [
              { id: 'p2-u7-t4-s1', title: 'Comparison Trees, P and NP Class Problems, and NP-completeness', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u7-t5',
            title: 'Graph and Advanced Algorithms',
            type: 'topic',
            children: [
              { id: 'p2-u7-t5-s1', title: 'BFS, DFS, Shortest Paths, Minimum Spanning Trees, Parallel Algorithms, and Approximation/Randomized Algorithms', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u7-t6',
            title: 'Selected Topics',
            type: 'topic',
            children: [
              { id: 'p2-u7-t6-s1', title: 'Number Theoretic Algorithms, Fast Fourier Transform, and String Matching', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p2-u8',
        title: 'Unit-8: Theory of Computation and Compilers',
        type: 'unit',
        children: [
          {
            id: 'p2-u8-t1',
            title: 'Theory of Computation',
            type: 'topic',
            children: [
              { id: 'p2-u8-t1-s1', title: 'Formal Language, Diagonal Argument, and Russell\'s Paradox', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u8-t2',
            title: 'Regular and Context Free Languages',
            type: 'topic',
            children: [
              { id: 'p2-u8-t2-s1', title: 'DFA/NDFA, Regular Expressions, Pumping Lemma, PDA, Context Free Grammars, and Parse Trees', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u8-t3',
            title: 'Turing Machines and Unsolvability',
            type: 'topic',
            children: [
              { id: 'p2-u8-t3-s1', title: 'Universal TM, Church-Turing Thesis, Chomsky Hierarchy, Halting Problem, and Post Correspondence Problem', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u8-t4',
            title: 'Syntax and Semantic Analysis',
            type: 'topic',
            children: [
              { id: 'p2-u8-t4-s1', title: 'Grammar Transformations, Parsing, Attribute Grammar, and Type-Checking', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u8-t5',
            title: 'Run Time and Code Generation',
            type: 'topic',
            children: [
              { id: 'p2-u8-t5-s1', title: 'Storage Organization, Activation Records, Parameter Passing, Intermediate Representations, and Code Optimization', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p2-u9',
        title: 'Unit-9: Data Communication and Computer Networks',
        type: 'unit',
        children: [
          {
            id: 'p2-u9-t1',
            title: 'Data Communication',
            type: 'topic',
            children: [
              { id: 'p2-u9-t1-s1', title: 'Modes, Signals, Bandwidth, Transmission Media, Encoding, Modulation, and Error Handling', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u9-t2',
            title: 'Network Models and Layers',
            type: 'topic',
            children: [
              { id: 'p2-u9-t2-s1', title: 'OSI and TCP/IP Reference Models, Topologies, Switching Techniques, and Network Devices', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u9-t3',
            title: 'Protocols and Addressing',
            type: 'topic',
            children: [
              { id: 'p2-u9-t3-s1', title: 'IPv4/IPv6, ARP, Routing Algorithms, TCP/UDP/SCTP, Flow/Congestion Control, and Multiple Access', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u9-t4',
            title: 'World Wide Web and Security',
            type: 'topic',
            children: [
              { id: 'p2-u9-t4-s1', title: 'URL, DNS, Email Protocols, Malwares, Cryptography, Digital Signature, and Firewalls', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u9-t5',
            title: 'Mobile Technology and Cloud',
            type: 'topic',
            children: [
              { id: 'p2-u9-t5-s1', title: 'GSM, CDMA, Mobile IP, Wireless LANs, Cloud Computing, and IoT Basics', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'p2-u10',
        title: 'Unit-10: Artificial Intelligence (AI)',
        type: 'unit',
        children: [
          {
            id: 'p2-u10-t1',
            title: 'Approaches to AI',
            type: 'topic',
            children: [
              { id: 'p2-u10-t1-s1', title: 'Turing Test, Rational Agent, State Space Representation, Heuristic Search, and Game Playing', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u10-t2',
            title: 'Knowledge Representation and Planning',
            type: 'topic',
            children: [
              { id: 'p2-u10-t2-s1', title: 'Logic, Semantic Networks, Frames, Expert Systems, STRIPS, and Hierarchical/Partial Order Planning', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u10-t3',
            title: 'NLP and Multi-Agent Systems',
            type: 'topic',
            children: [
              { id: 'p2-u10-t3-s1', title: 'Parsing Techniques, Semantic Analysis, Multi-Agent Structures, and Semantic Web', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u10-t4',
            title: 'Fuzzy Sets and Genetic Algorithms',
            type: 'topic',
            children: [
              { id: 'p2-u10-t4-s1', title: 'Fuzzification/Defuzzification, Fuzzy Rules/Inference, and Genetic Operators/Cycles', type: 'subtopic' }
            ]
          },
          {
            id: 'p2-u10-t5',
            title: 'Artificial Neural Networks (ANN)',
            type: 'topic',
            children: [
              { id: 'p2-u10-t5-s1', title: 'Supervised/Unsupervised Learning, Perceptrons, Self-Organizing Maps, and Hopfield Network', type: 'subtopic' }
            ]
          }
        ]
      }
    ]
  }
];

export function getSyllabusFlatList(): SyllabusItem[] {
  const flatList: SyllabusItem[] = [];
  const traverse = (items: SyllabusItem[]) => {
    for (const item of items) {
      flatList.push(item);
      if (item.children) {
        traverse(item.children);
      }
    }
  };
  traverse(syllabus);
  return flatList;
}

export function getSyllabusItemById(id: string): SyllabusItem | undefined {
  return getSyllabusFlatList().find(item => item.id === id);
}
