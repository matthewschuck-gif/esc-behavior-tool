// ============================================================
// BEHAVIOR INTERVENTION CENTER — app.js
// Features: 6-step tool, rapport builders, already-tried log,
// educator profile, emotion signals, save/log plans, library,
// resources, emotions hub
// ============================================================

const BASE = "https://sites.google.com/easdpa.org/behaviorcoaching/find-the-right-fit/";

// ============================================================
// STRATEGY LIST (for Already Tried picker)
// ============================================================
const ALL_STRATEGIES = [
  "2x10","Morning Greeting","Check In / Check Out","Check and Connect",
  "One on One Conferencing With Student","Positive Praise and Encouragement",
  "Reflective/Empathetic Listening","Empathy Interview","Student Consulting",
  "Sticky Note Check In","Shadow Day","Smile","High-Fives and Handshakes",
  "Positive Phone Calls","Model Positive Relationships","Brag",
  "Peer Buddy Program","Assigned Partner","Classroom Job/Responsibility",
  "Morning Meeting","Informal Classroom Circles","The Peace Table",
  "Success Jar","Mantra","Whisper Wish","Personalized Notes At Desk",
  "Kudos","Student Survey","Help Offered Survey","Empathetic Listening",
  "Active Listening","Impromptu Conferences","Dear Future Self",
  "Letter Writing","Student Led Conferences","Responsibilities","Affirmations",
  "Daily Behavior Form","Secret Signal","Self Monitoring/Assessment",
  "Behavioral Monitoring/Tracking","Zones of Regulation","Mood Meter",
  "Planned Ignoring","Social Stories","Stoplight Cup Feedback",
  "Picture Reminder","Noise Tracker","Q-Tip","Try Again","Blurt Tokens",
  "Talking Tokens","Daily Planner","Organizational Checklist","Color Coding",
  "Color Coded Folders/Resources","Doodle Notes","Class Values","Restitution",
  "Natural Consequences","Clear Consistent Consequences","Logical Consequences",
  "Problem or Behavior Contract","Non-Dominant Hand","Specific Skills Training",
  "Social Skills Instruction","Controlled Choices","Avoid The Power Struggle",
  "I-Messages","If...Then Statements","Use Calm Neutral Tone",
  "Model Appropriate Language","Alternative Ways to Say-Language Profiler",
  "Simplify Directions","Chunking Material",
  "Alternative Ways to Complete Assignments","Help Start Assignment",
  "Jumpstart Assignments","Visual Schedule",
  "Forewarning of Changes in Schedule/Routine","Structured Routine",
  "Supervised Transitions","Redirection to Activity","Note to Teacher/Errand",
  "Proximity","Preferential Seating","Move Student to Another Area in Room",
  "Individual Work Space","Rearrangement of Classroom","Turn Desk Around",
  "Limit Items at Desk","Intermittent Incentives","Simple Rewards System",
  "Incentive Menu","Classroom Based Reward System",
  "Individualized Point Scaled System","Mystery Student","Reentry Plans",
  "Behavior Meetings with Team","Collaboration with Outside Services",
  "Counseling","In-School Suspension","Short Term Loss of Privileges",
  "Loss of Unstructured or Free Time","Relational Discipline Moves",
  "Pocket Points","The Boomerang","Sentence Stems","Choral Responses",
  "Call on Student Frequently","Community Service","Formal Circles",
  "Restorative Circles","Family Group Decision Making",
  "Victim-Offender Dialogue","High Stakes Conferencing","Schedule Adaptations",
  "Break Card","Reset Plan","Sensory/Movement Breaks","Scheduled Breaks",
  "Coping Strategies","Deep Breathing","Slow Counting to 10-Breathing Exercises",
  "Belly Breathing","Mindfulness","Stress Ball or Fidget","Sit Disk",
  "Use of Timer","Velcro on Desk","Option to Stand While Working",
  "Listen to Music","Headphones","Weighted Lap Pad","Weighted Snake/Blanket",
  "Deep Pressure","Diffuser","Room Temperature","Rest Your Eyes","Calisthenics",
  "Drinking Water","Musical Reset","Rapid Resets","Journal Writing",
  "Thich Nhat Hahn Breathing","The Fish Tank","Pulse Checks"
];

// ============================================================
// LIBRARY DATA
// ============================================================
const LIBRARY = {
  connection: {
    label:"Connection", desc:"Relationship to self, others, the work",
    color:"#5B21B6", bg:"#EDE9FE",
    strategies:[
      {name:"2x10",desc:"2 minutes of non-academic 1-on-1 conversation per day for 10 consecutive days. Student drives the topic. NOT about work or behavior."},
      {name:"Morning Greeting",desc:"Name + Eye contact + Nonverbal + Positive notice at the door. Increases engagement 20% and decreases disruptive behavior 9%."},
      {name:"Check In / Check Out",desc:"Pair a student with an adult partner to connect about their day using target behaviors, restorative questions, and active listening."},
      {name:"Check and Connect",desc:"Structured mentoring pairing students with a caring adult who monitors engagement and provides consistent support."},
      {name:"One on One Conferencing With Student",desc:"A private, structured conversation to discuss progress, needs, and next steps with the student."},
      {name:"Positive Praise and Encouragement",desc:"Effort-based and behavior-specific feedback delivered privately. Gratitude Formula: Observation + Feeling + Need + Thank you."},
      {name:"Reflective/Empathetic Listening",desc:"Active listening, perspective-taking, and unconditional acceptance to build relational trust."},
      {name:"Empathy Interview",desc:"Structured conversation to understand a student's experience and needs from their own perspective."},
      {name:"Student Consulting",desc:"Involve the student as a partner in identifying strategies and solutions for their own behavior."},
      {name:"Sticky Note Check In",desc:"Personalized sticky note messages acknowledging effort, growth, or appreciation left for the student."},
      {name:"Shadow Day",desc:"An adult follows a student through their day to better understand their experience and identify needs."},
      {name:"Smile",desc:"A consistent nonverbal that communicates welcome, warmth, and care."},
      {name:"High-Fives and Handshakes",desc:"Physical nonverbal greetings that communicate belonging and positive connection at the door."},
      {name:"Positive Phone Calls",desc:"Proactive calls home sharing genuine positive observations about a student's effort or behavior."},
      {name:"Model Positive Relationships",desc:"Educators deliberately model respectful, caring interactions to teach relationship skills."},
      {name:"Brag",desc:"Authentically celebrate student strengths and accomplishments in a community-building way."},
      {name:"Peer Buddy Program",desc:"Strategically pair students to build connection, support social skills, and foster belonging."},
      {name:"Assigned Partner",desc:"Intentionally pair a student with a positive peer for activities to reduce isolation."},
      {name:"Classroom Job/Responsibility",desc:"Meaningful roles that build connection, purpose, and a sense of value to the community."},
      {name:"Morning Meeting",desc:"Daily whole-class community-building routine: greeting, sharing, activity, and morning message."},
      {name:"Informal Classroom Circles",desc:"Low-stakes proactive circle practice to build community and normalize dialogue."},
      {name:"The Peace Table",desc:"A designated space for students to resolve conflicts using structured restorative conversation."},
      {name:"Success Jar",desc:"A shared collection of student successes and positive moments celebrated as a class community."},
      {name:"Mantra",desc:"A brief personalized positive statement a student repeats to build self-worth and de-escalate."},
      {name:"Whisper Wish",desc:"A quiet, private positive statement delivered discretely to a student to build connection."},
      {name:"Personalized Notes At Desk",desc:"A personalized written note at a student's desk before they arrive as a Belonging Cue."},
      {name:"Kudos",desc:"Structured acknowledgment of a specific positive action a student took."},
      {name:"Student Survey",desc:"Gather student perspective on experience, interests, and needs."},
      {name:"Help Offered Survey",desc:"Survey students on interests and expertise so peers can access each other's strengths."},
      {name:"Empathetic Listening",desc:"Listening without judgment, validating feelings, and avoiding quick fixes."},
      {name:"Active Listening",desc:"Body language, reflection, and clarifying questions showing a student their voice matters."},
      {name:"Impromptu Conferences",desc:"Brief unplanned check-ins to maintain connection."},
      {name:"Dear Future Self",desc:"Letter-writing activity where students write to their future self, building identity and hope."},
      {name:"Letter Writing",desc:"Students write letters to trusted adults or peers to process feelings."},
      {name:"Student Led Conferences",desc:"Students lead discussions about their own progress, goals, and learning."},
      {name:"Responsibilities",desc:"Elevate struggling students to leadership roles. SACRED: never taken away, never a reward or punishment."},
      {name:"Affirmations",desc:"Positive self-talk through mantras, totems (meaningful objects), or mirrors."},
      {name:"Daily Behavior Form",desc:"Structured daily tracking form shared between school and home."}
    ]
  },
  awareness: {
    label:"Awareness", desc:"Recognition that the behavior is happening",
    color:"#14532D", bg:"#DCFCE7",
    strategies:[
      {name:"Secret Signal",desc:"Co-created nonverbal signal between adult and student for redirection without public shame. Two-way."},
      {name:"Self Monitoring/Assessment",desc:"Students monitor a specific target behavior using checklists, timers, or journals with educator feedback."},
      {name:"Behavioral Monitoring/Tracking",desc:"Systematic observation and recording of target behaviors to identify patterns and measure progress."},
      {name:"Zones of Regulation",desc:"Curriculum teaching students to identify emotional states using color-coded zones and apply matching strategies."},
      {name:"Mood Meter",desc:"Quadrant-based emotional check-in tool: Green=calm, Blue=sad, Yellow=anxious, Red=angry."},
      {name:"Planned Ignoring",desc:"Intentionally withholding attention from minor attention-seeking behaviors."},
      {name:"Social Stories",desc:"Personalized short stories describing a social situation and appropriate responses."},
      {name:"Stoplight Cup Feedback",desc:"Red/yellow/green cups signal emotional state or understanding level to the teacher discretely."},
      {name:"Picture Reminder",desc:"A personal photo placed accessibly to ground a student and remind them of something meaningful."},
      {name:"Q-Tip",desc:"Visual reminder to Quit Taking It Personally — helps reframe reactions."},
      {name:"Try Again",desc:"Calm, non-punitive redirection giving the student an opportunity to practice the expected behavior."},
      {name:"Blurt Tokens",desc:"Tokens students manage when calling out — builds self-awareness of impulsive verbal behaviors."},
      {name:"Talking Tokens",desc:"Physical tokens providing structured participation while building self-monitoring skills."},
      {name:"Daily Planner",desc:"Structured organizational tool to build awareness of tasks, deadlines, and routines."},
      {name:"Organizational Checklist",desc:"Visual step-by-step list helping students manage materials, tasks, and routines independently."},
      {name:"Color Coding",desc:"Consistent color systems helping students organize materials and expectations visually."},
      {name:"Color Coded Folders/Resources",desc:"Assign colors to subjects or categories to support organization."},
      {name:"Doodle Notes",desc:"Allow sketching or doodling while listening to improve focus and retention."},
      {name:"Class Values",desc:"Co-created community agreements building shared awareness of expectations."},
      {name:"Restitution",desc:"Restorative process where students make things right after a behavior."},
      {name:"Natural Consequences",desc:"Allow logical, naturally occurring outcomes of behavior to teach cause-and-effect."},
      {name:"Clear Consistent Consequences",desc:"Transparent, predictable consequences applied consistently."},
      {name:"Logical Consequences",desc:"Consequences directly related to the behavior, connecting actions to outcomes."},
      {name:"Problem or Behavior Contract",desc:"Co-authored written agreement outlining specific behavior goals and accountability."},
      {name:"Non-Dominant Hand",desc:"Using non-dominant hand interrupts automatic behaviors and builds self-awareness."}
    ]
  },
  skills: {
    label:"Skills", desc:"Specific social, behavioral, academic training",
    color:"#1E3A8A", bg:"#DBEAFE",
    strategies:[
      {name:"Specific Skills Training",desc:"Explicit instruction in a lagging skill: instruction + modeling + role play + transference + continuous feedback. NOT one-and-done."},
      {name:"Social Skills Instruction",desc:"Targeted teaching of social skills using the Core Components with opportunities for authentic transfer."},
      {name:"Controlled Choices",desc:"Offer two acceptable options to give agency while maintaining structure."},
      {name:"Avoid The Power Struggle",desc:"Relational discipline moves, calm tone, and de-escalation language prevent win/lose confrontations."},
      {name:"I-Messages",desc:"Communicate impact using When I see/hear ___ I feel ___ because ___ to avoid blame."},
      {name:"If...Then Statements",desc:"Clear conditional language communicating expectations and natural outcomes calmly."},
      {name:"Use Calm Neutral Tone",desc:"Steady, regulated voice tone during behavioral interactions to avoid escalation."},
      {name:"Model Appropriate Language",desc:"Explicitly demonstrate the words, tone, and phrases expected in a given situation."},
      {name:"Alternative Ways to Say-Language Profiler",desc:"Teach students alternative words and phrases to express needs and disagreement appropriately."},
      {name:"Simplify Directions",desc:"Break multi-step directions into single steps delivered one at a time."},
      {name:"Chunking Material",desc:"Divide tasks into smaller manageable portions to reduce overwhelm."},
      {name:"Alternative Ways to Complete Assignments",desc:"Flexible formats (oral, visual, digital) for demonstrating knowledge."},
      {name:"Help Start Assignment",desc:"Provide the first step with the student to reduce initiation difficulty."},
      {name:"Jumpstart Assignments",desc:"Begin the assignment together to break through the barrier of starting."},
      {name:"Visual Schedule",desc:"Displayed daily schedule giving students predictability and reducing transition anxiety."},
      {name:"Forewarning of Changes in Schedule/Routine",desc:"Advance notice of schedule changes to reduce anxiety."},
      {name:"Structured Routine",desc:"Consistent, predictable routines that reduce cognitive load and give students safety."},
      {name:"Supervised Transitions",desc:"Additional structure and adult support during transition times."},
      {name:"Redirection to Activity",desc:"Redirect attention toward a structured task to interrupt an escalating behavior."},
      {name:"Note to Teacher/Errand",desc:"Send a student on a purposeful errand for a movement break and reset."},
      {name:"Proximity",desc:"Move physically closer as a quiet, noninvasive redirection."},
      {name:"Preferential Seating",desc:"Strategically place students to minimize distractions and support focus."},
      {name:"Move Student to Another Area in Room",desc:"Relocate within the classroom to improve focus or reduce triggers."},
      {name:"Individual Work Space",desc:"A designated private work area to reduce stimulation and support independent focus."},
      {name:"Rearrangement of Classroom",desc:"Reorganize the physical space to reduce triggers or change the relational dynamic."},
      {name:"Turn Desk Around",desc:"Reposition a desk to reduce visual distractions and support independent work."},
      {name:"Limit Items at Desk",desc:"Reduce materials at a desk to minimize distraction and improve organization."},
      {name:"Intermittent Incentives",desc:"Randomly deliver intrinsic experience-based incentives when expectations are met. Must be random."},
      {name:"Simple Rewards System",desc:"Straightforward point or token system tied to specific observable behaviors."},
      {name:"Incentive Menu",desc:"Student-selected list of preferred activities or experiences earned by meeting goals."},
      {name:"Classroom Based Reward System",desc:"Whole-class or individual motivation system using points, tokens, or charts."},
      {name:"Individualized Point Scaled System",desc:"Tiered point system tailored to an individual student's specific goals."},
      {name:"Mystery Student",desc:"Secret student earns a reward for the whole class. Identity not revealed unless goal is met."},
      {name:"Reentry Plans",desc:"Structured plan for a student returning after suspension, crisis, or extended absence."},
      {name:"Behavior Meetings with Team",desc:"Structured team meetings to share data, align strategies, and coordinate response."},
      {name:"Collaboration with Outside Services",desc:"Engage community agencies or specialists for wraparound support."},
      {name:"Counseling",desc:"1:1, small group, or SAP-based counseling with a trusted school professional."},
      {name:"In-School Suspension",desc:"Structured, supervised alternative to out-of-school suspension."},
      {name:"Short Term Loss of Privileges",desc:"Temporary removal of a specific privilege directly related to the behavior."},
      {name:"Loss of Unstructured or Free Time",desc:"Unstructured time redirected to complete unfinished work or reflect on behavior."},
      {name:"Relational Discipline Moves",desc:"Graduated sequence: extended eye contact to nonverbal cue to quiet verbal to whole-class redirect."},
      {name:"Pocket Points",desc:"Quiet teacher-to-student incentive system where points are delivered for meeting expectations."},
      {name:"The Boomerang",desc:"Return a behavior to the student as a reflection tool: What did I just see? What does that tell you?"},
      {name:"Sentence Stems",desc:"Structured language starters helping students communicate needs and responses."},
      {name:"Choral Responses",desc:"Whole-class verbal responses to increase engagement and provide structure."},
      {name:"Call on Student Frequently",desc:"Increase positive, low-stakes interactions with a student to build engagement."},
      {name:"Community Service",desc:"Structured opportunity for a student to contribute positively to the school."},
      {name:"Formal Circles",desc:"Structured restorative circle for repairing harm, addressing conflict, or reintegrating a student."},
      {name:"Restorative Circles",desc:"Community-building or responsive circles giving all participants voice."},
      {name:"Family Group Decision Making",desc:"Collaborative process engaging family and school together in developing a plan."},
      {name:"Victim-Offender Dialogue",desc:"Facilitated restorative conversation between those harmed and those who caused harm."},
      {name:"High Stakes Conferencing",desc:"Formal structured meeting addressing serious behavior with student and stakeholders."},
      {name:"Schedule Adaptations",desc:"PASS rotation, Assigned ACT, Supervised Transitions, Mobility Plan to adjust schedule."}
    ]
  },
  regulation: {
    label:"Regulation", desc:"Identify and cope with feelings",
    color:"#78350F", bg:"#FEF3C7",
    strategies:[
      {name:"Break Card",desc:"Physical card giving BOTH teacher and student ability to initiate a break. Co-designed with ground rules and a regulation options menu. Practiced before needed."},
      {name:"Reset Plan",desc:"Three pre-planned options: (1) at seat, (2) in another section of room, (3) outside room. Used AFTER a crisis, before reflection."},
      {name:"Sensory/Movement Breaks",desc:"Scheduled or responsive breaks involving movement or sensory input."},
      {name:"Scheduled Breaks",desc:"Pre-planned breaks built into the day at times of known difficulty."},
      {name:"Coping Strategies",desc:"A personalized toolkit of strategies a student can use to manage stress or overwhelm."},
      {name:"Deep Breathing",desc:"Structured breathing exercises: 7-11 breathing, belly breathing, shape tracing. Activates the parasympathetic nervous system."},
      {name:"Slow Counting to 10-Breathing Exercises",desc:"Counting-based regulation strategies that create a pause between trigger and response."},
      {name:"Belly Breathing",desc:"Diaphragmatic breathing technique that shifts the body from stress response to calm."},
      {name:"Mindfulness",desc:"Structured present-moment awareness practices that reduce reactivity over time."},
      {name:"Stress Ball or Fidget",desc:"Handheld sensory tool providing physical input to support regulation during seated tasks."},
      {name:"Sit Disk",desc:"Inflatable wobble cushion providing sensory input and movement for students."},
      {name:"Use of Timer",desc:"Visual timer reducing anxiety about task length and supporting self-management."},
      {name:"Velcro on Desk",desc:"Textured surface under a desk for discreet tactile sensory input during class."},
      {name:"Option to Stand While Working",desc:"Allow students to stand to meet movement needs while engaged."},
      {name:"Listen to Music",desc:"Allow headphones and music to reduce auditory distractions and support regulation."},
      {name:"Headphones",desc:"Noise-reducing or music headphones to manage sensory overload or support focus."},
      {name:"Weighted Lap Pad",desc:"Weighted pad placed on the lap to provide calming deep pressure input."},
      {name:"Weighted Snake/Blanket",desc:"Weighted object draped over shoulders or lap to provide calming proprioceptive input."},
      {name:"Deep Pressure",desc:"Firm physical pressure (weighted items, compression) activating the body's calming response."},
      {name:"Diffuser",desc:"Calming scents in a designated space to support sensory regulation."},
      {name:"Room Temperature",desc:"Adjusting temperature — cooler environments tend to support regulation and focus."},
      {name:"Rest Your Eyes",desc:"Brief permission to close eyes and rest in place as a low-demand regulation reset."},
      {name:"Calisthenics",desc:"Brief structured physical exercise to release tension and provide movement-based regulation."},
      {name:"Drinking Water",desc:"Water helps metabolize cortisol. When shoulders relax after drinking, regulation has been supported."},
      {name:"Musical Reset",desc:"A specific song or musical cue as a signal to transition and reset."},
      {name:"Rapid Resets",desc:"Quick in-the-moment techniques: Tense+Release, Alphabet Soup, Stop Sign, Escape Space, Hand to Heart, Finger Thumb Switch, Thumb Drum."},
      {name:"Affirmations",desc:"Positive self-talk through mantras, totems (meaningful objects), or mirrors."},
      {name:"Journal Writing",desc:"Structured or open writing as a processing and regulation tool for thoughts and emotions."},
      {name:"Thich Nhat Hahn Breathing",desc:"Mindful breathing paired with intentional phrases to build present-moment awareness."},
      {name:"The Fish Tank",desc:"Observing a fish tank or nature imagery as a calming, attention-restoring experience."},
      {name:"Pulse Checks",desc:"Brief structured awareness tools: journal writing, unopened letter, picture reminder."},
      {name:"Zones of Regulation",desc:"Color-coded emotional state identification linked to matched regulation strategy menus."},
      {name:"Mood Meter",desc:"Quadrant-based emotional check-in tool linked to a personalized regulation strategy menu."},
      {name:"Check In / Check Out",desc:"Structured adult check-ins timed to the most challenging moments of the day."}
    ]
  }
};

