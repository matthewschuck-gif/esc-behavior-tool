// ============================================================
// BEHAVIOR INTERVENTION CENTER — app.js
// Features: 6-step tool, rapport builders, already-tried log,
// educator profile, emotion signals, save/log plans, library,
// resources, emotions hub
// ============================================================

const BASE = "https://sites.google.com/easdpa.org/behaviorcoaching/find-the-right-fit/";

// Returning student state — must be declared before render() is called
let _returningPlanId = null;

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
async function callAPI(messages, maxTokens) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({model:'claude-sonnet-4-5', max_tokens: maxTokens || 4000, messages})
  });
  const j = await res.json();
  if (!res.ok) throw new Error(j.error || 'Server error');
  return j.content?.[0]?.text || '';
}

function repairJSON(txt) {
  // Remove markdown fences
  txt = txt.replace(/```json|```/g, '').trim();
  // Extract just the JSON object
  const start = txt.indexOf('{'), end = txt.lastIndexOf('}');
  if (start > -1 && end > -1) txt = txt.slice(start, end + 1);
  // Remove control characters
  txt = txt.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ');
  // Fix trailing commas
  txt = txt.replace(/,(\s*[}\]])/g, '$1');
  // Fix unescaped apostrophes in values (basic fix)
  txt = txt.replace(/"([^"]*)'([^"]*)"/g, (m, a, b) => `"${a}${b}"`);
  return txt;
}

// ============================================================
// RENDER FORM
// ============================================================
function render() {
  document.getElementById('form').innerHTML = '';

  // Returning student panel at top
  const returningPanel = document.createElement('div');
  returningPanel.id = 'returningPanel';
  returningPanel.innerHTML = buildReturningPanel();
  document.getElementById('form').appendChild(returningPanel);

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
    const stepKey = `${s.id}_${q.id}`;
    const stepOv = getStepData(s.id, q.id);
    const label = stepOv?.label || q.label;
    const hint = stepOv?.hint !== undefined ? stepOv.hint : (q.hint || '');
    h += `<div class="q"><label data-step-label="${stepKey}">${label}</label>`;
    if (hint) h += `<div class="hint" data-step-hint="${stepKey}">${hint}</div>`;
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
    const allStepsContext = Object.entries(data).map(([k,v]) => {
      const s = SECTIONS.find(s=>s.id===k);
      return s ? `Step ${s.num} (${s.title}): ${sumSection(k,v)}` : '';
    }).filter(Boolean).join('\n');
    const txt = await callAPI([{role:'user',content:`You are a supportive Behavior Coaching specialist using the Be a Scientist framework. The educator just completed step ${sec.num}: ${sec.title}.\n\nThis step's responses:\n${sum}\n\nAll steps completed so far:\n${allStepsContext}\n\nWrite a 2-3 sentence coaching note. Acknowledge what they shared in THIS step, name one specific insight or pattern this step reveals when combined with previous steps, and note what the next step will help clarify. Be warm, trauma-informed, and specific to their actual data. Do NOT recommend interventions yet.`}]);
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
    const allStepsContext = Object.entries(data).map(([k,v]) => {
      const s = SECTIONS.find(s=>s.id===k);
      return s ? `Step ${s.num} (${s.title}): ${sumSection(k,v)}` : '';
    }).filter(Boolean).join('\n');
    const txt = await callAPI([{role:'user',content:`You are a supportive Behavior Coaching specialist. The educator just completed the final step ${sec.num}: ${sec.title}.\n\nThis step's responses:\n${sum}\n\nAll 6 steps:\n${allStepsContext}\n\nWrite a warm 2-3 sentence coaching note. Acknowledge a specific pattern you see across all 6 steps that paints a picture of this student's experience. Note they are moments away from a personalized plan and can add student interests and previous strategies for the most tailored output.`}]);
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
  // Run confidence check first
  const issues = runConfidenceCheck();
  if (issues.length > 0) {
    showConfidenceCheck(() => generatePlanCore());
    return;
  }
  generatePlanCore();
}

async function generatePlanCore() {
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
  const returningContext = getReturningContext();
  let schoolContext = '';
  // School context temporarily disabled while debugging
  // try { schoolContext = await loadSchoolContext(); } catch(e) {}
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
${returningContext}
${schoolContext}
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

Respond ONLY with valid JSON. No markdown, no backticks, no newlines inside string values, no apostrophes in text (use "it is" not "it's"). All string values must use escaped double quotes:
{'scientist_summary':'...','trauma_type':'none','trauma_guidance':'...','social_discipline_note':'...','primary_bucket':'connection|awareness|skills|regulation','secondary_bucket':'none','bucket_rationale':'...','priority':'low|moderate|high','tags':['tag'],'rapport_connection':'...','educator_connection':'...','try_first':[{'name':'strategy','bucket':'connection','why':'why','the_moves':'steps'},{'name':'strategy','bucket':'skills','why':'why','the_moves':'steps'},{'name':'strategy','bucket':'regulation','why':'why','the_moves':'steps'}],'also_consider':[{'name':'strategy','bucket':'connection','why':'why'},{'name':'strategy','bucket':'skills','why':'why'}],'what_to_say':'...','what_not_to_do':'...','environment_fits':['adj1','adj2','adj3'],'review_by':'6-8 school weeks'}`}]);

    let txt = repairJSON(response);
    let plan;
    try {
      plan = JSON.parse(txt);
    } catch(parseErr) {
      console.error('JSON parse failed at:', parseErr.message);
      throw new Error('The AI response had a formatting issue. Please try again.');
    }
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
  // Auto-log anonymized plan data to Upstash for school learning
  try { autoLogPlanToUpstash(p); } catch(e) {}
  const rs = document.getElementById('results');
  rs.style.display = 'block';
  document.getElementById('form').style.display = 'none';
  setTimeout(() => rs.scrollIntoView({behavior:'smooth',block:'start'}), 100);

  const dateStr = new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const prTag = p.priority==='high'?'tag-high':p.priority==='moderate'?'tag-moderate':'tag-low';
  const prColor = p.priority==='high'?'#DC2626':p.priority==='moderate'?'#D97706':'#16A34A';

  // ── HEADER ──────────────────────────────────────────────
  let h = `<div class="r-header">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div>
        <div class="r-eyebrow">Be a Scientist &mdash; Put It All Together</div>
        <div class="r-title">Behavior Intervention Plan</div>
        <div class="r-meta">${dateStr}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="background:rgba(255,255,255,.15);border-radius:10px;padding:8px 12px;display:inline-block">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.7;margin-bottom:3px">Priority</div>
          <div style="font-size:18px;font-weight:800;color:${p.priority==='high'?'#FCA5A5':p.priority==='moderate'?'#FDE68A':'#86EFAC'}">${p.priority.charAt(0).toUpperCase()+p.priority.slice(1)}</div>
        </div>
      </div>
    </div>
    <div style="margin-top:10px;margin-bottom:10px">${(p.tags||[]).map(t=>`<span class="tag tag-info">${t}</span>`).join('')}</div>
    <div class="r-summary">${p.scientist_summary}</div>
  </div>`;

  // ── TRAUMA + SOCIAL DISCIPLINE (compact inline) ──────────
  const alerts = [];
  if (p.trauma_type && p.trauma_type !== 'none' && p.trauma_guidance)
    alerts.push({color:'#D97706',bg:'#FEF3C7',border:'#FDE68A',label:`Trauma: ${p.trauma_type}`,text:p.trauma_guidance});
  if (p.social_discipline_note)
    alerts.push({color:'#5B21B6',bg:'#EDE9FE',border:'#C4B5FD',label:'Work WITH',text:p.social_discipline_note});

  if (alerts.length) {
    h += `<div style="display:grid;grid-template-columns:${alerts.length>1?'1fr 1fr':'1fr'};gap:10px;margin-bottom:1rem">`;
    alerts.forEach(a => {
      h += `<div style="background:${a.bg};border:1px solid ${a.border};border-radius:10px;padding:10px 12px">
        <div style="font-size:11px;font-weight:700;color:${a.color};text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px">${a.label}</div>
        <div style="font-size:12px;color:${a.color};line-height:1.5">${a.text}</div>
      </div>`;
    });
    h += `</div>`;
  }

  // ── BUCKET + RAPPORT (side by side) ─────────────────────
  const buckets = [p.primary_bucket];
  if (p.secondary_bucket && p.secondary_bucket !== 'none') buckets.push(p.secondary_bucket);
  const hasRapport = p.rapport_connection || p.educator_connection;

  h += `<div style="display:grid;grid-template-columns:${hasRapport?'1fr 1fr':'1fr'};gap:10px;margin-bottom:1rem">`;

  // Bucket pills
  h += `<div style="background:${bBg(p.primary_bucket)};border:1px solid ${bColor(p.primary_bucket)}40;border-radius:10px;padding:12px">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:${bColor(p.primary_bucket)};margin-bottom:4px">
      ${buckets.map(b=>b.charAt(0).toUpperCase()+b.slice(1)).join(' + ')} Focus
    </div>
    <div style="font-size:12px;color:${bColor(p.primary_bucket)};line-height:1.5">${p.bucket_rationale}</div>
  </div>`;

  // Rapport
  if (hasRapport) {
    h += `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:12px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#B45309;margin-bottom:4px">Rapport</div>
      ${p.rapport_connection ? `<div style="font-size:12px;color:#92400E;line-height:1.5;margin-bottom:4px">${p.rapport_connection}</div>` : ''}
      ${p.educator_connection ? `<div style="font-size:12px;color:#92400E;line-height:1.5;font-style:italic">${p.educator_connection}</div>` : ''}
    </div>`;
  }
  h += `</div>`;

  // ── START WITH THESE ─────────────────────────────────────
  h += `<div class="rcard"><div class="rcard-title">Start with these strategies</div>`;
  (p.try_first||[]).forEach((s,i) => {
    h += `<div class="int-item">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;flex-wrap:wrap">
        <div class="int-name" style="margin:0">${s.name}</div>
        <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
          <span class="int-bucket-tag" style="background:${bBg(s.bucket)};color:${bColor(s.bucket)}">${s.bucket}</span>
          <a class="int-link" href="${BASE+slugify(s.name)}" target="_blank">one-pager &#8599;</a>
        </div>
      </div>
      <div class="int-why">${s.why}</div>
      ${s.the_moves ? `<div class="int-moves"><strong>How to start:</strong> ${s.the_moves}</div>` : ''}
    </div>`;
  });
  h += `</div>`;

  // ── ALSO CONSIDER (compact) ──────────────────────────────
  if ((p.also_consider||[]).length) {
    h += `<div class="rcard"><div class="rcard-title">Also consider</div>
      <div style="display:flex;flex-direction:column;gap:6px">`;
    (p.also_consider||[]).forEach(s => {
      h += `<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--gray-100)">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px">
            <span style="font-size:13px;font-weight:700;color:var(--gray-800)">${s.name}</span>
            <span class="int-bucket-tag" style="background:${bBg(s.bucket)};color:${bColor(s.bucket)}">${s.bucket}</span>
            <a class="int-link" href="${BASE+slugify(s.name)}" target="_blank">one-pager &#8599;</a>
          </div>
          <div style="font-size:12px;color:var(--gray-500);line-height:1.5">${s.why}</div>
        </div>
      </div>`;
    });
    h += `</div></div>`;
  }

  // ── WHAT TO SAY + WHAT NOT TO DO (side by side) ──────────
  h += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:1rem">
    <div class="rcard" style="margin:0;background:#F0FDF4;border-color:#86EFAC">
      <div class="rcard-title" style="color:#14532D">What to say</div>
      <div style="font-size:13px;color:#166534;line-height:1.6;font-style:italic">"${p.what_to_say}"</div>
    </div>`;
  if (p.what_not_to_do) {
    h += `<div class="rcard" style="margin:0;background:#FEF2F2;border-color:#FCA5A5">
      <div class="rcard-title" style="color:#991B1B">What NOT to do</div>
      <div style="font-size:13px;color:#7F1D1D;line-height:1.6">${p.what_not_to_do}</div>
    </div>`;
  }
  h += `</div>`;

  // ── ENVIRONMENT + REVIEW (side by side) ─────────────────
  h += `<div style="display:grid;grid-template-columns:2fr 1fr;gap:10px;margin-bottom:1rem">
    <div class="rcard" style="margin:0">
      <div class="rcard-title">Environmental adjustments</div>
      <ul style="padding-left:1.2rem;margin:0">
        ${(p.environment_fits||[]).map(t=>`<li style="font-size:13px;color:#4B5563;margin-bottom:5px;line-height:1.5">${t}</li>`).join('')}
      </ul>
    </div>
    <div class="rcard" style="margin:0;background:var(--blue-light);border-color:#93C5FD">
      <div class="rcard-title" style="color:var(--blue-mid)">Review by</div>
      <div style="font-size:13px;color:var(--blue-dark);line-height:1.6">${p.review_by}</div>
    </div>
  </div>`;

  // ── ACTIONS ──────────────────────────────────────────────
  h += `<div class="action-row">
    <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
    <button class="btn btn-teal" onclick="savePlanCurrentResults()">Save to Log</button>
    <button class="btn" id="copyPlanBtn" onclick="copyPlanAsText()" style="border-color:var(--gray-300)">Copy as Text</button>
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
          <button class="btn btn-sm" onclick="generateShareableLink('${log.id}')" style="font-size:12px;color:var(--blue-mid);border-color:#93C5FD">Share Link</button>
          <select onchange="handleStatusChange('${log.id}',this.value,${JSON.stringify((log.strategies||[])).replace(/"/g,'&quot;')})" style="width:auto;padding:6px 10px;font-size:12px;border-radius:8px">
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

function handleStatusChange(id, status, strategies) {
  if (status === 'closed' && strategies && strategies.length > 0) {
    openEffectivenessModal(id, strategies);
  } else {
    updateStatus(id, status);
  }
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

    let txt = repairJSON(response);
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
    const keys = ['strategy_overrides', '_resources', '_emotions', '_steps', '_header'];
    const results = await Promise.all(keys.map(k =>
      fetch(`/api/overrides-get?key=${k}`).then(r => r.ok ? r.json() : {overrides:{}}).catch(() => ({overrides:{}}))
    ));
    _overridesCache = {};
    Object.assign(_overridesCache, results[0].overrides || {});
    _overridesCache._resources = results[1].overrides || {};
    _overridesCache._emotions  = results[2].overrides || {};
    _overridesCache._steps     = results[3].overrides || {};
    _overridesCache._header    = results[4].overrides || {};
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

      const imgKey = `img_lib_${key}_${idx}`;
      const imgOverride = overrides[imgKey];

      if (isAdminMode) {
        h += `<div class="lib-card admin-card" style="border-left-color:${bucket.color};display:block" data-name="${name.toLowerCase()}" data-desc="${desc.toLowerCase()}">
          ${isEdited ? `<div style="font-size:10px;font-weight:700;color:#16A34A;margin-bottom:4px">EDITED</div>` : ''}
          ${imgOverride?._imgUrl ? `<img src="${imgOverride._imgUrl}" style="width:100%;border-radius:6px;max-height:100px;object-fit:cover;margin-bottom:6px">` : ''}
          <div class="lib-card-name">${name}</div>
          <div class="lib-card-desc">${desc}</div>
          <a href="${url}" target="_blank" class="lib-card-link" style="color:${bucket.color}">View one-pager &#8599;</a>
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--gray-100);display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn btn-sm" style="color:var(--purple);border-color:var(--purple);font-size:11px" onclick="openEditModal('${overrideKey}','${name.replace(/'/g,"\\'")}','${desc.replace(/'/g,"\\'")}','${url}')">Edit Text</button>
            <button class="btn btn-sm" style="color:var(--teal-mid);border-color:var(--teal-mid);font-size:11px" onclick="openImageUpload('${imgKey}','lib-${key}-${idx}',function(url){renderLibrary()})">Image</button>
            ${imgOverride?._imgUrl ? `<button class="btn btn-sm" style="color:var(--gray-400);font-size:11px" onclick="saveStrategyOverride('${imgKey}',null).then(()=>renderLibrary())">Remove Img</button>` : ''}
            ${isEdited ? `<button class="btn btn-sm" style="color:var(--red-mid);border-color:#FCA5A5;font-size:11px" onclick="resetStrategy('${overrideKey}')">Reset</button>` : ''}
          </div>
        </div>`;
      } else {
        h += `<a class="lib-card" href="${url}" target="_blank" style="border-left-color:${bucket.color}" data-name="${name.toLowerCase()}" data-desc="${desc.toLowerCase()}">
          ${imgOverride?._imgUrl ? `<img src="${imgOverride._imgUrl}" style="width:100%;border-radius:6px;max-height:100px;object-fit:cover;margin-bottom:6px">` : ''}
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
  const overrides = getResourceOverrides();
  let h = '';

  if (isAdminMode) {
    h += `<div style="background:#EDE9FE;border:1.5px solid var(--purple);border-radius:10px;padding:10px 14px;margin-bottom:1.25rem;font-size:13px;color:var(--purple-dark)">
      <strong>Admin:</strong> Click Edit on any resource to update its title, description, or link. Click + Add Resource to add a new one to any section.
    </div>`;
  }

  RESOURCES.forEach((section, sIdx) => {
    h += `<div class="res-section">
      <h3 style="display:flex;align-items:center;justify-content:space-between">
        ${section.section}
        ${isAdminMode ? `<button class="btn btn-sm" style="font-size:11px;color:var(--purple);border-color:var(--purple)" onclick="openAddResource(${sIdx})">+ Add Resource</button>` : ''}
      </h3>
      <div class="res-grid">`;

    section.items.forEach((item, iIdx) => {
      const key = `res_${sIdx}_${iIdx}`;
      const ov = overrides[key] || {};
      const title = ov.title || item.title;
      const desc = ov.desc || item.desc;
      const url = ov.url || item.url;
      const hidden = ov.hidden || false;
      if (hidden && !isAdminMode) return;

      if (isAdminMode) {
        h += `<div class="res-card" style="${hidden ? 'opacity:.4;' : ''}">
          ${hidden ? '<div style="font-size:10px;font-weight:700;color:var(--gray-400);margin-bottom:4px">HIDDEN</div>' : ''}
          ${ov.title ? '<div style="font-size:10px;font-weight:700;color:#16A34A;margin-bottom:4px">EDITED</div>' : ''}
          <div class="res-card-title">${title}</div>
          <div class="res-card-desc">${desc}</div>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn btn-sm" style="font-size:11px;color:var(--purple);border-color:var(--purple)" onclick="openEditResource('${key}','${title.replace(/'/g,"\\'")}','${desc.replace(/'/g,"\\'")}','${url}')">Edit</button>
            <button class="btn btn-sm" style="font-size:11px;color:${hidden?'#16A34A':'var(--red-mid)'};border-color:${hidden?'#86EFAC':'#FCA5A5'}" onclick="toggleResourceHidden('${key}',${!hidden})">${hidden ? 'Show' : 'Hide'}</button>
            ${ov.title ? `<button class="btn btn-sm" style="font-size:11px;color:var(--gray-500)" onclick="resetResource('${key}')">Reset</button>` : ''}
          </div>
        </div>`;
      } else {
        h += `<a class="res-card" href="${url}" target="_blank">
          <div class="res-card-title">${title}</div>
          <div class="res-card-desc">${desc}</div>
        </a>`;
      }
    });

    // Show admin-added resources for this section
    const added = overrides[`res_added_${sIdx}`] || [];
    added.forEach((item, aIdx) => {
      if (item.hidden && !isAdminMode) return;
      const aKey = `res_added_${sIdx}_${aIdx}`;
      if (isAdminMode) {
        h += `<div class="res-card" style="border-color:var(--green-mid)${item.hidden?';opacity:.4':''}">
          <div style="font-size:10px;font-weight:700;color:#16A34A;margin-bottom:4px">ADDED</div>
          <div class="res-card-title">${item.title}</div>
          <div class="res-card-desc">${item.desc}</div>
          <div style="margin-top:8px;display:flex;gap:6px">
            <button class="btn btn-sm" style="font-size:11px;color:var(--purple);border-color:var(--purple)" onclick="openEditAddedResource(${sIdx},${aIdx})">Edit</button>
            <button class="btn btn-sm" style="font-size:11px;color:var(--red-mid);border-color:#FCA5A5" onclick="deleteAddedResource(${sIdx},${aIdx})">Delete</button>
          </div>
        </div>`;
      } else {
        h += `<a class="res-card" href="${item.url}" target="_blank">
          <div class="res-card-title">${item.title}</div>
          <div class="res-card-desc">${item.desc}</div>
        </a>`;
      }
    });

    h += `</div></div>`;
  });
  c.innerHTML = h;
}

function getResourceOverrides() {
  return _overridesCache._resources || {};
}

async function saveResourceOverride(key, value) {
  if (!_overridesCache._resources) _overridesCache._resources = {};
  if (value === null) delete _overridesCache._resources[key];
  else _overridesCache._resources[key] = value;
  await syncOverrides();
}

async function syncOverrides() {
  try {
    await fetch('/api/overrides-set', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({key: '_resources', value: _overridesCache._resources || {}})
    });
  } catch(e) { console.warn('Sync failed:', e.message); }
}