// ============================================================
// RESOURCES
// ============================================================
const RESOURCES = [
  {section:"Behavior Coaching Site",items:[
    {title:"Strategies Homepage",desc:"Full hub for all behavior coaching resources.",url:"https://sites.google.com/easdpa.org/behaviorcoaching/strategies-homepage"},
    {title:"Be a Scientist",desc:"The full 6-step Educational Engagement Coaching Process.",url:"https://sites.google.com/easdpa.org/behaviorcoaching/be-a-scientist"},
    {title:"Find the Right Fit — Full Library",desc:"Complete intervention library with one-pagers for every strategy.",url:"https://sites.google.com/easdpa.org/behaviorcoaching/find-the-right-fit"},
    {title:"The Brain",desc:"Affect Script Theory, Mental Health, Trauma, Basic Needs, and Engagement.",url:"https://sites.google.com/easdpa.org/behaviorcoaching/the-brain"},
    {title:"Behavior Coaching",desc:"Direct coaching support and consultation resources.",url:"https://sites.google.com/easdpa.org/behaviorcoaching/be-a-scientist/behavior-coaching"}
  ]},
  {section:"Mental Health & Well-Being",items:[
    {title:"CASEL — Fundamentals of Mental Health & Well-Being",desc:"Research-based framework for student well-being and student well-being development.",url:"https://casel.org/fundamentals-of-sel/"},
    {title:"Character Strong Weeklies",desc:"2-3 minute videos with quick ideas to embed mental health and well-being topics.",url:"https://characterstrong.com"},
    {title:"Character Lab Tips",desc:"2-minute reads on mental health and well-being topics for students or educators.",url:"https://characterlab.org/tips-of-the-week/"},
    {title:"Greater Good Science Center",desc:"Science-based insights on wellbeing including articles and podcasts.",url:"https://greatergood.berkeley.edu"},
    {title:"Search Institute",desc:"Bank of activities filtered by time, type, age, and group size.",url:"https://www.search-institute.org"},
    {title:"Atlas of Emotions",desc:"Interactive website to explore emotions and understand our responses.",url:"http://atlasofemotions.org"},
    
    {title:"Permission to Feel — Marc Brackett",desc:"Resources on emotional literacy and the RULER approach from Yale.",url:"https://www.marcbrackett.com/permission-to-feel/"}
  ]},
  {section:"Trauma-Informed Practices",items:[
    {title:"Building a Trauma-Informed Restorative School — Joe Brummer",desc:"Framework for trauma-responsive school culture including Fight/Flight/Freeze/Fawn.",url:"https://www.joebrummer.com"},
    {title:"Trauma Responsive Educational Practices — Micere Keels",desc:"Research on trauma-informed strategies including co-regulation and relational discipline.",url:"https://press.uchicago.edu"},
    {title:"Positive Childhood Experiences (PCEs) — CDC",desc:"Research on protective factors that buffer adverse childhood experiences.",url:"https://www.cdc.gov/violenceprevention/aces/pce.html"},
    {title:"Relationship, Responsibility, and Regulation — Souers & Hall",desc:"Framework for building connection, accountability, and co-regulation.",url:"https://www.ascd.org"}
  ]},
  {section:"Restorative Practices",items:[
    {title:"IIRP — Restorative Practices",desc:"International Institute for Restorative Practices — research and training.",url:"https://www.iirp.edu"},
    {title:"Social Discipline Window — Wachtel",desc:"Working WITH people rather than TO or FOR them.",url:"https://www.iirp.edu/defining-restorative/social-discipline-window"},
    {title:"Circles — Resources",desc:"Guides for implementing community-building and restorative circles.",url:"https://sites.google.com/easdpa.org/behaviorcoaching/find-the-right-fit/informal-classroom-circles"}
  ]},
  {section:"Behavior & Classroom Management",items:[
    {title:"Intervention Central",desc:"Free tools and resources for behavior intervention.",url:"https://www.interventioncentral.org"},
    {title:"PBIS.org",desc:"Positive Behavioral Interventions and Supports — tiered framework.",url:"https://www.pbis.org"},
    {title:"When the Adults Change — Paul Dix",desc:"Adult behavior change as the lever for student behavior.",url:"https://pivotaleducation.com"},
    {title:"Atomic Habits — James Clear",desc:"Habit-building tools applicable to student self-monitoring.",url:"https://jamesclear.com"},
    {title:"Drive — Daniel Pink",desc:"Research on intrinsic motivation behind Intermittent Incentives.",url:"https://www.danpink.com/books/drive/"}
  ]},
  {section:"Regulation & Brain Science",items:[
    {title:"Rapid Resets",desc:"Quick in-the-moment regulation techniques.",url:"https://sites.google.com/easdpa.org/behaviorcoaching/find-the-right-fit/coping-strategies"},
    {title:"Emotional Regulation Strategies",desc:"Four types: Mindful Breathing, Forward-Looking, Attention-Shifting, Cognitive Reframing.",url:"https://sites.google.com/easdpa.org/behaviorcoaching/find-the-right-fit/coping-strategies"},
    {title:"Zones of Regulation",desc:"Curriculum for teaching students to identify emotional states.",url:"https://www.zonesofregulation.com"},
    {title:"Mood Meter — Yale Center for Emotional Intelligence",desc:"RULER approach research and tools for emotional literacy.",url:"https://emotionalintelligence.yale.edu/ruler"}
  ]}
];

// ============================================================
// OBSERVABLE / EMOTION MAPPING
// ============================================================
const OBS = [
  "Late or early to class","Frequently absent","Bangs on desk in frustration",
  "Having side conversations","Rough play","Off task","Out of seat",
  "Stealing/Theft","Upset/Crying","Isolated play",
  "Picked last in games/activities","Refuses to work with peers",
  "Inappropriate language or tone","Name calling",
  "Does not maintain eye contact","Complaints of boredom","Head down",
  "Hood up","Repetitive behaviors","Cheating",
  "Frequent bathroom breaks/trips to nurse","Negative self-talk",
  "Messy desk / materials","Texting / Off task with technology",
  "Unprepared for class","Always first or last to turn in work",
  "Picking nails or skin","Tapping / Fidgeting","Blames others",
  "Argues with others","Expresses instant remorse","Does not complete work",
  "Does not turn in work","Excessively asks for help/reassurance",
  "Refuses help when offered","Gives frequent excuses","Yells or screams",
  "Makes noises","Interrupts others","Stands too close to others",
  "Calls out","Touches others/Doesn't keep hands to self","Other (describe below)"
];

const EMOTION_MAP = {
  "Bangs on desk in frustration":{zone:"Yellow/Red",feel:"Frustrated or overwhelmed",bucket:"regulation"},
  "Having side conversations":{zone:"Yellow/Green",feel:"Seeking connection or stimulation",bucket:"connection"},
  "Rough play":{zone:"Yellow",feel:"High energy, seeking sensory input or connection",bucket:"regulation"},
  "Off task":{zone:"Blue/Yellow",feel:"Disconnected, bored, or anxious",bucket:"awareness"},
  "Out of seat":{zone:"Yellow",feel:"High energy, seeking movement or connection",bucket:"regulation"},
  "Upset/Crying":{zone:"Blue/Red",feel:"Sad, overwhelmed, or distressed",bucket:"regulation"},
  "Isolated play":{zone:"Blue",feel:"Withdrawn, lonely, or anxious socially",bucket:"connection"},
  "Picked last in games/activities":{zone:"Blue",feel:"Excluded, low self-worth",bucket:"connection"},
  "Refuses to work with peers":{zone:"Yellow/Blue",feel:"Anxious in social situations or feels unsafe",bucket:"skills"},
  "Inappropriate language or tone":{zone:"Yellow/Red",feel:"Frustrated, seeking power, or expressing distress",bucket:"skills"},
  "Name calling":{zone:"Yellow/Red",feel:"Seeking power or expressing hurt",bucket:"skills"},
  "Does not maintain eye contact":{zone:"Blue/Yellow",feel:"Anxious, uncomfortable, or overwhelmed",bucket:"connection"},
  "Complaints of boredom":{zone:"Blue/Yellow",feel:"Disengaged, under-stimulated, or avoidant",bucket:"connection"},
  "Head down":{zone:"Blue",feel:"Withdrawn, fatigued, or emotionally unavailable",bucket:"connection"},
  "Hood up":{zone:"Blue/Yellow",feel:"Seeking safety, privacy, or sensory comfort",bucket:"regulation"},
  "Repetitive behaviors":{zone:"Yellow",feel:"Anxious, seeking sensory regulation",bucket:"regulation"},
  "Negative self-talk":{zone:"Blue",feel:"Low self-worth, hopeless, or self-critical",bucket:"awareness"},
  "Picking nails or skin":{zone:"Yellow",feel:"Anxious, seeking sensory input or self-soothing",bucket:"regulation"},
  "Tapping / Fidgeting":{zone:"Yellow",feel:"High energy, anxious, or seeking sensory input",bucket:"regulation"},
  "Blames others":{zone:"Yellow/Red",feel:"Defensive, ashamed, or lacking ownership skills",bucket:"skills"},
  "Argues with others":{zone:"Yellow/Red",feel:"Seeking control or feeling unheard",bucket:"skills"},
  "Expresses instant remorse":{zone:"Yellow/Blue",feel:"Overwhelmed with guilt, fear of consequences",bucket:"connection"},
  "Does not complete work":{zone:"Blue/Yellow",feel:"Overwhelmed, anxious, or avoidant",bucket:"skills"},
  "Does not turn in work":{zone:"Blue/Yellow",feel:"Overwhelmed, disorganized, or ashamed",bucket:"awareness"},
  "Excessively asks for help/reassurance":{zone:"Yellow",feel:"Anxious, insecure, or seeking connection",bucket:"connection"},
  "Refuses help when offered":{zone:"Yellow/Red",feel:"Proud, defensive, or distrustful",bucket:"connection"},
  "Gives frequent excuses":{zone:"Yellow",feel:"Embarrassed, afraid of failure",bucket:"awareness"},
  "Yells or screams":{zone:"Red",feel:"Overwhelmed, dysregulated, or feeling unheard",bucket:"regulation"},
  "Makes noises":{zone:"Yellow",feel:"Seeking attention, sensory input, or anxious",bucket:"regulation"},
  "Interrupts others":{zone:"Yellow",feel:"Impulsive, excited, or seeking connection",bucket:"skills"},
  "Stands too close to others":{zone:"Yellow/Green",feel:"Seeking connection or unaware of social cues",bucket:"skills"},
  "Calls out":{zone:"Yellow",feel:"Impulsive, seeking connection, or anxious",bucket:"awareness"},
  "Touches others/Doesn't keep hands to self":{zone:"Yellow/Green",feel:"Seeking sensory input or connection",bucket:"skills"},
  "Late or early to class":{zone:"Blue/Yellow",feel:"Avoidant, anxious, or seeking adult connection",bucket:"connection"},
  "Frequently absent":{zone:"Blue",feel:"Avoidant, anxious, or experiencing significant distress",bucket:"connection"},
  "Stealing/Theft":{zone:"Yellow/Red",feel:"Seeking control, unmet needs, or connection",bucket:"skills"},
  "Cheating":{zone:"Yellow/Blue",feel:"Anxious about performance, fear of failure",bucket:"skills"},
  "Texting / Off task with technology":{zone:"Yellow/Blue",feel:"Seeking stimulation, escape, or social connection",bucket:"skills"},
  "Unprepared for class":{zone:"Blue/Yellow",feel:"Disorganized, overwhelmed, or avoidant",bucket:"awareness"},
  "Always first or last to turn in work":{zone:"Yellow/Blue",feel:"Anxious about performance or disengaged",bucket:"awareness"},
  "Frequent bathroom breaks/trips to nurse":{zone:"Yellow/Blue",feel:"Anxious, avoidant, or seeking escape from demands",bucket:"connection"},
  "Messy desk / materials":{zone:"Blue",feel:"Overwhelmed, disorganized, or lacking executive function",bucket:"skills"}
};

const FIGHT = new Set(["Bangs on desk in frustration","Having side conversations","Rough play","Inappropriate language or tone","Name calling","Blames others","Argues with others","Yells or screams","Interrupts others","Calls out","Touches others/Doesn't keep hands to self","Stealing/Theft"]);
const FLIGHT = new Set(["Late or early to class","Frequently absent","Off task","Out of seat","Head down","Hood up","Frequent bathroom breaks/trips to nurse","Texting / Off task with technology","Refuses to work with peers","Isolated play","Cheating"]);
const FREEZE = new Set(["Does not complete work","Does not turn in work","Does not maintain eye contact","Repetitive behaviors","Tapping / Fidgeting","Complaints of boredom","Negative self-talk","Picking nails or skin","Makes noises","Upset/Crying"]);
const FAWN = new Set(["Excessively asks for help/reassurance","Gives frequent excuses","Expresses instant remorse","Refuses help when offered","Unprepared for class"]);

const BUCKETS = [
  {id:"connection",label:"Connection",desc:"Relationship to self, others, the work",bg:"#EDE9FE",text:"#5B21B6",border:"#7C3AED"},
  {id:"awareness",label:"Awareness",desc:"Recognition that the behavior is happening",bg:"#DCFCE7",text:"#14532D",border:"#16A34A"},
  {id:"skills",label:"Skills",desc:"Specific social, behavioral, academic training",bg:"#DBEAFE",text:"#1E3A8A",border:"#1D4ED8"},
  {id:"regulation",label:"Regulation",desc:"Identify and cope with feelings",bg:"#FEF3C7",text:"#78350F",border:"#D97706"}
];

const SECTIONS = [
  {id:"what",num:"#1",label:"WHAT",title:"What is happening (or not happening)?",
   focus:"Focus on the concrete action you can see. Must be observable — not a judgement.",
   bg:"#DBEAFE",text:"#1E3A8A",
   questions:[
    {id:"observables",label:"Select all observable behaviors you notice",hint:"Pick everything that applies. Select Other and describe below if needed.",type:"obs"},
    {id:"describe",label:"Describe exactly what you see or hear",hint:"Specific and observable only. If you selected Other, describe it here.",type:"textarea"},
    {id:"not_happening",label:"Is there anything NOT happening that concerns you?",hint:"e.g. Not completing any written work or Not engaging with peers at all.",type:"textarea"}
  ]},
  {id:"when",num:"#2",label:"WHEN",title:"When is it happening?",
   focus:"Focus on frequency, time of day, type of task, subject area. Look for patterns.",
   bg:"#DCFCE7",text:"#14532D",
   questions:[
    {id:"frequency",label:"How often does this occur?",type:"chips",options:["First time","A few times this week","Daily","Multiple times per day","Almost every class"]},
    {id:"time_of_day",label:"What time of day?",type:"chips",options:["Morning arrival","Early class","Mid-morning","Lunch / unstructured","Afternoon class","End of day","During transitions","Throughout the day"]},
    {id:"task_type",label:"During what type of task or activity?",type:"chips",options:["Independent work","Whole group lesson","Small group","Partner work","Transitions","Unstructured / free time","Test or assessment","Any / all tasks"]},
    {id:"pattern",label:"Any patterns you have noticed?",hint:"e.g. Every Monday or After lunch or When a sub is in or Before a test",type:"textarea"}
  ]},
  {id:"who",num:"#3",label:"WHO",title:"Who is involved?",
   focus:"Focus on the relationship between the parties. Look at dynamics.",
   bg:"#EDE9FE",text:"#5B21B6",
   questions:[
    {id:"grade",label:"What grade is this student in?",type:"select",options:["Pre-K / Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"]},
    {id:"others",label:"Who is present when the behavior occurs?",type:"chips",options:["Specific peer(s)","Whole class","Teacher / me","Teaching assistant","Admin / other staff","Happens when alone","Across all settings"]},
    {id:"dynamics",label:"Describe the dynamics",hint:"e.g. Calls out only when teacher is talking or Out of seat to visit friends",type:"textarea"},
  ]},
  {id:"where",num:"#4",label:"WHERE",title:"Where is it happening?",
   focus:"Focus on the specific location the observable is happening. Look at location.",
   bg:"#FEE2E2",text:"#991B1B",
   questions:[
    {id:"location",label:"Where does this behavior occur?",type:"chips",options:["Specific classroom","Hallway","Cafeteria","Playground","Gym","Nurse's office","Transportation / bus","On school grounds","Outside of school","Multiple / all locations"]},
    {id:"location_detail",label:"Describe the environment at that location",hint:"Noise level, class size, seating arrangement, structure level.",type:"textarea"},
    {id:"safe_location",label:"Is there a location where this behavior does NOT occur?",hint:"This reveals protective environmental factors worth replicating.",type:"textarea"}
  ]},
  {id:"why",num:"#5",label:"WHY",title:"Why is it happening?",
   focus:"Focus on what the student may need. Determine the intervention bucket.",
   bg:"#F3F4F6",text:"#374151",
   questions:[
    {id:"buckets",label:"Which intervention bucket(s) does this most likely fall into?",hint:"Connection, Awareness, Skills, Regulation — select all that apply.",type:"buckets"},
    {id:"student_need",label:"What do you think this student needs most right now?",hint:"Relationship to self/others, recognition of behavior, lagging skills, or emotional regulation.",type:"textarea"},
    {id:"context",label:"Any relevant student context? (optional)",hint:"Learning needs, recent events, known diagnoses — only what is appropriate to share.",type:"textarea"}
  ]},
  {id:"how",num:"#6",label:"HOW",title:"How will we specifically meet this student's needs?",
   focus:"Focus on all variables. Put it all together: Student, Teacher, Environment.",
   bg:"#DCFCE7",text:"#14532D",
   questions:[
    {id:"teacher_fit",label:"What approaches feel manageable for you as the educator right now?",hint:"The best intervention is one you can implement consistently. Be honest about capacity.",type:"textarea"},
    {id:"env_constraints",label:"Environmental constraints or opportunities?",hint:"e.g. No TA available or Can rearrange seating or Student responds to movement",type:"textarea"},
    {id:"goal",label:"What does success look like in 2 weeks?",hint:"Describe the specific observable change you hope to see.",type:"textarea"}
  ]}
];

// ============================================================
// STATE
// ============================================================
let current = 0, data = {}, insights = {}, done = new Set();

// No educator profile persistence — fields are per-session only