function openEditResource(key, title, desc, url) {
  showEditModal('Edit Resource', [
    {id:'eTitle', label:'Title', value:title},
    {id:'eDesc', label:'Description', value:desc, textarea:true},
    {id:'eUrl', label:'URL', value:url}
  ], () => {
    const t = document.getElementById('eTitle').value.trim();
    const d = document.getElementById('eDesc').value.trim();
    const u = document.getElementById('eUrl').value.trim();
    if (!t || !d || !u) { alert('All fields required.'); return; }
    saveResourceOverride(key, {title:t, desc:d, url:u}).then(() => renderResources());
    closeModal();
  });
}

async function toggleResourceHidden(key, hide) {
  const overrides = getResourceOverrides();
  const existing = overrides[key] || {};
  existing.hidden = hide;
  await saveResourceOverride(key, existing);
  renderResources();
}

async function resetResource(key) {
  if (!confirm('Reset to original?')) return;
  await saveResourceOverride(key, null);
  renderResources();
}

function openAddResource(sIdx) {
  showEditModal('Add New Resource', [
    {id:'eTitle', label:'Title', value:''},
    {id:'eDesc', label:'Description', value:'', textarea:true},
    {id:'eUrl', label:'URL', value:'https://'}
  ], async () => {
    const t = document.getElementById('eTitle').value.trim();
    const d = document.getElementById('eDesc').value.trim();
    const u = document.getElementById('eUrl').value.trim();
    if (!t || !d || !u) { alert('All fields required.'); return; }
    const overrides = getResourceOverrides();
    const key = `res_added_${sIdx}`;
    const added = overrides[key] || [];
    added.push({title:t, desc:d, url:u});
    await saveResourceOverride(key, added);
    renderResources();
    closeModal();
  });
}

function openEditAddedResource(sIdx, aIdx) {
  const overrides = getResourceOverrides();
  const item = (overrides[`res_added_${sIdx}`] || [])[aIdx] || {};
  showEditModal('Edit Added Resource', [
    {id:'eTitle', label:'Title', value:item.title||''},
    {id:'eDesc', label:'Description', value:item.desc||'', textarea:true},
    {id:'eUrl', label:'URL', value:item.url||''}
  ], async () => {
    const t = document.getElementById('eTitle').value.trim();
    const d = document.getElementById('eDesc').value.trim();
    const u = document.getElementById('eUrl').value.trim();
    const key = `res_added_${sIdx}`;
    const added = overrides[key] || [];
    added[aIdx] = {title:t, desc:d, url:u};
    await saveResourceOverride(key, added);
    renderResources();
    closeModal();
  });
}

async function deleteAddedResource(sIdx, aIdx) {
  if (!confirm('Delete this resource?')) return;
  const overrides = getResourceOverrides();
  const key = `res_added_${sIdx}`;
  const added = overrides[key] || [];
  added.splice(aIdx, 1);
  await saveResourceOverride(key, added);
  renderResources();
}

// ============================================================
// SHARED EDIT MODAL HELPER
// ============================================================
function showEditModal(title, fields, onSave) {
  const existing = document.getElementById('editModal');
  if (existing) existing.remove();
  let fieldsHtml = fields.map(f => `
    <div style="margin-bottom:12px">
      <label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">${f.label}</label>
      ${f.textarea
        ? `<textarea id="${f.id}" style="width:100%;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:13px;font-family:inherit;min-height:80px;resize:vertical">${f.value}</textarea>`
        : `<input type="text" id="${f.id}" value="${f.value.replace(/"/g,'&quot;')}" style="width:100%;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit">`
      }
    </div>`).join('');
  const modal = document.createElement('div');
  modal.id = 'editModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto';
  modal.innerHTML = `<div style="background:white;border-radius:16px;padding:1.5rem;max-width:500px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:16px;font-weight:700;color:var(--gray-800);margin-bottom:1rem;padding-bottom:10px;border-bottom:1px solid var(--gray-100)">${title}</div>
    ${fieldsHtml}
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:1rem">
      <button onclick="closeModal()" style="padding:8px 16px;border:1.5px solid var(--gray-200);border-radius:8px;background:white;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Cancel</button>
      <button id="modalSaveBtn" onclick="modalSaveAction()" style="padding:8px 16px;background:var(--purple);color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Save Changes</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  window._modalSaveAction = onSave;
  const firstInput = modal.querySelector('input,textarea');
  if (firstInput) firstInput.focus();
}

function modalSaveAction() {
  if (window._modalSaveAction) window._modalSaveAction();
}

function closeModal() {
  const m = document.getElementById('editModal');
  if (m) m.remove();
}

// ============================================================
// EMOTIONS HUB EDITING
// ============================================================
function getEmotionOverrides() {
  return _overridesCache._emotions || {};
}

async function saveEmotionOverride(key, value) {
  if (!_overridesCache._emotions) _overridesCache._emotions = {};
  if (value === null) delete _overridesCache._emotions[key];
  else _overridesCache._emotions[key] = value;
  try {
    await fetch('/api/overrides-set', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({key:'_emotions', value:_overridesCache._emotions})
    });
  } catch(e) { console.warn('Sync failed:', e.message); }
}

function applyEmotionOverrides() {
  if (!isAdminMode && Object.keys(getEmotionOverrides()).length === 0) return;
  const overrides = getEmotionOverrides();

  // Apply text overrides to emotion-section elements
  document.querySelectorAll('[data-ekey]').forEach(el => {
    const key = el.dataset.ekey;
    if (overrides[key] !== undefined) el.innerHTML = overrides[key];
  });

  // Add edit + image upload buttons in admin mode
  if (isAdminMode) {
    // Add admin tip banner
    const emotionsPage = document.getElementById('page-emotions');
    if (emotionsPage && !document.getElementById('emotionsAdminTip')) {
      const tip = document.createElement('div');
      tip.id = 'emotionsAdminTip';
      tip.style.cssText = 'background:#EDE9FE;border:1.5px solid var(--purple);border-radius:10px;padding:10px 14px;margin:1rem auto;max-width:760px;font-size:13px;color:var(--purple-dark)';
      tip.innerHTML = '<strong>Admin:</strong> Click "Edit" buttons on section titles and subtitles to update text. Click "Image" to add an image to any section.';
      emotionsPage.insertBefore(tip, emotionsPage.querySelector('.main'));
    }

    document.querySelectorAll('[data-ekey]').forEach(el => {
      if (el.querySelector('.e-edit-btn')) return;
      const key = el.dataset.ekey;
      const btnWrap = document.createElement('span');

      const editBtn = document.createElement('button');
      editBtn.className = 'e-edit-btn btn btn-sm';
      editBtn.style.cssText = 'font-size:10px;color:var(--purple);border-color:var(--purple);margin-left:8px;vertical-align:middle';
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => openEditEmotionField(key, el);
      btnWrap.appendChild(editBtn);

      // Add image upload for section title elements only
      if (key.endsWith('_title')) {
        const imgKey = `img_${key}`;
        const imgBtn = document.createElement('button');
        imgBtn.className = 'btn btn-sm';
        imgBtn.style.cssText = 'font-size:10px;color:var(--teal-mid);border-color:var(--teal-mid);margin-left:4px;vertical-align:middle';
        imgBtn.textContent = 'Image';
        const sectionEl = el.parentElement;
        imgBtn.onclick = () => openImageUpload(imgKey, key, (url) => {
          // Show image above the section
          const existing = sectionEl.querySelector('.em-img-preview');
          if (existing) { existing.querySelector('img').src = url; return; }
          const wrap = document.createElement('div');
          wrap.className = 'em-img-preview';
          wrap.style.cssText = 'margin-bottom:10px';
          const img = document.createElement('img');
          img.src = url;
          img.style.cssText = 'width:100%;border-radius:10px;max-height:200px;object-fit:cover';
          wrap.appendChild(img);
          sectionEl.insertBefore(wrap, sectionEl.firstChild);
        });
        btnWrap.appendChild(imgBtn);

        // Show existing image
        const existingImgUrl = getEmotionOverrides()[`img_${key}`];
        if (existingImgUrl && typeof existingImgUrl === 'string' && existingImgUrl.startsWith('http')) {
          const wrap = document.createElement('div');
          wrap.className = 'em-img-preview';
          wrap.style.cssText = 'margin-bottom:10px';
          const img = document.createElement('img');
          img.src = existingImgUrl;
          img.style.cssText = 'width:100%;border-radius:10px;max-height:200px;object-fit:cover';
          wrap.appendChild(img);
          el.parentElement.insertBefore(wrap, el);
        }
      }

      el.appendChild(btnWrap);
    });
  }
}

function openEditEmotionField(key, el) {
  const overrides = getEmotionOverrides();
  const current = overrides[key] || el.innerHTML.replace(/<button[^>]*>.*?<\/button>/gs,'').trim();
  showEditModal('Edit Content', [
    {id:'eContent', label:'Content (HTML allowed)', value:'', textarea:true}
  ], async () => {
    const val = document.getElementById('eContent').value;
    await saveEmotionOverride(key, val);
    el.innerHTML = val;
    if (isAdminMode) {
      const btn = document.createElement('button');
      btn.className = 'e-edit-btn btn btn-sm';
      btn.style.cssText = 'font-size:10px;color:var(--purple);border-color:var(--purple);margin-top:4px;display:block';
      btn.textContent = 'Edit';
      btn.onclick = () => openEditEmotionField(key, el);
      el.appendChild(btn);
    }
    closeModal();
  });
  // Pre-fill with current content
  setTimeout(() => {
    const ta = document.getElementById('eContent');
    if (ta) ta.value = current;
  }, 50);
}

// ============================================================
// STEP QUESTIONS EDITING
// ============================================================
function getStepOverrides() {
  return _overridesCache._steps || {};
}

async function saveStepOverride(key, value) {
  if (!_overridesCache._steps) _overridesCache._steps = {};
  if (value === null) delete _overridesCache._steps[key];
  else _overridesCache._steps[key] = value;
  try {
    await fetch('/api/overrides-set', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({key:'_steps', value:_overridesCache._steps})
    });
  } catch(e) { console.warn('Sync failed:', e.message); }
}

function getStepData(secId, qId) {
  const overrides = getStepOverrides();
  const key = `step_${secId}_${qId}`;
  return overrides[key] || null;
}

function applyStepOverrides() {
  const overrides = getStepOverrides();
  Object.entries(overrides).forEach(([key, val]) => {
    const parts = key.split('_'); // step_secId_qId
    if (parts.length < 3) return;
    const secId = parts[1], qId = parts.slice(2).join('_');
    const labelEl = document.querySelector(`[data-step-label="${secId}_${qId}"]`);
    const hintEl = document.querySelector(`[data-step-hint="${secId}_${qId}"]`);
    if (labelEl && val.label) labelEl.textContent = val.label;
    if (hintEl && val.hint !== undefined) hintEl.textContent = val.hint;
  });

  if (isAdminMode) {
    document.querySelectorAll('[data-step-label]').forEach(el => {
      if (el.querySelector('.s-edit-btn')) return;
      const key = el.dataset.stepLabel;
      const btn = document.createElement('button');
      btn.className = 's-edit-btn btn btn-sm';
      btn.style.cssText = 'font-size:10px;color:var(--purple);border-color:var(--purple);margin-left:8px;vertical-align:middle';
      btn.textContent = 'Edit';
      btn.onclick = (e) => { e.stopPropagation(); openEditStepQuestion(key); };
      el.appendChild(btn);
    });
  }
}

function openEditStepQuestion(key) {
  const overrides = getStepOverrides();
  const existing = overrides[`step_${key}`] || {};
  const parts = key.split('_');
  const secId = parts[0], qId = parts[1];
  const sec = SECTIONS.find(s => s.id === secId);
  const q = sec ? sec.questions.find(q => q.id === qId) : null;
  showEditModal('Edit Question', [
    {id:'eLabel', label:'Question text', value: existing.label || (q ? q.label : '')},
    {id:'eHint', label:'Hint text (optional)', value: existing.hint !== undefined ? existing.hint : (q && q.hint ? q.hint : ''), textarea:true}
  ], async () => {
    const label = document.getElementById('eLabel').value.trim();
    const hint = document.getElementById('eHint').value.trim();
    if (!label) { alert('Question text required.'); return; }
    await saveStepOverride(`step_${key}`, {label, hint});
    closeModal();
    // Re-render the form to reflect changes
    const wasCurrentStep = current;
    render();
    current = wasCurrentStep;
    applyStepOverrides();
  });
}

// ============================================================
// HEADER / NAV / RULE EDITING & IMAGE UPLOADS
// ============================================================
function getHeaderOverrides() {
  return _overridesCache._header || {};
}

async function saveHeaderOverride(key, value) {
  if (!_overridesCache._header) _overridesCache._header = {};
  if (value === null) delete _overridesCache._header[key];
  else _overridesCache._header[key] = value;
  try {
    await fetch('/api/overrides-set', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: '_header', value: _overridesCache._header })
    });
  } catch(e) { console.warn('Sync failed:', e.message); }
}

function applyHeaderOverrides() {
  const overrides = getHeaderOverrides();

  // Apply text overrides to header/nav/rule elements
  document.querySelectorAll('[data-hkey]').forEach(el => {
    const key = el.dataset.hkey;
    if (overrides[key]) el.innerHTML = overrides[key] + (el.querySelector('.h-edit-btn') ? el.querySelector('.h-edit-btn').outerHTML : '');
  });
  document.querySelectorAll('[data-nkey]').forEach(el => {
    const key = el.dataset.nkey;
    if (overrides[key]) {
      const badge = el.querySelector('.nbadge');
      const editBtn = el.querySelector('.h-edit-btn');
      el.textContent = overrides[key];
      if (badge) el.appendChild(badge);
      if (editBtn) el.appendChild(editBtn);
    }
  });
  document.querySelectorAll('[data-rkey]').forEach(el => {
    const key = el.dataset.rkey;
    if (overrides[key]) {
      const editBtn = el.querySelector('.h-edit-btn');
      el.innerHTML = overrides[key];
      if (editBtn) el.appendChild(editBtn);
    }
  });

  // Apply header image
  if (overrides.img_header) {
    const wrap = document.getElementById('headerImageWrap');
    const img = document.getElementById('headerImage');
    if (wrap && img) { img.src = overrides.img_header; wrap.style.display = 'block'; }
  }

  if (!isAdminMode) return;

  // Add edit buttons to header elements
  document.querySelectorAll('[data-hkey]').forEach(el => {
    if (el.querySelector('.h-edit-btn')) return;
    const key = el.dataset.hkey;
    const btn = document.createElement('button');
    btn.className = 'h-edit-btn';
    btn.style.cssText = 'background:var(--gold);color:var(--purple-dark);border:none;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700;cursor:pointer;margin-left:8px;vertical-align:middle';
    btn.textContent = 'Edit';
    btn.onclick = (e) => { e.stopPropagation(); openEditHeaderField(key, el); };
    el.appendChild(btn);
  });

  // Nav tab edit buttons
  document.querySelectorAll('[data-nkey]').forEach(el => {
    if (el.querySelector('.h-edit-btn')) return;
    const key = el.dataset.nkey;
    const btn = document.createElement('button');
    btn.className = 'h-edit-btn';
    btn.style.cssText = 'background:var(--gold);color:var(--purple-dark);border:none;border-radius:3px;padding:1px 6px;font-size:9px;font-weight:700;cursor:pointer;margin-left:6px';
    btn.textContent = '✎';
    btn.onclick = (e) => { e.stopPropagation(); openEditNavTab(key, el); };
    el.appendChild(btn);
  });

  // Rule bar edit buttons
  document.querySelectorAll('[data-rkey]').forEach(el => {
    if (el.querySelector('.h-edit-btn')) return;
    const key = el.dataset.rkey;
    const btn = document.createElement('button');
    btn.className = 'h-edit-btn';
    btn.style.cssText = 'background:var(--gold);color:var(--purple-dark);border:none;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700;cursor:pointer;margin-left:8px';
    btn.textContent = 'Edit';
    btn.onclick = () => openEditRuleBar(key, el);
    el.appendChild(btn);
  });

  // Header image upload button
  const headerInner = document.querySelector('.header-inner');
  if (headerInner && !document.getElementById('headerImgUploadBtn')) {
    const uploadBtn = document.createElement('button');
    uploadBtn.id = 'headerImgUploadBtn';
    uploadBtn.style.cssText = 'background:var(--gold);color:var(--purple-dark);border:none;border-radius:6px;padding:4px 12px;font-size:11px;font-weight:700;cursor:pointer;margin-top:8px;display:block;margin-left:auto;margin-right:auto';
    uploadBtn.textContent = '+ Upload Header Image';
    uploadBtn.onclick = () => openImageUpload('img_header', 'header', (url) => {
      const wrap = document.getElementById('headerImageWrap');
      const img = document.getElementById('headerImage');
      if (wrap && img) { img.src = url; wrap.style.display = 'block'; }
    });
    headerInner.appendChild(uploadBtn);
  }
}

function openEditHeaderField(key, el) {
  const overrides = getHeaderOverrides();
  const current = overrides[key] || el.innerText.replace('Edit','').trim();
  showEditModal('Edit Header Text', [
    {id:'eVal', label:'Text', value:current}
  ], async () => {
    const val = document.getElementById('eVal').value.trim();
    if (!val) return;
    await saveHeaderOverride(key, val);
    const editBtn = el.querySelector('.h-edit-btn');
    el.innerHTML = val;
    if (editBtn) el.appendChild(editBtn);
    closeModal();
  });
}

function openEditNavTab(key, el) {
  const overrides = getHeaderOverrides();
  const current = overrides[key] || el.childNodes[0]?.textContent?.trim() || '';
  showEditModal('Edit Tab Label', [
    {id:'eVal', label:'Tab label', value:current}
  ], async () => {
    const val = document.getElementById('eVal').value.trim();
    if (!val) return;
    await saveHeaderOverride(key, val);
    const badge = el.querySelector('.nbadge');
    const editBtn = el.querySelector('.h-edit-btn');
    el.textContent = val;
    if (badge) el.appendChild(badge);
    if (editBtn) el.appendChild(editBtn);
    closeModal();
  });
}

function openEditRuleBar(key, el) {
  const overrides = getHeaderOverrides();
  showEditModal('Edit Rule Bar Text', [
    {id:'eVal', label:'Text (use <strong>bold</strong> for bold)', value: overrides[key] || el.innerHTML.replace(/<button[^>]*>.*?<\/button>/g,'').trim(), textarea:true}
  ], async () => {
    const val = document.getElementById('eVal').value.trim();
    if (!val) return;
    await saveHeaderOverride(key, val);
    const editBtn = el.querySelector('.h-edit-btn');
    el.innerHTML = val;
    if (editBtn) el.appendChild(editBtn);
    closeModal();
  });
}