// ============================================================
// EMOTION SIGNAL
// ============================================================
function updateEmotionSignal(selectedObs) {
  const signal = document.getElementById('emotionSignal');
  if (!signal) return;
  const matches = selectedObs.filter(o => EMOTION_MAP[o]);
  if (matches.length === 0) { signal.style.display = 'none'; return; }
  const zones = new Set(), feelings = [], buckets = new Set();
  matches.forEach(o => {
    const m = EMOTION_MAP[o];
    if (m) { zones.add(m.zone); feelings.push(m.feel); buckets.add(m.bucket); }
  });
  const topBucket = [...buckets][0];
  const bColors = {connection:'#5B21B6',awareness:'#14532D',skills:'#1E3A8A',regulation:'#78350F'};
  const bBgs = {connection:'#EDE9FE',awareness:'#DCFCE7',skills:'#DBEAFE',regulation:'#FEF3C7'};
  signal.style.display = 'block';
  signal.style.background = bBgs[topBucket] || '#F3F4F6';
  signal.style.border = `1.5px solid ${bColors[topBucket] || '#6B7280'}`;
  signal.innerHTML = `<div class="emotion-signal-title" style="color:${bColors[topBucket]}">&#129505; Emotional signal detected</div>
    <div style="font-size:13px;color:${bColors[topBucket]};line-height:1.6">
      <strong>Mood zone indicators:</strong> ${[...zones].join(', ')} &middot;
      <strong>May feel:</strong> ${[...new Set(feelings)].slice(0,3).join(' / ')} &middot;
      <strong>Suggested bucket:</strong> ${topBucket}
    </div>`;
}

// ============================================================
// TRAUMA DETECTION
// ============================================================
function detectTrauma(obs) {
  let f=0,fl=0,fr=0,fw=0;
  obs.forEach(o => { if(FIGHT.has(o))f++; if(FLIGHT.has(o))fl++; if(FREEZE.has(o))fr++; if(FAWN.has(o))fw++; });
  const mx = Math.max(f,fl,fr,fw);
  if (mx === 0) return null;
  if (f===mx) return {type:"Fight",desc:"The student may be engaging with a perceived threat. Avoid power struggles. Use calm neutral tone and relational discipline moves."};
  if (fl===mx) return {type:"Flight",desc:"The student may be trying to escape the perceived threat. Provide safe, predictable options and increase connection before demanding compliance."};
  if (fr===mx) return {type:"Freeze",desc:"The student may be shutting down in response to overwhelm. Reduce demands first. Use gentle check-ins and breathing before expecting engagement."};
  return {type:"Fawn",desc:"The student may be appeasing to avoid conflict. Build authentic relationship. Validate genuine effort and help student find their voice."};
}

// ============================================================
// API CALL
// ============================================================
async function callAPI(messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:2500, messages})
  });
  const j = await res.json();
  if (!res.ok) throw new Error(j.error || 'Server error');
  return j.content?.[0]?.text || '';
}

// ============================================================
// RENDER FORM
// ============================================================
function render() {
  document.getElementById('form').innerHTML = '';
  SECTIONS.forEach((s, i) => {
    const div = document.createElement('div');
    div.id = 'sec_' + s.id;
    div.className = 'card' + (i !== current && !done.has(s.id) ? ' hidden' : '');
    div.innerHTML = buildSec(s, i);
    document.getElementById('form').appendChild(div);
    initSec(s);
  });

  // After last section card, inject Rapport Builders + Already Tried panels
  const rapportPanel = document.createElement('div');
  rapportPanel.id = 'rapportPanel';
  rapportPanel.className = 'hidden';
  rapportPanel.innerHTML = buildRapportPanel();
  document.getElementById('form').appendChild(rapportPanel);

  const triedPanel = document.createElement('div');
  triedPanel.id = 'triedPanel';
  triedPanel.className = 'hidden';
  triedPanel.innerHTML = buildTriedPanel();
  document.getElementById('form').appendChild(triedPanel);

  updateSteps();
  showCurrent();
}

function buildSec(s, idx) {
  let h = `<div class="card-header">
    <div class="sec-badge" style="background:${s.bg};color:${s.text}">${s.num}: ${s.label}</div>
    <div><div class="card-title">${s.title}</div><div class="card-focus">${s.focus}</div></div>
  </div>`;
  s.questions.forEach(q => {
    h += `<div class="q"><label>${q.label}</label>`;
    if (q.hint) h += `<div class="hint">${q.hint}</div>`;
    if (q.type === 'textarea') h += `<textarea id="q_${q.id}" placeholder="Type your response here..."></textarea>`;
    else if (q.type === 'select') {
      h += `<select id="q_${q.id}"><option value="">Select grade level...</option>`;
      q.options.forEach(o => h += `<option value="${o}">${o}</option>`);
      h += `</select>`;
    } else if (q.type === 'chips') {
      h += `<div class="chip-group" id="c_${q.id}">`;
      q.options.forEach(o => h += `<div class="chip" data-v="${o}">${o}</div>`);
      h += `</div>`;
    } else if (q.type === 'obs') {
      h += `<div class="obs-grid" id="c_${q.id}">`;
      OBS.forEach(o => h += `<div class="obs-chip" data-v="${o}">${o}</div>`);
      h += `</div><div class="emotion-signal" id="emotionSignal"></div>`;
    } else if (q.type === 'buckets') {
      h += `<div class="bucket-grid" id="c_${q.id}">`;
      BUCKETS.forEach(b => h += `<div class="bucket-card" data-v="${b.id}" data-bg="${b.bg}" data-border="${b.border}" data-text="${b.text}">
        <div class="bucket-title" style="color:${b.text}">${b.label}</div>
        <div class="bucket-desc">${b.desc}</div>
      </div>`);
      h += `</div>`;
    }
    h += `</div>`;
  });
  h += `<div class="insight-box" id="ins_${s.id}"><div class="insight-label">AI coaching note</div><p class="insight-text" id="ins_t_${s.id}"></p></div>`;
  const isLast = idx === SECTIONS.length - 1;
  if (!isLast) {
    h += `<div class="btn-row"><button class="btn btn-primary" id="btn_${s.id}" onclick="submit('${s.id}', false)">
      Analyze &amp; Continue &#8250;
      <span class="dots hidden" id="d_${s.id}"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
    </button></div>`;
  } else {
    h += `<div class="btn-row"><button class="btn btn-primary" id="btn_${s.id}" onclick="submitLastStep()">
      Continue to Rapport &amp; Review &#8250;
      <span class="dots hidden" id="d_${s.id}"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
    </button></div>`;
  }
  return h;
}

// ============================================================
// RAPPORT BUILDERS PANEL
// ============================================================
function buildRapportPanel() {
  const studentCategories = [
    {id:"sports",label:"&#9917; Sports & Physical Activities",placeholder:"e.g. soccer, swimming, wrestling, dance, hiking"},
    {id:"games",label:"&#127918; Games & Technology",placeholder:"e.g. Minecraft, Roblox, card games, board games, YouTube"},
    {id:"music",label:"&#127925; Music & Entertainment",placeholder:"e.g. rap, country, specific artists, movies, TV shows"},
    {id:"interests",label:"&#127775; Topics & Interests",placeholder:"e.g. animals, cars, space, drawing, cooking, dinosaurs"},
    {id:"people",label:"&#128101; Important People & Relationships",placeholder:"e.g. close with grandma, has a dog named Max, younger sibling"},
    {id:"strengths",label:"&#127942; Strengths & Things They're Good At",placeholder:"e.g. math, building things, helping others, art, storytelling"},
    {id:"other",label:"&#128161; Anything Else Worth Knowing",placeholder:"e.g. wants to be a vet, proud of their reading growth, hates loud noises"}
  ];
  let h = `<div class="card" style="border-left:4px solid #F59E0B">
    <div class="card-header">
      <div class="sec-badge" style="background:#FEF3C7;color:#B45309">RAPPORT</div>
      <div>
        <div class="card-title">Rapport Builders</div>
        <div class="card-focus">Share what this student loves and optionally add your own interests. The AI weaves these directly into the intervention — connecting strategies to their world and finding genuine connection points between you and the student.</div>
      </div>
    </div>

    <div style="font-size:13px;font-weight:700;color:#B45309;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #FDE68A">Student Interests &amp; Hobbies</div>`;

  studentCategories.forEach(cat => {
    h += `<div class="q">
      <label>${cat.label}</label>
      <input type="text" id="rapport_${cat.id}" placeholder="${cat.placeholder}">
    </div>`;
  });

  h += `<div style="font-size:13px;font-weight:700;color:#B45309;margin-top:1.25rem;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #FDE68A;padding-top:1rem;border-top:1px solid #FDE68A">Your Interests &amp; Hobbies <span style="font-size:12px;font-weight:400;color:#D97706">(optional)</span></div>
    <div class="q">
      <div class="hint">Adding your own interests helps the AI find genuine connection points between you and this student — especially useful for 2x10 and rapport-building strategies.</div>
      <input type="text" id="rapport_educator" placeholder="e.g. hiking, fantasy football, cooking, dogs, woodworking, 90s music">
    </div>
  </div>`;
  return h;
}

// ============================================================
// ALREADY TRIED PANEL
// ============================================================
function buildTriedPanel() {
  let opts = ALL_STRATEGIES.map(s =>
    `<option value="${s}">${s}</option>`
  ).join('');

  let h = `<div class="card" style="border-left:4px solid #DC2626">
    <div class="card-header">
      <div class="sec-badge" style="background:#FEE2E2;color:#991B1B">TRIED</div>
      <div>
        <div class="card-title">What We've Already Tried</div>
        <div class="card-focus">Log strategies that have been attempted. The AI will exclude these from recommendations and suggest genuinely new approaches based on what did or didn't work.</div>
      </div>
    </div>
    <div class="q">
      <label>Pick strategies from the library that have been tried</label>
      <div class="hint">Select one and click Add. You can add notes about what happened for each.</div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <select id="triedPicker" style="flex:1;min-width:200px">
          <option value="">Select a strategy...</option>
          ${opts}
        </select>
        <button class="btn btn-sm" style="color:var(--red-mid);border-color:#FCA5A5;background:#FEF2F2;white-space:nowrap" onclick="addTriedStrategy()">+ Add Strategy</button>
      </div>
      <div id="triedList"></div>
    </div>
    <div class="q">
      <label>Anything else you've tried that's not in the library?</label>
      <div class="hint">Describe any other approaches, conversations, consequences, or supports that have been attempted.</div>
      <textarea id="triedOther" placeholder="e.g. Parent meeting was held in October, student was moved to a new seat twice, tried a daily check-in for 2 weeks but it faded out..."></textarea>
    </div>
    <div class="q" style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--gray-200)">
      <label>How long have you been working on this concern?</label>
      <div class="hint">This helps calibrate the plan — new concerns get foundational strategies; longer-standing ones get deeper, more intensive approaches.</div>
      <div class="chip-group" id="intensityChips">
        <div class="chip" data-v="new" onclick="selectIntensity(this)">New this week</div>
        <div class="chip" data-v="weeks" onclick="selectIntensity(this)">2–4 weeks</div>
        <div class="chip" data-v="months" onclick="selectIntensity(this)">1–2 months</div>
        <div class="chip sel" data-v="year" onclick="selectIntensity(this)">Most of the year</div>
      </div>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" id="btnGenerate" onclick="generatePlan()">
        Generate My Intervention Plan
        <span class="dots hidden" id="dGenerate"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
      </button>
    </div>
  </div>`;
  return h;
}

function selectIntensity(el) {
  document.querySelectorAll('#intensityChips .chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
}

function getIntensity() {
  const sel = document.querySelector('#intensityChips .chip.sel');
  const map = {
    new: 'New this week — this is an early concern, use foundational relationship and awareness strategies',
    weeks: '2–4 weeks — the behavior is establishing a pattern, begin targeted strategies alongside relationship-building',
    months: '1–2 months — this is a persistent concern, use more structured and intensive approaches',
    year: 'Most of the year — this is a deeply established pattern, use intensive multi-component approaches and consider team escalation'
  };
  return sel ? map[sel.dataset.v] : map['year'];
}

// Track tried strategies
let triedStrategies = [];

function addTriedStrategy() {
  const picker = document.getElementById('triedPicker');
  const name = picker.value;
  if (!name) return;
  if (triedStrategies.find(t => t.name === name)) {
    alert('That strategy is already in the list.'); return;
  }
  triedStrategies.push({name, notes: ''});
  picker.value = '';
  renderTriedList();
}

function renderTriedList() {
  const container = document.getElementById('triedList');
  if (!container) return;
  if (triedStrategies.length === 0) {
    container.innerHTML = '';
    return;
  }
  let h = '';
  triedStrategies.forEach((t, i) => {
    h += `<div style="background:var(--gray-50);border:1px solid var(--gray-200);border-radius:8px;padding:10px 12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div style="font-size:13px;font-weight:700;color:var(--gray-800)">${t.name}</div>
        <button onclick="removeTriedStrategy(${i})" style="background:none;border:none;cursor:pointer;color:var(--gray-400);font-size:16px;line-height:1;padding:0">&times;</button>
      </div>
      <input type="text" placeholder="What happened when you tried this? (optional)" value="${t.notes}"
        onchange="updateTriedNote(${i}, this.value)"
        style="font-size:12px;padding:6px 10px;min-height:auto">
    </div>`;
  });
  container.innerHTML = h;
}

function removeTriedStrategy(i) {
  triedStrategies.splice(i, 1);
  renderTriedList();
}

function updateTriedNote(i, val) {
  if (triedStrategies[i]) triedStrategies[i].notes = val;
}

function getTriedSummary() {
  const fromLibrary = triedStrategies.map(t =>
    t.notes ? `${t.name} (tried — ${t.notes})` : `${t.name} (tried — no notes)`
  ).join('; ');
  const freeText = document.getElementById('triedOther')?.value.trim() || '';
  const parts = [];
  if (fromLibrary) parts.push(fromLibrary);
  if (freeText) parts.push(freeText);
  return parts.join('. ');
}

function getRapportSummary() {
  const fields = [
    {id:'sports', label:'Sports/Physical Activities'},
    {id:'games', label:'Games/Technology'},
    {id:'music', label:'Music/Entertainment'},
    {id:'interests', label:'Topics/Interests'},
    {id:'people', label:'Important People/Relationships'},
    {id:'strengths', label:'Strengths'},
    {id:'other', label:'Other'}
  ];
  return fields
    .map(f => {
      const v = document.getElementById('rapport_'+f.id)?.value.trim();
      return v ? `${f.label}: ${v}` : '';
    })
    .filter(Boolean)
    .join(' | ');
}

function getEducatorInterests() {
  return document.getElementById('rapport_educator')?.value.trim() || '';
}

// ============================================================
// INIT SECTION INTERACTIVITY
// ============================================================
function initSec(s) {
  s.questions.forEach(q => {
    if (q.type === 'chips' || q.type === 'obs') {
      const c = document.getElementById('c_' + q.id); if (!c) return;
      const cls = q.type === 'obs' ? 'obs-chip' : 'chip';
      c.querySelectorAll('.' + cls).forEach(el => el.addEventListener('click', () => {
        el.classList.toggle('sel');
        if (q.type === 'obs') {
          const sel = [...c.querySelectorAll('.obs-chip.sel')].map(e => e.dataset.v);
          updateEmotionSignal(sel);
        }
      }));
    } else if (q.type === 'buckets') {
      const c = document.getElementById('c_' + q.id); if (!c) return;
      c.querySelectorAll('.bucket-card').forEach(el => el.addEventListener('click', () => {
        const on = el.classList.toggle('sel');
        el.style.background = on ? el.dataset.bg : '';
        el.style.borderColor = on ? el.dataset.border : '';
      }));
    }
  });
}

// ============================================================
// FORM HELPERS
// ============================================================
function getVal(id) { const e = document.getElementById('q_' + id); return e ? e.value.trim() : ''; }
function getChips(id) { const c = document.getElementById('c_' + id); if (!c) return []; return [...c.querySelectorAll('.chip.sel,.obs-chip.sel')].map(e => e.dataset.v); }
function getBuckets(id) { const c = document.getElementById('c_' + id); if (!c) return []; return [...c.querySelectorAll('.bucket-card.sel')].map(e => e.dataset.v); }

function collect(sid) {
  const s = SECTIONS.find(x => x.id === sid), d = {};
  s.questions.forEach(q => {
    if (q.type === 'chips' || q.type === 'obs') d[q.id] = getChips(q.id);
    else if (q.type === 'buckets') d[q.id] = getBuckets(q.id);
    else d[q.id] = getVal(q.id);
  });
  return d;
}

function sumSection(sid, d) {
  const s = SECTIONS.find(x => x.id === sid);
  return s.questions.map(q => {
    const v = Array.isArray(d[q.id]) ? d[q.id].join(', ') : d[q.id];
    return v ? `${q.label}: ${v}` : '';
  }).filter(Boolean).join('\n');
}

function fullSummary() {
  return SECTIONS.map(s => {
    const d = data[s.id]; if (!d) return '';
    return `=== ${s.num} ${s.title} ===\n${sumSection(s.id, d)}`;
  }).join('\n\n');
}

// ============================================================
// STEP NAVIGATION
// ============================================================
function showCurrent() {
  SECTIONS.forEach((s, i) => {
    const el = document.getElementById('sec_' + s.id); if (!el) return;
    if (i === current) { el.classList.remove('hidden'); setTimeout(() => el.scrollIntoView({behavior:'smooth',block:'start'}), 100); }
    else if (!done.has(s.id)) el.classList.add('hidden');
  });
  // Show rapport/tried panels only after all 6 steps done
  const rapportPanel = document.getElementById('rapportPanel');
  const triedPanel = document.getElementById('triedPanel');
  if (done.size === SECTIONS.length) {
    if (rapportPanel) rapportPanel.classList.remove('hidden');
    if (triedPanel) triedPanel.classList.remove('hidden');
    setTimeout(() => rapportPanel?.scrollIntoView({behavior:'smooth',block:'start'}), 100);
  } else {
    if (rapportPanel) rapportPanel.classList.add('hidden');
    if (triedPanel) triedPanel.classList.add('hidden');
  }
}

function updateSteps() {
  const labels = ['What','When','Who','Where','Why','How'];
  document.getElementById('stepRow').innerHTML = SECTIONS.map((s, i) => {
    let cls = 'step';
    if (done.has(s.id)) cls += ' done';
    else if (i === current) cls += ' active';
    return `<div class="${cls}"><span class="step-num">${done.has(s.id) ? '&#10003;' : i+1}</span>${s.num} ${labels[i]}</div>`;
  }).join('');
  const pct = Math.round(done.size / SECTIONS.length * 100);
  document.getElementById('pbar').style.width = pct + '%';
  const curr = SECTIONS[current];
  document.getElementById('pbarLabel').textContent = done.size === SECTIONS.length
    ? 'All 6 steps complete — add rapport builders and review what you\'ve tried below'
    : `Step ${current+1} of 6 — ${curr ? curr.title : ''}`;
}

// ============================================================
// SUBMIT STEPS
// ============================================================
async function submit(sid, isFinal) {
  const d = collect(sid); data[sid] = d;
  const btn = document.getElementById('btn_' + sid), dots = document.getElementById('d_' + sid);
  btn.disabled = true; dots.classList.remove('hidden');
  const sum = sumSection(sid, d);
  try {
    const sec = SECTIONS.find(s => s.id === sid);
    const txt = await callAPI([{role:'user',content:`You are a supportive Behavior Coaching specialist using the Be a Scientist framework. The educator just completed step ${sec.num} ${sec.title}.\n\nResponses:\n${sum}\n\nAll data so far:\n${JSON.stringify(data)}\n\nWrite a 2-3 sentence coaching note. Acknowledge what they shared, name one specific insight this step reveals, and note what the next step will clarify. Be warm, trauma-informed, and practical. Do NOT recommend interventions yet.`}]);
    insights[sid] = txt;
    document.getElementById('ins_t_' + sid).textContent = txt;
    document.getElementById('ins_' + sid).style.display = 'block';
    done.add(sid); current++;
    await new Promise(r => setTimeout(r, 400));
    btn.disabled = false; dots.classList.add('hidden');
    updateSteps(); showCurrent();
  } catch(e) {
    btn.disabled = false; dots.classList.add('hidden');
    showError(e.message);
  }
}

async function submitLastStep() {
  // Submit step 6, then reveal rapport/tried panels instead of generating
  const sid = SECTIONS[SECTIONS.length - 1].id;
  const d = collect(sid); data[sid] = d;
  const btn = document.getElementById('btn_' + sid), dots = document.getElementById('d_' + sid);
  btn.disabled = true; dots.classList.remove('hidden');
  const sum = sumSection(sid, d);
  try {
    const sec = SECTIONS[SECTIONS.length - 1];
    const txt = await callAPI([{role:'user',content:`You are a supportive Behavior Coaching specialist. The educator just completed the final step ${sec.num} ${sec.title}.\n\nResponses:\n${sum}\n\nAll data collected:\n${JSON.stringify(data)}\n\nWrite a warm 2-3 sentence coaching note acknowledging what they shared. Note that the educator is now moments away from generating a personalized plan. Mention they can add the student's interests and log any previous strategies before generating for the most personalized output.`}]);
    insights[sid] = txt;
    document.getElementById('ins_t_' + sid).textContent = txt;
    document.getElementById('ins_' + sid).style.display = 'block';
    done.add(sid);
    await new Promise(r => setTimeout(r, 400));
    btn.disabled = false; dots.classList.add('hidden');
    updateSteps(); showCurrent();
  } catch(e) {
    btn.disabled = false; dots.classList.add('hidden');
    showError(e.message);
  }
}

// ============================================================
// GENERATE PLAN
// ============================================================
async function generatePlan() {
  const btn = document.getElementById('btnGenerate');
  const dots = document.getElementById('dGenerate');
  btn.disabled = true; dots.classList.remove('hidden');

  const observables = data.what?.observables || [];
  const traumaR = detectTrauma(observables);
  const emotionSignals = observables.filter(o => EMOTION_MAP[o])
    .map(o => `${o}: ${EMOTION_MAP[o].feel} (${EMOTION_MAP[o].zone} zone)`).join('; ');

  const rapportSummary = getRapportSummary();
  const teacherInterests = getEducatorInterests();
  const triedSummary = getTriedSummary();
  const intensity = getIntensity();
  const teacherName = 'Educator';
  const teacherBuilding = '';

  const KNOWLEDGE = `STRATEGY LIBRARY:

CONNECTION: 2x10 (2 min non-academic conversation daily for 10 days — student drives topic, NOT about work or behavior), Morning Greeting (Name+Eye contact+Nonverbal+Positive), Check In/Check Out, Responsibilities (SACRED — never taken away, never a reward or punishment), Peer Buddy, Classroom Job, Morning Meeting, Circles, Affirmations, Empathy Interview, Student Consulting, Sticky Note Check In, Positive Praise (effort-based + behavior-specific, Gratitude Formula: When I see + I feel + because + Thank you), Shadow Day, Smile, Personalized Notes At Desk.

AWARENESS: Secret Signal (co-created, discrete, two-way — student can also initiate), Self-Monitoring (target behavior defined, timed intervals, feedback loop), Mood Meter (Green=calm, Blue=sad, Yellow=anxious, Red=angry, linked to regulation menu), Zones of Regulation, Behavioral Monitoring/Tracking, Blurt Tokens, Talking Tokens, Daily Planner, Organizational Checklist, Color Coding, Class Values, Natural Consequences, Clear Consistent Consequences, Logical Consequences, Behavior Contract, Restitution, Planned Ignoring.

SKILLS: Specific Skills Training (explicit instruction + modeling + role play + transference + continuous feedback — NOT one and done), Social Skills Instruction, Controlled Choices, Avoid Power Struggle, I-Messages, If-Then Statements, Calm Neutral Tone, Simplify Directions, Chunking Material, Alternative Ways to Complete Assignments, Help Start/Jumpstart Assignments, Visual Schedule, Forewarning of Changes, Structured Routine, Supervised Transitions, Preferential Seating, Environmental Modifications (rows=independent, clusters=collaboration, pairs=connection, circle=community), Relational Discipline Moves (eye contact to nonverbal cue to quiet verbal to whole-class redirect), Intermittent Incentives (random, experience-based), Community Systems (Mystery Student, Good Behavior Game), Counseling/SAP, Schedule Adaptations.

REGULATION: Break Card (co-designed two-way, menu of options, practice before needed), Reset Plan (3 options: seat/room/outside — used AFTER crisis before reflection), Breathing Techniques (7-11, belly breathing, Rapid Resets: Tense+Release/Alphabet Soup/Stop Sign/Escape Space/Hand to Heart), Sensory/Movement Breaks, Fidgets, Weighted Items, Headphones, Music, Visual Timer, Mood Meter, Affirmations, Chill-Out options (seat: breathing/fidget/headphones/journal; room: sensory corner/movement; outside: walk/gym/errand/mentor/trusted adult).

TRAUMA LENS: Fight = avoid power struggles, calm neutral tone. Flight = connection before compliance, safe exits. Freeze = reduce demands, gentle check-ins, breathing. Fawn = authentic relationship, validate effort, help find voice. ALL = Social Discipline Window: work WITH not TO or FOR.`;

  try {
    const response = await callAPI([{role:'user',content:`You are an Behavior Coaching specialist. An educator completed all 6 steps of Be a Scientist AND provided additional context. Generate a deeply personalized intervention plan.

FULL OBSERVATION:
${fullSummary()}

COACHING NOTES:
${Object.entries(insights).map(([k,v]) => `${k}: ${v}`).join('\n')}

TRAUMA RESPONSE: ${traumaR ? `${traumaR.type} — ${traumaR.desc}` : 'None detected'}

EMOTION SIGNALS: ${emotionSignals || 'None'}

EDUCATOR: ${teacherName} at ${teacherBuilding}
EDUCATOR INTERESTS/HOBBIES: ${teacherInterests || 'Not provided'}

STUDENT RAPPORT BUILDERS (interests, hobbies, strengths):
${rapportSummary || 'Not provided'}

COACHING INTENSITY: ${intensity}

WHAT HAS ALREADY BEEN TRIED (EXCLUDE THESE FROM PRIMARY RECOMMENDATIONS):
${triedSummary || 'Nothing logged — this may be a first attempt at formal intervention'}

${KNOWLEDGE}

CRITICAL PERSONALIZATION INSTRUCTIONS:
1. If rapport builders are provided, weave the student's specific interests into HOW strategies are implemented. For example: if the student loves soccer, the 2x10 should be about soccer; if they love Minecraft, use it in social stories; if they love animals, tie responsibilities to caring for the classroom pet or plant.
2. If educator interests are provided, look for genuine connection points between the educator and student (shared interests make the 2x10 and connection strategies more natural).
3. ALL strategies listed in "already tried" MUST be excluded from the primary "try_first" recommendations. They CAN appear in "also_consider" only if the notes suggest they were not implemented with full fidelity.
4. For tried strategies that partially worked, acknowledge what worked and suggest how to build on it.
5. Work WITH the student (Social Discipline Window). Best intervention fits STUDENT, TEACHER, and ENVIRONMENT.
6. Use effort-based and behavior-specific praise only.

Respond ONLY with valid JSON, no markdown:
{"scientist_summary":"2-3 sentence Be a Scientist summary using their actual observables","trauma_type":"${traumaR ? traumaR.type : 'none'}","trauma_guidance":"${traumaR ? traumaR.desc.replace(/"/g,"'") : ''}","social_discipline_note":"1 sentence on working WITH this specific student","primary_bucket":"connection|awareness|skills|regulation","secondary_bucket":"connection|awareness|skills|regulation|none","bucket_rationale":"1-2 sentences tied to their specific data","priority":"low|moderate|high","tags":["tag1","tag2","tag3"],"rapport_connection":"1-2 sentences on how to use this student's specific interests to build connection and make interventions more relevant — be specific about the actual interests provided","educator_connection":"1 sentence on a natural connection point between educator and student interests if applicable, or a suggestion for building rapport based on educator's background","try_first":[{"name":"exact strategy name — must NOT be in the already tried list","bucket":"connection|awareness|skills|regulation","why":"rationale tied to their data","the_moves":"2-4 specific implementation steps adapted to THIS student — include their specific interests/hobbies where relevant"},{"name":"...","bucket":"...","why":"...","the_moves":"..."},{"name":"...","bucket":"...","why":"...","the_moves":"..."}],"also_consider":[{"name":"strategy name","bucket":"...","why":"brief rationale — if previously tried, note what to do differently"},{"name":"...","bucket":"...","why":"..."},{"name":"...","bucket":"...","why":"..."}],"what_to_say":"2-4 sentences the educator can say to this student tomorrow — reference their interests if possible, effort-based or behavior-specific language only","what_not_to_do":"1-2 sentences on what to avoid based on data, trauma lens, and what has already been tried","environment_fits":["specific environmental adjustment 1","specific adjustment 2","specific adjustment 3"],"two_week_trial":"Days 1-3 (start here), Days 4-7 (build on this), Days 8-14 (monitor and adjust) — specific to their context and interests","what_to_track":"exact observable data to collect and what change signals it is working","who_to_loop_in":["specific person or role 1","specific person or role 2"],"review_by":"specific recommendation referencing 6-8 consecutive school weeks"}`}]);

    let txt = response.replace(/```json|```/g, '').trim();
    const start = txt.indexOf('{'), end = txt.lastIndexOf('}');
    if (start > -1 && end > -1) txt = txt.slice(start, end + 1);
    const plan = JSON.parse(txt);
    btn.disabled = false; dots.classList.add('hidden');
    showResults(plan);
  } catch(e) {
    btn.disabled = false; dots.classList.add('hidden');
    showError(e.message);
  }
}

// ============================================================
// SHOW RESULTS
// ============================================================
function showError(msg) {
  document.getElementById('results').style.display = 'block';
  document.getElementById('results').innerHTML = `<div class="error-card"><p>Something went wrong generating the plan.</p><p>${msg || 'Please try again.'}</p><div class="btn-row" style="margin-top:1rem"><button class="btn btn-outline" onclick="startOver()">Start over</button></div></div>`;
}

function bColor(b) { const m={connection:'#5B21B6',awareness:'#14532D',skills:'#1E3A8A',regulation:'#78350F'}; return m[b]||'#374151'; }
function bBg(b) { const m={connection:'#EDE9FE',awareness:'#DCFCE7',skills:'#DBEAFE',regulation:'#FEF3C7'}; return m[b]||'#F3F4F6'; }
function slugify(n) { return n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

// Store last generated plan for save button
let _lastPlan = null;
let _lastDate = null;

function showResults(p) {
  _lastPlan = p;
  _lastDate = new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const rs = document.getElementById('results');
  rs.style.display = 'block';
  document.getElementById('form').style.display = 'none';
  setTimeout(() => rs.scrollIntoView({behavior:'smooth',block:'start'}), 100);

  const dateStr = new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const prTag = p.priority==='high'?'tag-high':p.priority==='moderate'?'tag-moderate':'tag-low';

  let h = `<div class="r-header">
    <div class="r-eyebrow">Be a Scientist &mdash; Put It All Together</div>
    <div class="r-title">Behavior Intervention Plan</div>
    <div class="r-meta">Behavior Coaching &middot; ${dateStr}</div>
    <div class="tags"><span class="tag ${prTag}">${p.priority} priority</span>${(p.tags||[]).map(t=>`<span class="tag tag-info">${t}</span>`).join('')}</div>
    <div class="r-summary">${p.scientist_summary}</div>
  </div>`;

  if (p.trauma_type && p.trauma_type !== 'none' && p.trauma_guidance) {
    h += `<div class="trauma-banner"><div class="trauma-banner-title">Trauma lens &mdash; ${p.trauma_type} response pattern detected</div><div class="trauma-banner-body">${p.trauma_guidance}</div></div>`;
  }
  if (p.social_discipline_note) {
    h += `<div class="window-banner"><div class="window-banner-title">Social Discipline Window &mdash; Work WITH, not TO or FOR</div><div class="window-banner-body">${p.social_discipline_note}</div></div>`;
  }

  // Rapport connection highlight
  if (p.rapport_connection || p.educator_connection) {
    h += `<div class="card" style="border-left:4px solid #F59E0B;background:#FFFBEB">
      <div style="font-size:13px;font-weight:700;color:#B45309;margin-bottom:8px">Rapport &amp; Connection Opportunities</div>`;
    if (p.rapport_connection) h += `<div style="font-size:13px;color:#92400E;line-height:1.7;margin-bottom:6px"><strong>Student interests in action:</strong> ${p.rapport_connection}</div>`;
    if (p.educator_connection) h += `<div style="font-size:13px;color:#92400E;line-height:1.7"><strong>Educator-student connection:</strong> ${p.educator_connection}</div>`;
    h += `</div>`;
  }

  const buckets = [p.primary_bucket];
  if (p.secondary_bucket && p.secondary_bucket !== 'none') buckets.push(p.secondary_bucket);
  h += `<div class="bucket-row">`;
  buckets.forEach(b => { h += `<div class="bucket-pill" style="background:${bBg(b)};border:1.5px solid ${bColor(b)}40"><div class="bucket-pill-title" style="color:${bColor(b)}">${b.charAt(0).toUpperCase()+b.slice(1)} bucket</div><div class="bucket-pill-body" style="color:${bColor(b)}">${p.bucket_rationale}</div></div>`; });
  h += `</div>`;

  h += `<div class="rcard"><div class="rcard-title">Start with these strategies &mdash; personalized to this student</div>`;
  (p.try_first||[]).forEach(s => {
    h += `<div class="int-item">
      <div class="int-name">${s.name}</div>
      <div class="int-meta">
        <span class="int-bucket-tag" style="background:${bBg(s.bucket)};color:${bColor(s.bucket)}">${s.bucket}</span>
        <a class="int-link" href="${BASE+slugify(s.name)}" target="_blank">view one-pager &#8599;</a>
      </div>
      <div class="int-why">${s.why}</div>
      ${s.the_moves ? `<div class="int-moves"><strong>How to start with this student:</strong> ${s.the_moves}</div>` : ''}
    </div>`;
  });
  h += `</div>`;

  h += `<div class="rcard"><div class="rcard-title">Also consider</div>`;
  (p.also_consider||[]).forEach(s => {
    h += `<div class="int-item">
      <div class="int-name">${s.name}</div>
      <div class="int-meta">
        <span class="int-bucket-tag" style="background:${bBg(s.bucket)};color:${bColor(s.bucket)}">${s.bucket}</span>
        <a class="int-link" href="${BASE+slugify(s.name)}" target="_blank">view one-pager &#8599;</a>
      </div>
      <div class="int-why">${s.why}</div>
    </div>`;
  });
  h += `</div>`;

  h += `<div class="rcard"><div class="rcard-title">What to say to this student</div><div class="rcard-body" style="font-style:italic;font-size:14px">"${p.what_to_say}"</div></div>`;
  if (p.what_not_to_do) h += `<div class="warning-card"><div class="warning-card-title">What NOT to do with this student</div><div class="warning-card-body">${p.what_not_to_do}</div></div>`;

  h += `<div class="rcard"><div class="rcard-title">Environmental adjustments</div><ul style="padding-left:1.4rem">`;
  (p.environment_fits||[]).forEach(t => h += `<li style="font-size:13px;color:#4B5563;margin-bottom:7px;line-height:1.6">${t}</li>`);
  h += `</ul></div>`;

  h += `<div class="trial-card"><div class="trial-title">2-Week Trial Plan &mdash; Start Here</div><div class="trial-body">${p.two_week_trial}</div></div>`;
  h += `<div class="two-col">
    <div class="rcard"><div class="rcard-title">What to track</div><div class="rcard-body">${p.what_to_track}</div></div>
    <div class="rcard"><div class="rcard-title">Who to loop in</div><ul style="padding-left:1.4rem">${(p.who_to_loop_in||[]).map(x=>`<li style="font-size:13px;color:#4B5563;margin-bottom:5px">${x}</li>`).join('')}</ul></div>
  </div>`;
  h += `<div class="review-card"><div class="review-title">Review by</div><div class="review-body">${p.review_by}</div></div>`;

  h += `<div class="action-row">
    <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
    <button class="btn btn-teal" onclick="savePlanCurrentResults()">Save to Log</button>
    <button class="btn btn-gold" onclick="goToPage('library')">Browse Strategy Library</button>
    <button class="btn btn-outline" onclick="startOver()">Start a New Observation</button>
  </div>`;

  rs.innerHTML = h;
}

// ============================================================
// SAVE & LOG
// ============================================================
function savePlanCurrentResults() {
  if (!_lastPlan) return;
  savePlanFromResults(_lastPlan, _lastDate);
}

function savePlanFromResults(plan, dateStr) {
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    const id = 'plan_' + Date.now();
    const entry = {
      id, dateStr,
      priority: plan.priority,
      summary: plan.scientist_summary,
      strategies: (plan.try_first || []).map(s => s.name),
      trauma: plan.trauma_type,
      bucket: plan.primary_bucket,
      rapport: getRapportSummary(),
      tried: getTriedSummary(),
      fullPlan: plan,
      progress: [],
      status: 'active',
      savedAt: new Date().toISOString()
    };
    logs.unshift(entry);
    localStorage.setItem('bic_logs', JSON.stringify(logs));
    updateLogBadge();
    alert('Plan saved! View and track progress in the Saved Plans tab.');
  } catch(e) { alert('Could not save plan: ' + e.message); }
}

function updateLogBadge() {
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    const badge = document.getElementById('logBadge');
    if (logs.length > 0) { badge.style.display = 'inline'; badge.textContent = logs.length; }
    else { badge.style.display = 'none'; }
  } catch(e) {}
}