// ============================================================
// IMAGE UPLOAD SYSTEM
// ============================================================
function openImageUpload(storageKey, location, onSuccess) {
  const existing = document.getElementById('imgUploadModal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'imgUploadModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9100;display:flex;align-items:center;justify-content:center;padding:1rem';
  modal.innerHTML = `<div style="background:white;border-radius:16px;padding:1.5rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:16px;font-weight:700;color:var(--gray-800);margin-bottom:4px">Upload Image</div>
    <div style="font-size:12px;color:var(--gray-500);margin-bottom:1rem">PNG, JPG or GIF. Recommended: under 2MB.</div>
    <div style="border:2px dashed var(--gray-300);border-radius:10px;padding:2rem;text-align:center;cursor:pointer;transition:border-color .15s;margin-bottom:1rem"
      onclick="document.getElementById('imgFileInput').click()"
      ondragover="event.preventDefault();this.style.borderColor='var(--purple)'"
      ondragleave="this.style.borderColor='var(--gray-300)'"
      ondrop="handleImgDrop(event,'${storageKey}','${location}')">
      <div style="font-size:32px;margin-bottom:8px">🖼</div>
      <div style="font-size:13px;font-weight:600;color:var(--gray-600)">Click to choose or drag &amp; drop</div>
      <div style="font-size:12px;color:var(--gray-400);margin-top:4px">PNG, JPG, GIF</div>
    </div>
    <input type="file" id="imgFileInput" accept="image/*" style="display:none" onchange="handleImgSelect(this,'${storageKey}','${location}')">
    <div id="imgUploadStatus" style="font-size:13px;color:var(--gray-500);text-align:center;min-height:20px"></div>
    <div style="display:flex;justify-content:flex-end;margin-top:1rem">
      <button onclick="document.getElementById('imgUploadModal').remove()" style="padding:8px 16px;border:1.5px solid var(--gray-200);border-radius:8px;background:white;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Cancel</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  window._imgUploadCallback = onSuccess;
}

async function handleImgDrop(event, storageKey, location) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) await uploadImageFile(file, storageKey, location);
}

async function handleImgSelect(input, storageKey, location) {
  const file = input.files[0];
  if (file) await uploadImageFile(file, storageKey, location);
}

async function uploadImageFile(file, storageKey, location) {
  const status = document.getElementById('imgUploadStatus');
  if (status) status.textContent = 'Uploading...';
  try {
    const filename = `bic-${location}-${Date.now()}.${file.name.split('.').pop()}`;
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': file.type, 'x-filename': filename },
      body: file
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');

    // Save URL to the right store
    if (storageKey.startsWith('img_header')) await saveHeaderOverride(storageKey, data.url);
    else if (storageKey.startsWith('img_em')) await saveEmotionOverride(storageKey, data.url);
    else if (storageKey.startsWith('img_res')) await saveResourceOverride(storageKey, {_imgUrl: data.url});
    else await saveStrategyOverride(storageKey, {_imgUrl: data.url});

    if (window._imgUploadCallback) window._imgUploadCallback(data.url);
    document.getElementById('imgUploadModal')?.remove();
  } catch(e) {
    if (status) status.textContent = 'Error: ' + e.message + '. Make sure Vercel Blob is connected.';
  }
}

function showImageInCard(el, url, removeKey, removeStore) {
  const existing = el.querySelector('.admin-img-preview');
  if (existing) existing.remove();
  const wrap = document.createElement('div');
  wrap.className = 'admin-img-preview';
  wrap.style.cssText = 'margin-top:8px';
  const img = document.createElement('img');
  img.src = url;
  img.style.cssText = 'width:100%;border-radius:6px;max-height:120px;object-fit:cover;margin-bottom:4px';
  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn btn-sm';
  removeBtn.style.cssText = 'font-size:10px;color:var(--red-mid);border-color:#FCA5A5;width:100%';
  removeBtn.textContent = 'Remove Image';
  removeBtn.onclick = async () => {
    if (removeStore === 'header') await saveHeaderOverride(removeKey, null);
    else if (removeStore === 'emotion') await saveEmotionOverride(removeKey, null);
    else if (removeStore === 'resource') await saveResourceOverride(removeKey, null);
    else await saveStrategyOverride(removeKey, null);
    wrap.remove();
  };
  wrap.appendChild(img);
  wrap.appendChild(removeBtn);
  el.appendChild(wrap);
}

function showPage(page, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  if (btn) btn.classList.add('active');
  if (page === 'logs') renderLogs();
  if (page === 'emotions' && isAdminMode) setTimeout(applyEmotionOverrides, 100);
  if (page === 'tool' && isAdminMode) setTimeout(applyStepOverrides, 300);
  window.scrollTo({top:0,behavior:'smooth'});
}

function goToPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const idx = {tool:0,emotions:1,library:2,logs:3,resources:4}[page] || 0;
  document.querySelectorAll('.nav-tab')[idx].classList.add('active');
  if (page === 'logs') renderLogs();
  if (page === 'emotions' && isAdminMode) setTimeout(applyEmotionOverrides, 100);
  if (page === 'tool' && isAdminMode) setTimeout(applyStepOverrides, 300);
  window.scrollTo({top:0,behavior:'smooth'});
}

function startOver() {
  current = 0; data = {}; insights = {}; done = new Set(); triedStrategies = [];
  _lastPlan = null; _lastDate = null; _returningPlanId = null;
  document.getElementById('results').style.display = 'none';
  document.getElementById('form').style.display = 'block';
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

// ============================================================
// PASSWORD GATE
// ============================================================
var SITE_PASSWORD = 'Thew26';
var ADMIN_PASSWORD = 'Hope4';
var TRIAL_PASSWORD = 'TrialCoach26';
var isAdminMode = false;
var isTrialMode = false;

function checkPassword() {
  try {
    var val = document.getElementById('pwInput').value;
    var err = document.getElementById('pwError');
    if (val === SITE_PASSWORD || val === ADMIN_PASSWORD || val === TRIAL_PASSWORD) {
      document.getElementById('pwGate').style.display = 'none';
      if (val === ADMIN_PASSWORD) { isAdminMode = true; try { enableAdminMode(); } catch(e) {} }
      if (val === TRIAL_PASSWORD) { isTrialMode = true; try { enableTrialMode(); } catch(e) {} }
      if (val === SITE_PASSWORD) { try { setTimeout(maybeShowTour, 800); } catch(e) {} }
    } else {
      if (err) err.style.display = 'block';
      document.getElementById('pwInput').value = '';
    }
  } catch(e) { console.error('checkPassword error:', e); }
}

function initAuth() {
  try { localStorage.removeItem('bic_auth'); } catch(e) {}
}

function enableTrialMode() {
  const banner = document.createElement('div');
  banner.id = 'trialBanner';
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#D97706;color:white;text-align:center;padding:6px;font-size:12px;font-weight:700;z-index:500;letter-spacing:.02em';
  banner.textContent = 'Trial Access — You are using a preview version of this tool. Thank you for your feedback!';
  document.body.appendChild(banner);
  document.querySelector('.header').style.marginTop = '28px';
}

function enableAdminMode() {
  // Show admin banner
  const banner = document.createElement('div');
  banner.id = 'adminBanner';
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#5B21B6;color:white;text-align:center;padding:8px;font-size:13px;font-weight:700;z-index:500;display:flex;align-items:center;justify-content:center;gap:12px';
  banner.innerHTML = `Admin Mode — Strategy Library, Resources, Emotions Hub &amp; Step Questions are editable
    <button onclick="goToPage('library')" style="background:white;color:var(--purple);border:none;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer">Library</button>
    <button onclick="goToPage('resources')" style="background:white;color:var(--purple);border:none;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer">Resources</button>
    <button onclick="goToPage('emotions')" style="background:white;color:var(--purple);border:none;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer">Emotions</button>
    <button onclick="goToPage('tool')" style="background:white;color:var(--purple);border:none;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer">Steps</button>
    <button onclick="viewFeedback()" style="background:var(--gold);color:var(--purple-dark);border:none;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer">Feedback</button>
    <button onclick="showAdminInsights()" style="background:var(--gold);color:var(--purple-dark);border:none;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer">Insights</button>
    <span style="font-size:11px;font-weight:400;opacity:.8">Changes sync for all users</span>`;
  document.body.appendChild(banner);
  // Pad footer so banner doesn't cover content
  const footer = document.getElementById('siteFooter');
  if (footer) footer.style.marginBottom = '48px';
  // Render all editable sections
  renderLibrary();
  renderResources();
  setTimeout(() => {
    applyHeaderOverrides();
    applyEmotionOverrides();
    applyStepOverrides();
  }, 300);
  goToPage('library');
}

function openEditModal(key, name, desc, url) {
  showEditModal('Edit Strategy', [
    {id:'editName', label:'Strategy Name', value:name},
    {id:'editDesc', label:'Description', value:desc, textarea:true},
    {id:'editUrl', label:'One-Pager Link (URL)', value:url}
  ], () => saveEdit(key));
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
// RETURNING STUDENT
// ============================================================

function buildReturningPanel() {
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    if (logs.length === 0) return '';

    let h = `<div class="returning-banner">
      <div class="returning-banner-title">Returning student? Pull up a previous plan</div>
      <div style="font-size:12px;color:var(--gray-500);margin-bottom:10px">Select a saved plan below and the AI will build on it — automatically excluding what was already tried.</div>
      <div id="returningList">`;

    logs.slice(0, 5).forEach(log => {
      h += `<div class="returning-plan-card" id="rpc_${log.id}" onclick="selectReturningPlan('${log.id}')">
        <div class="returning-plan-date">${log.dateStr} &middot; ${log.bucket} bucket &middot; ${log.priority} priority</div>
        <div class="returning-plan-summary">${log.summary?.slice(0,120)}${log.summary?.length>120?'...':''}</div>
        <div class="returning-plan-tags">${(log.strategies||[]).slice(0,3).map(s=>`<span style="font-size:10px;font-weight:600;padding:1px 6px;border-radius:6px;background:var(--purple-light);color:var(--purple)">${s}</span>`).join('')}</div>
      </div>`;
    });

    h += `</div>
      <button class="btn btn-sm btn-outline" style="margin-top:8px;font-size:12px" onclick="clearReturningPlan()">Start fresh instead</button>
    </div>`;
    return h;
  } catch(e) { return ''; }
}

function selectReturningPlan(id) {
  _returningPlanId = id;
  document.querySelectorAll('.returning-plan-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('rpc_' + id);
  if (card) card.classList.add('selected');
}

function clearReturningPlan() {
  _returningPlanId = null;
  document.querySelectorAll('.returning-plan-card').forEach(c => c.classList.remove('selected'));
}

function getReturningContext() {
  if (!_returningPlanId) return '';
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    const log = logs.find(l => l.id === _returningPlanId);
    if (!log) return '';
    return `\n\nPREVIOUS PLAN FOR THIS STUDENT (${log.dateStr}):
Summary: ${log.summary}
Strategies that were tried: ${(log.strategies||[]).join(', ')}
Previously logged tried strategies: ${log.tried || 'none'}
Progress notes: ${(log.progress||[]).map(p=>`${p.date}: ${p.note}`).join('; ') || 'none'}
IMPORTANT: Do not repeat the strategies that were already tried unless noting how to implement them differently.`;
  } catch(e) { return ''; }
}

// ============================================================
// QUICK STRATEGY SEARCH
// ============================================================
let _qsOpen = false;

function toggleQuickSearch() {
  _qsOpen = !_qsOpen;
  const panel = document.getElementById('qsPanel');
  const input = document.getElementById('qsInput');
  panel.classList.toggle('open', _qsOpen);
  if (_qsOpen) { setTimeout(() => input?.focus(), 100); }
}

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (_qsOpen && !e.target.closest('#qsPanel') && !e.target.closest('#qsFab')) {
    _qsOpen = false;
    document.getElementById('qsPanel')?.classList.remove('open');
  }
});

function runQuickSearch(q) {
  const results = document.getElementById('qsResults');
  if (!results) return;
  const v = q.toLowerCase().trim();
  if (!v) { results.innerHTML = '<div class="qs-empty">Type to search all strategies</div>'; return; }

  const matches = [];
  Object.entries(LIBRARY).forEach(([key, bucket]) => {
    bucket.strategies.forEach(s => {
      if (s.name.toLowerCase().includes(v) || s.desc.toLowerCase().includes(v)) {
        matches.push({...s, bucketKey:key, bucketLabel:bucket.label, color:bucket.color, bg:bucket.bg});
      }
    });
  });

  if (matches.length === 0) { results.innerHTML = '<div class="qs-empty">No strategies found</div>'; return; }

  results.innerHTML = matches.slice(0,12).map(s => {
    const url = BASE + s.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    return `<div class="qs-item">
      <div class="qs-item-name">${s.name}</div>
      <span class="qs-item-bucket" style="background:${s.bg};color:${s.color}">${s.bucketLabel}</span>
      <a class="qs-item-link" href="${url}" target="_blank">one-pager ↗</a>
      <div class="qs-item-desc">${s.desc.slice(0,90)}${s.desc.length>90?'...':''}</div>
    </div>`;
  }).join('');
}

// ============================================================
// COPY PLAN AS TEXT
// ============================================================
function copyPlanAsText() {
  if (!_lastPlan) return;
  const p = _lastPlan;
  const date = _lastDate || new Date().toLocaleDateString();

  let text = `BEHAVIOR INTERVENTION PLAN\n`;
  text += `${'='.repeat(40)}\n`;
  text += `Date: ${date}\n\n`;

  text += `SUMMARY\n${'-'.repeat(20)}\n${p.scientist_summary}\n\n`;
  text += `Priority: ${p.priority?.toUpperCase()}\n`;
  if (p.tags?.length) text += `Tags: ${p.tags.join(', ')}\n`;
  text += '\n';

  if (p.trauma_type && p.trauma_type !== 'none') {
    text += `TRAUMA LENS: ${p.trauma_type}\n${p.trauma_guidance}\n\n`;
  }

  if (p.rapport_connection) text += `RAPPORT\n${'-'.repeat(20)}\n${p.rapport_connection}\n\n`;

  text += `FOCUS AREA: ${p.primary_bucket?.toUpperCase()}${p.secondary_bucket && p.secondary_bucket !== 'none' ? ' + ' + p.secondary_bucket.toUpperCase() : ''}\n${p.bucket_rationale}\n\n`;

  text += `START WITH THESE STRATEGIES\n${'-'.repeat(20)}\n`;
  (p.try_first||[]).forEach((s,i) => {
    text += `${i+1}. ${s.name} [${s.bucket}]\n`;
    text += `   Why: ${s.why}\n`;
    if (s.the_moves) text += `   How to start: ${s.the_moves}\n`;
    text += '\n';
  });

  if (p.also_consider?.length) {
    text += `ALSO CONSIDER\n${'-'.repeat(20)}\n`;
    p.also_consider.forEach(s => { text += `- ${s.name} [${s.bucket}]: ${s.why}\n`; });
    text += '\n';
  }

  text += `WHAT TO SAY\n${'-'.repeat(20)}\n"${p.what_to_say}"\n\n`;
  if (p.what_not_to_do) text += `WHAT NOT TO DO\n${'-'.repeat(20)}\n${p.what_not_to_do}\n\n`;

  if (p.environment_fits?.length) {
    text += `ENVIRONMENTAL ADJUSTMENTS\n${'-'.repeat(20)}\n`;
    p.environment_fits.forEach(e => { text += `- ${e}\n`; });
    text += '\n';
  }

  text += `REVIEW BY\n${'-'.repeat(20)}\n${p.review_by}\n`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyPlanBtn');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy as Text', 2000); }
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    const btn = document.getElementById('copyPlanBtn');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy as Text', 2000); }
  });
}

// ============================================================
// ONBOARDING TOUR
// ============================================================
const TOUR_STEPS = [
  {
    icon: '🔬',
    title: 'Welcome to the Behavior Intervention Center',
    desc: 'This tool walks you through the 6-step Be a Scientist framework to generate a personalized, data-driven intervention plan for any student.'
  },
  {
    icon: '📋',
    title: 'Complete all 6 steps',
    desc: 'Each step narrows your focus — What, When, Who, Where, Why, and How. After each step the AI gives you a coaching note. Take your time and be specific.'
  },
  {
    icon: '🌟',
    title: 'Add Rapport Builders',
    desc: 'After Step 6, you\'ll add the student\'s interests and hobbies. The AI weaves these directly into recommendations — making strategies feel personal, not generic.'
  },
  {
    icon: '🔍',
    title: 'Quick Strategy Search',
    desc: 'See the purple search button in the bottom-right corner? Tap it anytime to instantly search all 130+ strategies without leaving the page.'
  },
  {
    icon: '📚',
    title: 'Explore the tabs',
    desc: 'The Emotions Hub, Strategy Library, and Resources tabs are packed with frameworks and tools. Saved Plans lets you track progress over time.'
  }
];

let _tourStep = 0;

function startTour() {
  _tourStep = 0;
  document.getElementById('tourOverlay')?.classList.remove('hidden');
  renderTourStep();
}

function renderTourStep() {
  const step = TOUR_STEPS[_tourStep];
  if (!step) { endTour(); return; }
  document.getElementById('tourIcon').textContent = step.icon;
  document.getElementById('tourTitle').textContent = step.title;
  document.getElementById('tourDesc').textContent = step.desc;
  const nextBtn = document.getElementById('tourNext');
  if (nextBtn) nextBtn.textContent = _tourStep === TOUR_STEPS.length - 1 ? "Let's go!" : 'Next';
  // Dots
  const dots = document.getElementById('tourDots');
  if (dots) dots.innerHTML = TOUR_STEPS.map((_,i) =>
    `<div class="tour-dot${i===_tourStep?' active':''}"></div>`).join('');
}

function nextTourStep() {
  _tourStep++;
  if (_tourStep >= TOUR_STEPS.length) { endTour(); return; }
  renderTourStep();
}

function endTour() {
  document.getElementById('tourOverlay')?.classList.add('hidden');
  localStorage.setItem('bic_tour_done', '1');
}

function maybeShowTour() {
  try {
    if (!localStorage.getItem('bic_tour_done')) {
      setTimeout(startTour, 500);
    }
  } catch(e) {}
}

// ============================================================
// BRAIN CARD TOGGLE
// ============================================================
function toggleBrainCard(id) {
  const card = document.getElementById(id);
  if (card) card.classList.toggle('open');
}

// ============================================================
// FEEDBACK SYSTEM
// ============================================================
function openFeedback() {
  const existing = document.getElementById('feedbackModal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'feedbackModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem';
  modal.innerHTML = `<div style="background:white;border-radius:16px;padding:1.5rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:16px;font-weight:700;color:var(--gray-800);margin-bottom:4px">Share Your Feedback</div>
    <div style="font-size:12px;color:var(--gray-500);margin-bottom:1.25rem">Your input helps improve this tool for all educators.</div>
    <div style="margin-bottom:12px">
      <label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:6px">How useful was this tool?</label>
      <div style="display:flex;gap:8px" id="ratingBtns">
        ${[1,2,3,4,5].map(n=>`<button onclick="setRating(${n})" id="rb${n}" style="width:40px;height:40px;border-radius:50%;border:2px solid var(--gray-200);background:white;font-size:18px;cursor:pointer;transition:all .15s">${['😞','😕','😐','🙂','😄'][n-1]}</button>`).join('')}
      </div>
    </div>
    <div style="margin-bottom:12px">
      <label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">Your name <span style="font-weight:400;color:var(--gray-400)">(optional)</span></label>
      <input type="text" id="fbName" placeholder="e.g. Ms. Johnson" style="width:100%;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit">
    </div>
    <div style="margin-bottom:1.25rem">
      <label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">Comments or suggestions</label>
      <textarea id="fbComment" placeholder="What worked well? What would make this more useful?" style="width:100%;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:13px;font-family:inherit;min-height:80px;resize:vertical"></textarea>
    </div>
    <div id="fbStatus" style="font-size:12px;color:var(--gray-500);margin-bottom:10px;min-height:16px"></div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button onclick="document.getElementById('feedbackModal').remove()" style="padding:8px 16px;border:1.5px solid var(--gray-200);border-radius:8px;background:white;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Cancel</button>
      <button onclick="submitFeedback()" style="padding:8px 16px;background:var(--purple);color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Submit</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
}

let _feedbackRating = 0;
function setRating(n) {
  _feedbackRating = n;
  [1,2,3,4,5].forEach(i => {
    const btn = document.getElementById('rb'+i);
    if (btn) btn.style.cssText = `width:40px;height:40px;border-radius:50%;border:2px solid ${i<=n?'var(--purple)':'var(--gray-200)'};background:${i<=n?'var(--purple-light)':'white'};font-size:18px;cursor:pointer;transition:all .15s`;
  });
}

async function submitFeedback() {
  const name = document.getElementById('fbName')?.value.trim() || 'Anonymous';
  const comment = document.getElementById('fbComment')?.value.trim() || '';
  const status = document.getElementById('fbStatus');
  if (!_feedbackRating) { if(status) status.textContent = 'Please select a rating first.'; return; }
  if (status) status.textContent = 'Submitting...';
  try {
    await fetch('/api/overrides-set', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        key: `feedback_${Date.now()}`,
        value: { name, rating: _feedbackRating, comment, date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), timestamp: Date.now() }
      })
    });
    document.getElementById('feedbackModal').remove();
    alert('Thank you for your feedback!');
  } catch(e) {
    if (status) status.textContent = 'Could not submit. Please try again.';
  }
}