function renderLogs() {
  const container = document.getElementById('logsContent');
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    if (logs.length === 0) {
      container.innerHTML = `<div class="log-empty">
        <div class="log-empty-icon">&#128203;</div>
        <div class="log-empty-title">No saved plans yet</div>
        <div class="log-empty-sub">Complete the 6-step Intervention Tool and click "Save to Log" to store plans here.<br>You can add progress notes to track what worked over time.</div>
      </div>`;
      return;
    }
    let h = '';
    logs.forEach(log => {
      const prTag = log.priority==='high'?'tag-high':log.priority==='moderate'?'tag-moderate':'tag-low';
      const statusColors = {active:'#16A34A',reviewing:'#D97706',closed:'#6B7280'};
      const statusLabels = {active:'Active',reviewing:'Under Review',closed:'Closed'};
      h += `<div class="log-card" id="log_${log.id}">
        <div class="log-card-header">
          <div>
            <div class="log-card-title">Intervention Plan &mdash; ${log.dateStr}</div>
            <div class="log-card-meta">${log.dateStr} &middot; ${log.bucket} bucket &middot;
              <span class="status-badge" style="background:${statusColors[log.status]||'#6B7280'}20;color:${statusColors[log.status]||'#6B7280'}">${statusLabels[log.status]||'Active'}</span>
            </div>
          </div>
          <span class="log-card-priority tag ${prTag}">${log.priority}</span>
        </div>
        <div class="log-card-summary">${log.summary}</div>`;

      if (log.rapport) {
        h += `<div style="font-size:12px;color:#B45309;background:#FFFBEB;border-radius:6px;padding:6px 10px;margin-bottom:8px"><strong>Rapport:</strong> ${log.rapport}</div>`;
      }
      if (log.tried) {
        h += `<div style="font-size:12px;color:#991B1B;background:#FEF2F2;border-radius:6px;padding:6px 10px;margin-bottom:8px"><strong>Tried:</strong> ${log.tried}</div>`;
      }

      h += `<div class="log-card-strategies">${(log.strategies||[]).map(s=>`<span class="log-strategy-tag" style="background:${bBg(log.bucket)};color:${bColor(log.bucket)}">${s}</span>`).join('')}</div>`;

      if (log.progress && log.progress.length > 0) {
        h += `<div class="progress-section"><div class="progress-section-title">Progress Notes</div>`;
        log.progress.forEach(p => {
          h += `<div class="progress-entry"><div class="progress-entry-date">${p.date}</div>${p.note}</div>`;
        });
        h += `</div>`;
      }

      h += `<div class="add-progress-form">
        <textarea id="note_${log.id}" placeholder="Add a progress note — what did you try? What happened? What changed?"></textarea>
        <div class="log-actions" style="margin-top:8px">
          <button class="btn btn-teal btn-sm" onclick="addProgress('${log.id}')">Add Progress Note</button>
          <button class="btn btn-primary btn-sm" onclick="goDeeper('${log.id}')">Go Deeper &#8250;</button>
          <select onchange="updateStatus('${log.id}',this.value)" style="width:auto;padding:6px 10px;font-size:12px;border-radius:8px">
            <option value="active" ${log.status==='active'?'selected':''}>Active</option>
            <option value="reviewing" ${log.status==='reviewing'?'selected':''}>Under Review</option>
            <option value="closed" ${log.status==='closed'?'selected':''}>Closed</option>
          </select>
          <button class="btn btn-sm" style="color:var(--red-mid);border-color:#FCA5A5" onclick="deleteLog('${log.id}')">Delete</button>
        </div>
      </div></div>`;
    });
    container.innerHTML = h;
  } catch(e) {
    container.innerHTML = `<div class="error-card"><p>Could not load saved plans.</p><p>${e.message}</p></div>`;
  }
}

function addProgress(id) {
  const noteEl = document.getElementById('note_' + id);
  const note = noteEl ? noteEl.value.trim() : '';
  if (!note) { alert('Please write a progress note first.'); return; }
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    const log = logs.find(l => l.id === id);
    if (!log) return;
    if (!log.progress) log.progress = [];
    log.progress.push({date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), note});
    localStorage.setItem('bic_logs', JSON.stringify(logs));
    renderLogs();
  } catch(e) { alert('Could not save note: ' + e.message); }
}

function updateStatus(id, status) {
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    const log = logs.find(l => l.id === id);
    if (log) { log.status = status; localStorage.setItem('bic_logs', JSON.stringify(logs)); }
  } catch(e) {}
}

function deleteLog(id) {
  if (!confirm('Delete this saved plan? This cannot be undone.')) return;
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    localStorage.setItem('bic_logs', JSON.stringify(logs.filter(l => l.id !== id)));
    updateLogBadge(); renderLogs();
  } catch(e) {}
}

async function goDeeper(id) {
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    const log = logs.find(l => l.id === id);
    if (!log) return;

    // Switch to tool tab and show a loading state
    goToPage('tool');
    document.getElementById('form').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').innerHTML = `<div class="card" style="text-align:center;padding:2rem">
      <div style="font-size:32px;margin-bottom:12px"></div>
      <div style="font-size:16px;font-weight:700;color:var(--purple);margin-bottom:8px">Going deeper...</div>
      <div style="font-size:13px;color:var(--gray-500);margin-bottom:1rem">Analyzing what was tried and generating a more intensive plan. This takes about 15 seconds.</div>
      <div class="dots" style="justify-content:center"><span class="dot" style="background:var(--purple)"></span><span class="dot" style="background:var(--purple)"></span><span class="dot" style="background:var(--purple)"></span></div>
    </div>`;

    const previousStrategies = (log.strategies || []).join(', ');
    const previousTried = log.tried || 'Not recorded';
    const previousRapport = log.rapport || 'Not recorded';
    const progressNotes = (log.progress || []).map(p => `${p.date}: ${p.note}`).join('\n') || 'No progress notes added';
    const originalSummary = log.summary || '';

    const KNOWLEDGE = `STRATEGY LIBRARY:
CONNECTION: 2x10, Morning Greeting, Check In/Check Out, Responsibilities (SACRED), Peer Buddy, Classroom Job, Morning Meeting, Circles, Affirmations, Empathy Interview, Student Consulting, Sticky Note Check In, Positive Praise (Gratitude Formula), Shadow Day, Empathetic Listening, Active Listening, Personalized Notes At Desk.
AWARENESS: Secret Signal (two-way), Self-Monitoring (target behavior, timed intervals), Mood Meter (Green/Blue/Yellow/Red), Zones of Regulation, Behavioral Monitoring/Tracking, Blurt/Talking Tokens, Daily Planner, Organizational Checklist, Color Coding, Class Values, Behavior Contract, Restitution, Planned Ignoring.
SKILLS: Specific Skills Training (instruction+modeling+role play+transference+feedback), Social Skills Instruction, Controlled Choices, Avoid Power Struggle, I-Messages, If-Then Statements, Calm Neutral Tone, Simplify Directions, Chunking, Alternative Assignments, Help Start/Jumpstart, Visual Schedule, Forewarning, Structured Routine, Supervised Transitions, Preferential Seating, Environmental Modifications, Relational Discipline Moves, Intermittent Incentives, Community Systems, Counseling/SAP, Schedule Adaptations, Family Group Decision Making, High Stakes Conferencing.
REGULATION: Break Card (co-designed two-way), Reset Plan (3 options, used AFTER crisis), Breathing Techniques (7-11, belly breathing, Rapid Resets), Sensory/Movement Breaks, Fidgets, Weighted Items, Headphones, Music, Visual Timer, Mood Meter, Affirmations, Chill-Out options.
TRAUMA: Fight=calm neutral tone, avoid power struggles. Flight=connection before compliance, safe exits. Freeze=reduce demands, gentle check-ins. Fawn=authentic relationship, validate effort. ALL=work WITH not TO or FOR.`;

    const response = await callAPI([{role:'user',content:`You are an Behavior Coaching specialist. An educator's previous intervention plan has not produced sufficient change and they need to go DEEPER.

ORIGINAL CONCERN:
${originalSummary}

STRATEGIES ALREADY IN THE PLAN (do not repeat these as primary recommendations):
${previousStrategies}

ALL PREVIOUS STRATEGIES TRIED (exclude from primary recommendations):
${previousTried}

RAPPORT BUILDERS ON FILE:
${previousRapport}

PROGRESS NOTES FROM EDUCATOR:
${progressNotes}

${KNOWLEDGE}

This is an escalation. Generate a deeper, more intensive plan. Assume Tier 2 intensity minimum. Focus on:
1. What the progress notes reveal about why previous strategies may not have worked
2. More structured, intensive, or team-based approaches not yet tried
3. Whether a referral, outside services, or formal team meeting is now warranted
4. Any environmental or systemic factors that may be maintaining the behavior

Respond ONLY with valid JSON no markdown:
{"escalation_summary":"2-3 sentences on what the pattern of attempts reveals and why this requires a deeper response","tier_recommendation":"Tier 2|Tier 3","tier_rationale":"1-2 sentences explaining tier recommendation","primary_bucket":"connection|awareness|skills|regulation","secondary_bucket":"connection|awareness|skills|regulation|none","bucket_rationale":"rationale","priority":"moderate|high","tags":["tag1","tag2"],"try_first":[{"name":"strategy name — must NOT be in already tried list","bucket":"connection|awareness|skills|regulation","why":"why this deeper approach is warranted now","the_moves":"3-4 specific implementation steps more intensive than previous attempts"},{"name":"...","bucket":"...","why":"...","the_moves":"..."},{"name":"...","bucket":"...","why":"...","the_moves":"..."}],"also_consider":[{"name":"strategy name","bucket":"...","why":"brief rationale"},{"name":"...","bucket":"...","why":"..."}],"what_to_say":"2-3 sentences the educator can say to this student — acknowledging the relationship while signaling a new approach","what_changed":"1-2 sentences on what must be done differently this time based on what the progress notes reveal","who_to_loop_in":["specific person or role 1","specific person or role 2","specific person or role 3"],"formal_referral":"yes|no","referral_rationale":"1 sentence on whether a formal referral or team meeting is now warranted and why","review_by":"recommendation referencing 6-8 consecutive school weeks"}`}]);

    let txt = response.replace(/```json|```/g,'').trim();
    const start = txt.indexOf('{'), end = txt.lastIndexOf('}');
    if (start > -1 && end > -1) txt = txt.slice(start, end+1);
    const plan = JSON.parse(txt);
    showDeeperResults(plan, log);
  } catch(e) {
    document.getElementById('results').innerHTML = `<div class="error-card"><p>Could not generate deeper plan.</p><p>${e.message}</p><div class="btn-row" style="margin-top:1rem"><button class="btn btn-outline" onclick="goToPage('logs')">Back to Saved Plans</button></div></div>`;
  }
}

function showDeeperResults(p, originalLog) {
  const rs = document.getElementById('results');
  const dateStr = new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const tierColor = p.tier_recommendation === 'Tier 3' ? '#DC2626' : '#D97706';
  const tierBg = p.tier_recommendation === 'Tier 3' ? '#FEE2E2' : '#FEF3C7';

  let h = `<div class="r-header" style="border-bottom-color:#DC2626">
    <div class="r-eyebrow">Going Deeper &mdash; Escalated Intervention Plan</div>
    <div class="r-title">Deeper Plan &mdash; ${dateStr}</div>
    <div class="tags">
      <span class="tag" style="background:${tierBg};color:${tierColor}">${p.tier_recommendation}</span>
      <span class="tag tag-high">${p.priority} priority</span>
      ${(p.tags||[]).map(t=>`<span class="tag tag-info">${t}</span>`).join('')}
    </div>
    <div class="r-summary">${p.escalation_summary}</div>
  </div>`;

  h += `<div class="rcard" style="border-left:4px solid ${tierColor}">
    <div class="rcard-title">Tier Recommendation</div>
    <div class="rcard-body"><strong>${p.tier_recommendation}:</strong> ${p.tier_rationale}</div>
  </div>`;

  if (p.what_changed) h += `<div class="warning-card"><div class="warning-card-title">What must be different this time</div><div class="warning-card-body">${p.what_changed}</div></div>`;

  h += `<div class="rcard"><div class="rcard-title">Deeper strategies to try now</div>`;
  (p.try_first||[]).forEach(s => {
    h += `<div class="int-item">
      <div class="int-name">${s.name}</div>
      <div class="int-meta"><span class="int-bucket-tag" style="background:${bBg(s.bucket)};color:${bColor(s.bucket)}">${s.bucket}</span><a class="int-link" href="${BASE+slugify(s.name)}" target="_blank">view one-pager &#8599;</a></div>
      <div class="int-why">${s.why}</div>
      ${s.the_moves ? `<div class="int-moves"><strong>How to start:</strong> ${s.the_moves}</div>` : ''}
    </div>`;
  });
  h += `</div>`;

  h += `<div class="rcard"><div class="rcard-title">Also consider</div>`;
  (p.also_consider||[]).forEach(s => {
    h += `<div class="int-item"><div class="int-name">${s.name}</div><div class="int-meta"><span class="int-bucket-tag" style="background:${bBg(s.bucket)};color:${bColor(s.bucket)}">${s.bucket}</span><a class="int-link" href="${BASE+slugify(s.name)}" target="_blank">view one-pager &#8599;</a></div><div class="int-why">${s.why}</div></div>`;
  });
  h += `</div>`;

  h += `<div class="rcard"><div class="rcard-title">What to say to this student now</div><div class="rcard-body" style="font-style:italic">"${p.what_to_say}"</div></div>`;

  if (p.formal_referral === 'yes') {
    h += `<div class="trauma-banner"><div class="trauma-banner-title">Formal Referral / Team Meeting Recommended</div><div class="trauma-banner-body">${p.referral_rationale}</div></div>`;
  }

  h += `<div class="rcard"><div class="rcard-title">Who to loop in now</div><ul style="padding-left:1.4rem">${(p.who_to_loop_in||[]).map(x=>`<li style="font-size:13px;color:#4B5563;margin-bottom:5px">${x}</li>`).join('')}</ul></div>`;
  h += `<div class="review-card"><div class="review-title">Review by</div><div class="review-body">${p.review_by}</div></div>`;

  h += `<div class="action-row">
    <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
    <button class="btn btn-outline" onclick="goToPage('logs')">Back to Saved Plans</button>
    <button class="btn btn-outline" onclick="startOver()">Start a New Observation</button>
  </div>`;

  rs.innerHTML = h;
}

// ============================================================
// LIBRARY RENDER
// ============================================================
// Server-synced overrides
let _overridesCache = {};

async function loadOverrides() {
  try {
    const res = await fetch('/api/overrides-get');
    if (res.ok) {
      const data = await res.json();
      _overridesCache = data.overrides || {};
    }
  } catch(e) {
    console.warn('Could not load overrides:', e.message);
    _overridesCache = {};
  }
}

function getStrategyOverrides() {
  return _overridesCache;
}

async function saveStrategyOverride(key, data) {
  _overridesCache[key] = data;
  try {
    await fetch('/api/overrides-set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: data })
    });
  } catch(e) {
    console.warn('Could not save override:', e.message);
  }
}

async function deleteStrategyOverride(key) {
  delete _overridesCache[key];
  try {
    await fetch('/api/overrides-set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: null })
    });
  } catch(e) {
    console.warn('Could not delete override:', e.message);
  }
}