// Admin feedback viewer
async function viewFeedback() {
  try {
    const res = await fetch('/api/overrides-get?key=_all_keys');
    // Fetch all feedback entries
    const allRes = await fetch('/api/overrides-get');
    const allData = await allRes.json();
    const feedbackEntries = Object.entries(allData.overrides || {})
      .filter(([k]) => k.startsWith('feedback_'))
      .map(([,v]) => v)
      .sort((a,b) => (b.timestamp||0) - (a.timestamp||0));

    const existing = document.getElementById('feedbackViewModal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'feedbackViewModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto';
    const avgRating = feedbackEntries.length ? (feedbackEntries.reduce((s,e)=>s+(e.rating||0),0)/feedbackEntries.length).toFixed(1) : 'N/A';
    let rows = feedbackEntries.length ? feedbackEntries.map(e=>`
      <div style="padding:10px 0;border-bottom:1px solid var(--gray-100)">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:13px;font-weight:600">${e.name||'Anonymous'}</span>
          <span style="font-size:12px;color:var(--gray-400)">${e.date||''} &bull; ${'⭐'.repeat(e.rating||0)}</span>
        </div>
        <div style="font-size:13px;color:var(--gray-600)">${e.comment||'<em>No comment</em>'}</div>
      </div>`).join('') : '<div style="text-align:center;color:var(--gray-400);padding:2rem">No feedback submitted yet</div>';
    modal.innerHTML = `<div style="background:white;border-radius:16px;padding:1.5rem;max-width:560px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <div><div style="font-size:16px;font-weight:700">Feedback Responses</div><div style="font-size:12px;color:var(--gray-500)">${feedbackEntries.length} responses &bull; Avg rating: ${avgRating}/5</div></div>
        <button onclick="document.getElementById('feedbackViewModal').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--gray-400)">&times;</button>
      </div>
      ${rows}
    </div>`;
    document.body.appendChild(modal);
  } catch(e) { alert('Could not load feedback: ' + e.message); }
}

// ============================================================
// SHAREABLE PLAN LINK
// ============================================================
function generateShareableLink(logId) {
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    const log = logs.find(l => l.id === logId);
    if (!log) return;
    // Encode plan data into URL hash
    const encoded = btoa(encodeURIComponent(JSON.stringify({
      plan: log.fullPlan,
      date: log.dateStr,
      bucket: log.bucket,
      priority: log.priority
    })));
    const url = `${window.location.origin}${window.location.pathname}#plan=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Shareable link copied to clipboard! Anyone with the password can view this plan.');
    }).catch(() => {
      prompt('Copy this link:', url);
    });
  } catch(e) { alert('Could not generate link: ' + e.message); }
}

function checkShareableLink() { /* disabled */ }
function maybeShowSharedPlan() { /* disabled */ }

function maybeShowSharedPlan() {
  if (window._sharedPlan) {
    const {plan, date, bucket, priority} = window._sharedPlan;
    _lastPlan = plan; _lastDate = date;
    document.getElementById('results').style.display = 'block';
    document.getElementById('form').style.display = 'none';
    showResults(plan);
    window._sharedPlan = null;
    history.replaceState(null,'',window.location.pathname);
  }
}

// ============================================================
// CONFIDENCE CHECK
// ============================================================
function runConfidenceCheck() {
  const issues = [];
  if (!data.what?.observables?.length) issues.push('No observables selected in Step 1');
  if (!data.what?.describe?.trim()) issues.push('No behavior description in Step 1');
  if (!data.when?.frequency?.length) issues.push('Frequency not selected in Step 2');
  if (!data.where?.location?.length) issues.push('Location not selected in Step 4');
  if (!data.why?.buckets?.length) issues.push('No intervention bucket selected in Step 5');
  if (!data.how?.goal?.trim()) issues.push('No success goal described in Step 6');
  return issues;
}

function showConfidenceCheck(onProceed) {
  const issues = runConfidenceCheck();
  if (issues.length === 0) { onProceed(); return; }
  const existing = document.getElementById('confidenceModal');
  if (existing) existing.remove();
  window._confidenceProceed = onProceed;
  const modal = document.createElement('div');
  modal.id = 'confidenceModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem';
  modal.innerHTML = `<div style="background:white;border-radius:16px;padding:1.5rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:16px;font-weight:700;color:var(--gray-800);margin-bottom:4px">Before you generate...</div>
    <div style="font-size:13px;color:var(--gray-500);margin-bottom:1rem">A few fields look incomplete. The plan will be more accurate with this information — but you can still generate now.</div>
    <ul style="padding-left:1.2rem;margin-bottom:1.25rem">
      ${issues.map(i=>`<li style="font-size:13px;color:#D97706;margin-bottom:5px;line-height:1.5">${i}</li>`).join('')}
    </ul>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button onclick="document.getElementById('confidenceModal').remove()" style="padding:8px 16px;border:1.5px solid var(--purple);color:var(--purple);border-radius:8px;background:white;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Go back &amp; complete</button>
      <button onclick="document.getElementById('confidenceModal').remove();window._confidenceProceed&&window._confidenceProceed()" style="padding:8px 16px;background:var(--purple);color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Generate anyway</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
}

// ============================================================
// SCHOOL LEARNING SYSTEM
// ============================================================

async function autoLogPlanToUpstash(plan) {
  try {
    const building = document.getElementById('teacherBuilding')?.value?.trim() || 'Unknown';
    const educator = document.getElementById('teacherName')?.value?.trim() || 'Anonymous';
    const entry = {
      ts: Date.now(),
      date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
      building,
      educator,
      bucket: plan.primary_bucket,
      secondary_bucket: plan.secondary_bucket,
      priority: plan.priority,
      trauma: plan.trauma_type || 'none',
      tags: plan.tags || [],
      strategies: (plan.try_first || []).map(s => s.name),
      also_consider: (plan.also_consider || []).map(s => s.name),
      observables: data.what?.observables || [],
      intensity: getIntensity().split('—')[0].trim(),
      effective_strategies: [], // filled in when plan is closed
      outcome: null // filled in when plan is closed
    };
    await fetch('/api/overrides-set', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({key: `plan_log_${entry.ts}`, value: entry})
    });
  } catch(e) { console.warn('Auto-log failed:', e.message); }
}

async function loadSchoolContext() {
  try {
    // Fetch all plan logs from Upstash
    const res = await fetch('/api/overrides-get?key=_plan_index');
    if (!res.ok) return '';
    const data = await res.json();
    const index = data.overrides || {};
    if (!Object.keys(index).length) return '';

    const plans = Object.values(index);
    if (!plans.length) return '';

    // Aggregate patterns
    const bucketCounts = {};
    const strategyCounts = {};
    const traumaCounts = {};
    const observableCounts = {};
    const effectiveStrategies = {};

    plans.forEach(p => {
      // Buckets
      bucketCounts[p.bucket] = (bucketCounts[p.bucket] || 0) + 1;
      // Strategies
      (p.strategies || []).forEach(s => { strategyCounts[s] = (strategyCounts[s] || 0) + 1; });
      // Effective strategies
      (p.effective_strategies || []).forEach(s => { effectiveStrategies[s] = (effectiveStrategies[s] || 0) + 1; });
      // Trauma
      if (p.trauma && p.trauma !== 'none') traumaCounts[p.trauma] = (traumaCounts[p.trauma] || 0) + 1;
      // Observables
      (p.observables || []).forEach(o => { observableCounts[o] = (observableCounts[o] || 0) + 1; });
    });

    const topBuckets = Object.entries(bucketCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k} (${v} plans)`).join(', ');
    const topStrategies = Object.entries(strategyCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`${k} (${v}x)`).join(', ');
    const topEffective = Object.entries(effectiveStrategies).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`${k} (${v} educators confirmed effective)`).join(', ');
    const topTrauma = Object.entries(traumaCounts).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k,v])=>`${k} (${v} plans)`).join(', ');
    const topObservables = Object.entries(observableCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k])=>k).join(', ');

    return `\n\nSCHOOL LEARNING CONTEXT (${plans.length} plans generated at this school):
Most common intervention buckets: ${topBuckets || 'N/A'}
Most frequently recommended strategies: ${topStrategies || 'N/A'}
Strategies confirmed effective by educators: ${topEffective || 'Not yet tracked'}
Most common trauma responses: ${topTrauma || 'N/A'}
Most common observables: ${topObservables || 'N/A'}
Use this context to inform your recommendations — prioritize strategies confirmed effective in this school when appropriate, and be aware of patterns that may indicate school-wide needs.`;
  } catch(e) {
    console.warn('Could not load school context:', e.message);
    return '';
  }
}

async function updatePlanIndex(entry) {
  // Maintain a rolling index of all plan summaries for fast retrieval
  try {
    const res = await fetch('/api/overrides-get?key=_plan_index');
    const existing = res.ok ? (await res.json()).overrides || {} : {};
    existing[`plan_${entry.ts}`] = entry;
    await fetch('/api/overrides-set', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({key: '_plan_index', value: existing})
    });
  } catch(e) { console.warn('Index update failed:', e.message); }
}

// Update autoLogPlanToUpstash to also update the index
async function autoLogPlanToUpstash(plan) {
  try {
    const building = document.getElementById('teacherBuilding')?.value?.trim() || 'Unknown';
    const educator = document.getElementById('teacherName')?.value?.trim() || 'Anonymous';
    const entry = {
      ts: Date.now(),
      date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
      building,
      educator,
      bucket: plan.primary_bucket,
      secondary_bucket: plan.secondary_bucket,
      priority: plan.priority,
      trauma: plan.trauma_type || 'none',
      tags: plan.tags || [],
      strategies: (plan.try_first || []).map(s => s.name),
      also_consider: (plan.also_consider || []).map(s => s.name),
      observables: data?.what?.observables || [],
      intensity: getIntensity().split('—')[0].trim(),
      effective_strategies: [],
      outcome: null
    };
    await updatePlanIndex(entry);
  } catch(e) { console.warn('Auto-log failed:', e.message); }
}

async function markStrategiesEffective(logId, strategies) {
  try {
    // Update the plan index with effective strategies
    const res = await fetch('/api/overrides-get?key=_plan_index');
    const existing = res.ok ? (await res.json()).overrides || {} : {};
    const key = `plan_${logId}`;
    if (existing[key]) {
      existing[key].effective_strategies = strategies;
      existing[key].outcome = 'closed';
      await fetch('/api/overrides-set', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({key: '_plan_index', value: existing})
      });
    }
  } catch(e) { console.warn('Could not mark strategies:', e.message); }
}

function openEffectivenessModal(logId, strategies) {
  const existing = document.getElementById('effectModal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'effectModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem';
  modal.innerHTML = `<div style="background:white;border-radius:16px;padding:1.5rem;max-width:460px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:16px;font-weight:700;color:var(--gray-800);margin-bottom:4px">Before closing this plan...</div>
    <div style="font-size:13px;color:var(--gray-500);margin-bottom:1rem">Which strategies actually worked? This helps the AI make better recommendations for future plans at your school.</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:1.25rem">
      ${strategies.map((s,i) => `<label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:8px;cursor:pointer;font-size:13px">
        <input type="checkbox" id="eff_${i}" value="${s}" style="width:16px;height:16px;accent-color:var(--purple)">
        ${s}
      </label>`).join('')}
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button onclick="document.getElementById('effectModal').remove();closeLogWithoutTracking('${logId}')" style="padding:8px 16px;border:1.5px solid var(--gray-200);border-radius:8px;background:white;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Skip</button>
      <button onclick="saveEffectiveness('${logId}',${strategies.length})" style="padding:8px 16px;background:var(--purple);color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Save & Close Plan</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
}

async function saveEffectiveness(logId, count) {
  const effective = [];
  for (let i = 0; i < count; i++) {
    const cb = document.getElementById(`eff_${i}`);
    if (cb?.checked) effective.push(cb.value);
  }
  document.getElementById('effectModal')?.remove();
  await markStrategiesEffective(logId, effective);
  closeLogWithoutTracking(logId);
}

function closeLogWithoutTracking(id) {
  try {
    const logs = JSON.parse(localStorage.getItem('bic_logs') || '[]');
    const log = logs.find(l => l.id === id);
    if (log) { log.status = 'closed'; localStorage.setItem('bic_logs', JSON.stringify(logs)); }
    renderLogs();
  } catch(e) {}
}

async function showAdminInsights() {
  try {
    const res = await fetch('/api/overrides-get?key=_plan_index');
    const plans = Object.values(res.ok ? (await res.json()).overrides || {} : {});

    const existing = document.getElementById('insightsModal');
    if (existing) existing.remove();

    if (!plans.length) {
      alert('No plans have been generated yet. Insights will appear after educators start using the tool.');
      return;
    }

    // Aggregate
    const total = plans.length;
    const buildings = {};
    const buckets = {};
    const strategies = {};
    const effective = {};
    const trauma = {};
    const byDate = {};

    plans.forEach(p => {
      if (p.building) buildings[p.building] = (buildings[p.building] || 0) + 1;
      if (p.bucket) buckets[p.bucket] = (buckets[p.bucket] || 0) + 1;
      (p.strategies || []).forEach(s => { strategies[s] = (strategies[s] || 0) + 1; });
      (p.effective_strategies || []).forEach(s => { effective[s] = (effective[s] || 0) + 1; });
      if (p.trauma && p.trauma !== 'none') trauma[p.trauma] = (trauma[p.trauma] || 0) + 1;
      const week = p.date ? p.date.split(',')[0] : 'Unknown';
      byDate[week] = (byDate[week] || 0) + 1;
    });

    const topBuckets = Object.entries(buckets).sort((a,b)=>b[1]-a[1]);
    const topStrategies = Object.entries(strategies).sort((a,b)=>b[1]-a[1]).slice(0,10);
    const topEffective = Object.entries(effective).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const topTrauma = Object.entries(trauma).sort((a,b)=>b[1]-a[1]);
    const topBuildings = Object.entries(buildings).sort((a,b)=>b[1]-a[1]);

    const modal = document.createElement('div');
    modal.id = 'insightsModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto';
    modal.innerHTML = `<div style="background:white;border-radius:16px;padding:1.5rem;max-width:640px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;padding-bottom:10px;border-bottom:1px solid var(--gray-100)">
        <div>
          <div style="font-size:18px;font-weight:800;color:var(--gray-800)">School Insights</div>
          <div style="font-size:12px;color:var(--gray-400)">${total} plans generated across your school</div>
        </div>
        <button onclick="document.getElementById('insightsModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--gray-400)">&times;</button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:1.25rem">
        <div style="background:var(--purple-light);border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:var(--purple)">${total}</div>
          <div style="font-size:12px;color:var(--purple)">Plans Generated</div>
        </div>
        <div style="background:#DCFCE7;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:#14532D">${Object.keys(buildings).length}</div>
          <div style="font-size:12px;color:#14532D">Buildings</div>
        </div>
        <div style="background:#FEF3C7;border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:#92400E">${Object.keys(effective).length}</div>
          <div style="font-size:12px;color:#92400E">Effective Strategies Confirmed</div>
        </div>
      </div>

      ${topBuildings.length ? `<div style="margin-bottom:1.25rem">
        <div style="font-size:13px;font-weight:700;color:var(--gray-700);margin-bottom:8px">Plans by Building</div>
        ${topBuildings.map(([b,c])=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--gray-100);font-size:13px"><span>${b}</span><span style="font-weight:700;color:var(--purple)">${c} plans</span></div>`).join('')}
      </div>` : ''}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1.25rem">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--gray-700);margin-bottom:8px">Intervention Buckets</div>
          ${topBuckets.map(([b,c])=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--gray-100);font-size:12px"><span style="text-transform:capitalize">${b}</span><span style="font-weight:700;color:${bColor(b)}">${c} (${Math.round(c/total*100)}%)</span></div>`).join('')}
        </div>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--gray-700);margin-bottom:8px">Trauma Responses</div>
          ${topTrauma.length ? topTrauma.map(([t,c])=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--gray-100);font-size:12px"><span style="text-transform:capitalize">${t}</span><span style="font-weight:700">${c}</span></div>`).join('') : '<div style="font-size:12px;color:var(--gray-400)">Not yet tracked</div>'}
        </div>
      </div>

      <div style="margin-bottom:1.25rem">
        <div style="font-size:13px;font-weight:700;color:var(--gray-700);margin-bottom:8px">Most Recommended Strategies</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${topStrategies.map(([s,c])=>`<span style="background:var(--gray-100);border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600;color:var(--gray-700)">${s} <span style="color:var(--purple)">${c}x</span></span>`).join('')}
        </div>
      </div>

      ${topEffective.length ? `<div style="background:#DCFCE7;border-radius:10px;padding:12px;margin-bottom:1.25rem">
        <div style="font-size:13px;font-weight:700;color:#14532D;margin-bottom:8px">Confirmed Effective by Educators</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${topEffective.map(([s,c])=>`<span style="background:white;border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600;color:#14532D">${s} <span style="color:#16A34A">${c} educators</span></span>`).join('')}
        </div>
      </div>` : ''}

      <div style="text-align:center;padding-top:10px;border-top:1px solid var(--gray-100)">
        <div style="font-size:11px;color:var(--gray-400)">Data is anonymized. No student names or identifying information is stored.</div>
      </div>
    </div>`;
    document.body.appendChild(modal);
  } catch(e) { alert('Could not load insights: ' + e.message); }
}

// ============================================================
// INIT
// ============================================================
try { render(); } catch(e) { console.error('render',e); }
try { renderLibrary(); } catch(e) { console.error('renderLibrary',e); }
try { renderResources(); } catch(e) { console.error('renderResources',e); }
try { updateLogBadge(); } catch(e) {}
try { initDark(); } catch(e) {}
try { initAuth(); } catch(e) { console.error('initAuth',e); }
try { renderStrategyOfDay(); } catch(e) {}
setTimeout(() => { try { applyGlossaryTooltips(); } catch(e) {} }, 500);
// Load overrides and re-render with any saved edits
setTimeout(() => {
  try {
    loadOverrides().then(() => {
      try { renderLibrary(); } catch(e) {}
      try { renderResources(); } catch(e) {}
      try { applyHeaderOverrides(); } catch(e) {}
    }).catch((e) => { console.error('loadOverrides', e); });
  } catch(e) { console.error('loadOverrides init', e); }
}, 300);