function renderLibrary() {
  const c = document.getElementById('libraryContent');
  const overrides = getStrategyOverrides();
  let h = '';
  Object.entries(LIBRARY).forEach(([key, bucket]) => {
    h += `<div class="bucket-section" data-bucket="${key}">
      <div class="bucket-section-header">
        <span class="bucket-section-badge" style="background:${bucket.bg};color:${bucket.color}">${bucket.label}</span>
        <div>
          <div class="bucket-section-title" style="color:${bucket.color}">${bucket.label} Strategies</div>
          <div style="font-size:12px;color:var(--gray-500)">${bucket.desc}</div>
        </div>
      </div>
      <div class="lib-grid">`;
    bucket.strategies.forEach((s, idx) => {
      const overrideKey = `${key}_${idx}`;
      const ov = overrides[overrideKey] || {};
      const name = ov.name || s.name;
      const desc = ov.desc || s.desc;
      const customUrl = ov.url || '';
      const url = customUrl || (BASE + s.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''));
      const isEdited = !!overrides[overrideKey];

      if (isAdminMode) {
        h += `<div class="lib-card admin-card" style="border-left-color:${bucket.color};display:block" data-name="${name.toLowerCase()}" data-desc="${desc.toLowerCase()}">
          ${isEdited ? `<div style="font-size:10px;font-weight:700;color:#16A34A;margin-bottom:4px">EDITED</div>` : ''}
          <div class="lib-card-name">${name}</div>
          <div class="lib-card-desc">${desc}</div>
          <a href="${url}" target="_blank" class="lib-card-link" style="color:${bucket.color}">View one-pager &#8599;</a>
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--gray-100);display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn btn-sm" style="color:var(--purple);border-color:var(--purple);font-size:11px" onclick="openEditModal('${overrideKey}','${name.replace(/'/g,"\\'")}','${desc.replace(/'/g,"\\'")}','${url}')">Edit</button>
            ${isEdited ? `<button class="btn btn-sm" style="color:var(--red-mid);border-color:#FCA5A5;font-size:11px" onclick="resetStrategy('${overrideKey}')">Reset</button>` : ''}
          </div>
        </div>`;
      } else {
        h += `<a class="lib-card" href="${url}" target="_blank" style="border-left-color:${bucket.color}" data-name="${name.toLowerCase()}" data-desc="${desc.toLowerCase()}">
          <div class="lib-card-name">${name}</div>
          <div class="lib-card-desc">${desc}</div>
          <div class="lib-card-link" style="color:${bucket.color}">View one-pager &#8599;</div>
        </a>`;
      }
    });
    h += `</div></div>`;
  });
  c.innerHTML = h;
}

function filterLibrary(q) {
  const v = q.toLowerCase().trim();
  document.querySelectorAll('#libraryContent .lib-card').forEach(card => {
    const match = !v || card.dataset.name.includes(v) || card.dataset.desc.includes(v);
    card.style.display = match ? 'block' : 'none';
  });
  document.querySelectorAll('#libraryContent .bucket-section').forEach(sec => {
    const visible = [...sec.querySelectorAll('.lib-card')].some(c => c.style.display !== 'none');
    sec.style.display = visible ? 'block' : 'none';
  });
}

// ============================================================
// RESOURCES RENDER
// ============================================================
function renderResources() {
  const c = document.getElementById('resourcesContent');
  let h = '';
  RESOURCES.forEach(section => {
    h += `<div class="res-section"><h3>${section.section}</h3><div class="res-grid">`;
    section.items.forEach(item => {
      h += `<a class="res-card" href="${item.url}" target="_blank">
        <div class="res-card-title">${item.title}</div>
        <div class="res-card-desc">${item.desc}</div>
      </a>`;
    });
    h += `</div></div>`;
  });
  c.innerHTML = h;
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
function showPage(page, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  if (btn) btn.classList.add('active');
  if (page === 'logs') renderLogs();
  window.scrollTo({top:0,behavior:'smooth'});
}

function goToPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const idx = {tool:0,emotions:1,library:2,logs:3,resources:4}[page] || 0;
  document.querySelectorAll('.nav-tab')[idx].classList.add('active');
  if (page === 'logs') renderLogs();
  window.scrollTo({top:0,behavior:'smooth'});
}

function startOver() {
  current = 0; data = {}; insights = {}; done = new Set(); triedStrategies = [];
  _lastPlan = null; _lastDate = null;
  document.getElementById('results').style.display = 'none';
  document.getElementById('form').style.display = 'block';
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

// ============================================================
// PASSWORD GATE
// ============================================================
const SITE_PASSWORD = 'BehaviorCoach25'; // Change this to your preferred password
const ADMIN_PASSWORD = 'AdminCoach25';   // Change this to your preferred admin password
let isAdminMode = false;

function checkPassword() {
  const input = document.getElementById('pwInput').value;
  const error = document.getElementById('pwError');
  if (input === ADMIN_PASSWORD) {
    isAdminMode = true;
    document.getElementById('pwGate').style.display = 'none';
    enableAdminMode();
  } else if (input === SITE_PASSWORD) {
    isAdminMode = false;
    document.getElementById('pwGate').style.display = 'none';
  } else {
    error.style.display = 'block';
    document.getElementById('pwInput').value = '';
    document.getElementById('pwInput').focus();
  }
}

function initAuth() {
  // Clear any previously stored auth on every visit — password required every time
  localStorage.removeItem('bic_auth');
  sessionStorage.removeItem('bic_auth');
}

function enableAdminMode() {
  // Show admin banner
  const banner = document.createElement('div');
  banner.id = 'adminBanner';
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#5B21B6;color:white;text-align:center;padding:8px;font-size:13px;font-weight:700;z-index:500;display:flex;align-items:center;justify-content:center;gap:12px';
  banner.innerHTML = `Admin Mode — Strategy Library is editable
    <button onclick="goToPage('library')" style="background:white;color:var(--purple);border:none;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer">Go to Library</button>
    <span style="font-size:11px;font-weight:400;opacity:.8">Changes save to this browser</span>`;
  document.body.appendChild(banner);
  // Navigate to library and re-render with edit buttons
  goToPage('library');
  renderLibrary();
}

function openEditModal(key, name, desc, url) {
  // Remove any existing modal
  const existing = document.getElementById('editModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'editModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem';
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:1.5rem;max-width:500px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)">
      <div style="font-size:16px;font-weight:700;color:var(--gray-800);margin-bottom:1rem;padding-bottom:10px;border-bottom:1px solid var(--gray-100)">Edit Strategy</div>
      <div style="margin-bottom:12px">
        <label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">Strategy Name</label>
        <input type="text" id="editName" value="${name}" style="width:100%;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit">
      </div>
      <div style="margin-bottom:12px">
        <label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">Description</label>
        <textarea id="editDesc" style="width:100%;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:13px;font-family:inherit;min-height:100px;resize:vertical">${desc}</textarea>
      </div>
      <div style="margin-bottom:1.25rem">
        <label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">One-Pager Link (URL)</label>
        <input type="text" id="editUrl" value="${url}" style="width:100%;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:13px;font-family:inherit">
        <div style="font-size:11px;color:var(--gray-400);margin-top:4px">Leave as-is to use the auto-generated link, or paste a custom URL</div>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button onclick="document.getElementById('editModal').remove()" style="padding:8px 16px;border:1.5px solid var(--gray-200);border-radius:8px;background:white;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Cancel</button>
        <button onclick="saveEdit('${key}')" style="padding:8px 16px;background:var(--purple);color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Save Changes</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('editName').focus();
}

async function saveEdit(key) {
  const name = document.getElementById('editName').value.trim();
  const desc = document.getElementById('editDesc').value.trim();
  const url = document.getElementById('editUrl').value.trim();
  if (!name || !desc) { alert('Name and description are required.'); return; }
  const btn = document.querySelector('#editModal button:last-child');
  btn.textContent = 'Saving...'; btn.disabled = true;
  await saveStrategyOverride(key, {name, desc, url});
  document.getElementById('editModal').remove();
  renderLibrary();
}

async function resetStrategy(key) {
  if (!confirm('Reset this strategy to its original text?')) return;
  await deleteStrategyOverride(key);
  renderLibrary();
}

// ============================================================
// DARK MODE
// ============================================================
function toggleDark() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('bic_dark', isDark ? '1' : '0');
  document.getElementById('darkBtn').innerHTML = isDark ? '&#9728; Light' : '&#9790; Dark';
}

function initDark() {
  if (localStorage.getItem('bic_dark') === '1') {
    document.body.classList.add('dark');
    const btn = document.getElementById('darkBtn');
    if (btn) btn.innerHTML = '&#9728; Light';
  }
}

// ============================================================
// STRATEGY OF THE DAY
// ============================================================
function renderStrategyOfDay() {
  const all = [];
  Object.entries(LIBRARY).forEach(([key, bucket]) => {
    bucket.strategies.forEach(s => all.push({...s, bucket: bucket.label, bucketKey: key, color: bucket.color, bg: bucket.bg}));
  });
  // Rotate daily based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const s = all[dayOfYear % all.length];
  const url = 'https://sites.google.com/easdpa.org/behaviorcoaching/find-the-right-fit/' + s.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const container = document.getElementById('sotdCard');
  if (!container) return;
  container.innerHTML = `<div class="sotd-card">
    <div class="sotd-eyebrow">Strategy of the Day</div>
    <div class="sotd-name">${s.name}</div>
    <span class="sotd-bucket" style="background:${s.bg};color:${s.color}">${s.bucket}</span>
    <div class="sotd-desc">${s.desc}</div>
    <a href="${url}" target="_blank" class="btn btn-sm btn-outline" style="font-size:12px">View one-pager &#8599;</a>
  </div>`;
}

// ============================================================
// GLOSSARY TOOLTIPS
// ============================================================
const GLOSSARY = {
  'Be a Scientist': 'The 6-step Be a Scientist framework: What, When, Who, Where, Why, How. Narrows your focus to observable data before recommending any intervention.',
  'Social Discipline Window': 'Wachtel (1999): work WITH students (High Firm + High Fair = Relational). Working TO them is punitive; working FOR them is permissive.',
  'Fight response': 'A trauma response where the student engages aggressively with a perceived threat — arguing, defiance, outbursts, physical behavior.',
  'Flight response': 'A trauma response where the student escapes a perceived threat — avoidance, leaving tasks, frequent bathroom trips, head down.',
  'Freeze response': 'A trauma response where the student shuts down — blank stares, inability to respond, appearing numb or dissociated.',
  'Fawn response': 'A trauma response where the student appeases to avoid conflict — over-compliance, excessive remorse, people pleasing.',
  'Co-regulation': 'The process of an adult helping a dysregulated student return to a calm state through relationship (Build), environment (Structure), and guidance (Coach).',
  'Mood Meter': 'A quadrant tool using color zones: Green (calm), Blue (sad/tired), Yellow (anxious/excited), Red (angry/overwhelmed). Each links to regulation strategies.',
  'Gratitude Formula': 'A praise framework: When I see [observation] + I feel [feeling] + because [need met] + Thank you. Replaces personal praise with authentic gratitude.',
  'Tier 2': 'Targeted, small-group or individualized supports beyond universal classroom strategies. More frequent monitoring, structured check-ins, and adult involvement.',
  'Tier 3': 'Intensive, individualized interventions for students with significant, persistent needs. Typically involves a team, formal assessment, and outside supports.',
  'Effort-based praise': 'Praise that focuses on what the student did rather than who they are — e.g. "You stayed with that problem" rather than "You are so smart."',
  'Behavior-specific praise': 'Observable, concrete praise tied to a specific action — e.g. "I noticed you came in and got started without a reminder today."',
  'Relational Discipline Moves': 'A graduated sequence: extended eye contact → nonverbal cue → quiet verbal reminder → whole-class redirect. Stops behavior while preserving dignity.',
  '2x10 Strategy': '2 minutes of non-academic 1-on-1 conversation per day for 10 consecutive days. Student drives the topic. NOT about work or behavior.',
  'Rapid Resets': 'Quick in-the-moment regulation techniques: Tense+Release, Alphabet Soup, Stop Sign, Escape Space, Hand to Heart, Finger Thumb Switch, Thumb Drum.',
  'Reset Plan': 'A co-developed three-option plan for a student to self-regulate: (1) at seat, (2) in another area of the room, (3) outside the room. Practiced BEFORE it is needed.',
  'Break Card': 'A physical card giving BOTH the teacher and student the ability to initiate a break. Co-designed with ground rules and a menu of regulation options.',
  'Responsibilities': 'Elevating a struggling student to a meaningful leadership role — greeter, mentor, mail carrier, announcer. SACRED: never taken away, never used as reward or punishment.',
  'Secret Signal': 'A co-created nonverbal signal between teacher and student for redirection without public shame. Two-way — the student can also use it to request a break.',
  'Zones of Regulation': 'A curriculum using colored zones to help students identify emotional states and apply matched regulation strategies.',
  'Five Domains of Regulation': 'Physical, Cognitive, Emotional, Social, and Pro-Social — five types of regulation that require different supports and strategies.',
};

function applyGlossaryTooltips() {
  const targets = document.querySelectorAll('.emotion-section-title, .emotion-section-sub, .emotion-framework-title, .rcard-title, .trauma-banner-title, .window-banner-title');
  targets.forEach(el => {
    let html = el.innerHTML;
    Object.entries(GLOSSARY).forEach(([term, def]) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<![\\w>])${escaped}(?![\\w<])`, 'g');
      if (regex.test(html)) {
        html = html.replace(regex, `<span class="gterm">${term}<span class="gtooltip">${def}</span></span>`);
      }
    });
    el.innerHTML = html;
  });
}

// ============================================================
// INIT
// ============================================================
render();
renderResources();
updateLogBadge();
initDark();
initAuth();
renderStrategyOfDay();
setTimeout(applyGlossaryTooltips, 200);
// Load strategy overrides from server then render library
loadOverrides().then(() => renderLibrary());
