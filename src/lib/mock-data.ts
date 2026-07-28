import type { Category, Conversation, FAQ, Resource } from "@/types";

export const CATEGORY_LABEL: Record<Category, string> = {
  admissions: "Admissions",
  registration: "Course Registration",
  fees: "Tuition & Fees",
  examinations: "Examinations",
  graduation: "Graduation",
  calendar: "Academic Calendar",
  policies: "Academic Policies",
  campus: "Campus Services",
  support: "Student Support",
};

export const CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];

export const SAMPLE_PROMPTS = [
  "How do I register for courses this semester?",
  "What are the graduation requirements for my program?",
  "When does the examination period begin?",
  "How can I pay my tuition fees online?",
  "How do I request an official transcript?",
];

export const mockConversations: Conversation[] = [
  {
    id: "c-001",
    title: "Course registration deadline",
    category: "registration",
    updatedAt: "2026-07-20T09:12:00Z",
    saved: true,
    messages: [
      {
        id: "m-1",
        role: "user",
        content: "When is the deadline for course registration this semester?",
        createdAt: "2026-07-20T09:11:00Z",
      },
      {
        id: "m-2",
        role: "assistant",
        content:
          "Course registration for the current semester follows this schedule:\n\n1. Priority registration opens two weeks before the term begins.\n2. Open registration runs through the first week of classes.\n3. Late registration continues for one additional week with a processing fee.\n\nYou can register from the Student Portal under Academic Services. If you are on academic probation, please meet with your advisor before registering.",
        createdAt: "2026-07-20T09:12:00Z",
        sources: [
          { title: "Academic Registration Guide", reference: "Section 3.2" },
          { title: "Academic Calendar 2026", reference: "Fall term" },
        ],
        suggestions: [
          "How do I add or drop a course?",
          "What if a course is full?",
          "How do I contact my academic advisor?",
        ],
        feedback: "helpful",
      },
    ],
  },
  {
    id: "c-002",
    title: "Graduation requirements",
    category: "graduation",
    updatedAt: "2026-07-18T14:03:00Z",
    messages: [
      {
        id: "m-3",
        role: "user",
        content: "What do I need to check before applying to graduate?",
        createdAt: "2026-07-18T14:02:00Z",
      },
      {
        id: "m-4",
        role: "assistant",
        content:
          "Before applying to graduate, verify the following:\n\n- All required core and major credits are completed or in progress.\n- Your cumulative GPA meets the minimum for your program.\n- Any outstanding tuition or library balances are cleared.\n- Your program's capstone or thesis requirement is on file.\n\nSubmit the graduation application through the Student Portal at least one full semester before your intended graduation term.",
        createdAt: "2026-07-18T14:03:00Z",
        sources: [{ title: "Graduation Requirements Handbook", reference: "Chapter 2" }],
        suggestions: ["How do I apply for graduation?", "What is a capstone?"],
      },
    ],
  },
  {
    id: "c-003",
    title: "Tuition payment options",
    category: "fees",
    updatedAt: "2026-07-15T10:44:00Z",
    messages: [
      {
        id: "m-5",
        role: "user",
        content: "What payment plans are available for tuition?",
        createdAt: "2026-07-15T10:43:00Z",
      },
      {
        id: "m-6",
        role: "assistant",
        content:
          "Standard payment options include full payment at the start of term, a monthly installment plan, and approved sponsor billing. Financial aid disbursements are applied automatically. Contact the Bursar's Office for hardship arrangements.",
        createdAt: "2026-07-15T10:44:00Z",
        sources: [{ title: "Tuition & Fees Policy", reference: "Section 4" }],
      },
    ],
  },
];

export const mockFaqs: FAQ[] = [
  {
    id: "f-1",
    question: "How do I register for my courses?",
    answer:
      "Log into the Student Portal, go to Academic Services > Register, choose your term, add courses from the catalog, and submit. Confirm your schedule under My Enrollments.",
    category: "registration",
    updatedAt: "2026-06-30",
  },
  {
    id: "f-2",
    question: "When do examinations begin?",
    answer:
      "Final examinations begin in the last week of each academic term. Individual exam times are posted on the Academic Calendar and Student Portal two weeks before the exam period.",
    category: "examinations",
    updatedAt: "2026-06-30",
  },
  {
    id: "f-3",
    question: "How can I check my graduation requirements?",
    answer:
      "The Degree Audit tool on the Student Portal lists all completed, in-progress, and remaining requirements for your program.",
    category: "graduation",
    updatedAt: "2026-06-30",
  },
  {
    id: "f-4",
    question: "How do I contact student support?",
    answer:
      "You can contact student support through the Help page in the application, or reach the Student Services desk during posted office hours.",
    category: "support",
    updatedAt: "2026-06-30",
  },
  {
    id: "f-5",
    question: "How do I pay my tuition fees?",
    answer:
      "Tuition can be paid online through the Student Portal via bank transfer, card, or approved installment plan. Payment receipts are issued automatically.",
    category: "fees",
    updatedAt: "2026-06-30",
  },
  {
    id: "f-6",
    question: "How do I apply for admission?",
    answer:
      "New students apply through the Admissions Office online portal. Application windows and required documents are listed on the Admissions page.",
    category: "admissions",
    updatedAt: "2026-06-30",
  },
  {
    id: "f-7",
    question: "Where can I find the academic calendar?",
    answer:
      "The current academic calendar is published in the Academic Resources section of this application and on the Institution Name website.",
    category: "calendar",
    updatedAt: "2026-06-30",
  },
  {
    id: "f-8",
    question: "What campus services are available to students?",
    answer:
      "Campus services include the library, health center, counseling, career services, IT support, and student housing. Availability and hours are listed under Campus Services.",
    category: "campus",
    updatedAt: "2026-06-30",
  },
];

export const mockResources: Resource[] = [
  {
    id: "r-1",
    title: "Student Handbook",
    description: "Comprehensive guide to student rights, responsibilities, and services.",
    category: "policies",
    updatedAt: "2026-05-12",
    fileType: "PDF",
  },
  {
    id: "r-2",
    title: "Academic Calendar 2026-2027",
    description: "Term dates, holidays, and important academic deadlines.",
    category: "calendar",
    updatedAt: "2026-06-01",
    fileType: "PDF",
  },
  {
    id: "r-3",
    title: "Course Registration Guide",
    description: "Step-by-step instructions for registering, adding, and dropping courses.",
    category: "registration",
    updatedAt: "2026-06-15",
    fileType: "PDF",
  },
  {
    id: "r-4",
    title: "Examination Regulations",
    description: "Rules, conduct, and procedures for scheduled examinations.",
    category: "examinations",
    updatedAt: "2026-05-30",
    fileType: "PDF",
  },
  {
    id: "r-5",
    title: "Graduation Requirements",
    description: "Requirements checklist and application procedures for graduation.",
    category: "graduation",
    updatedAt: "2026-04-22",
    fileType: "PDF",
  },
  {
    id: "r-6",
    title: "Tuition and Fee Information",
    description: "Current tuition rates, fees, and payment procedures.",
    category: "fees",
    updatedAt: "2026-06-20",
    fileType: "PDF",
  },
];

export function generateAiResponse(question: string): {
  content: string;
  sources: { title: string; reference: string }[];
  suggestions: string[];
} {
  const q = question.toLowerCase();
  let category: Category = "support";
  if (q.includes("regist") || q.includes("course") || q.includes("enroll")) category = "registration";
  else if (q.includes("fee") || q.includes("tuition") || q.includes("pay")) category = "fees";
  else if (q.includes("exam") || q.includes("test")) category = "examinations";
  else if (q.includes("graduat") || q.includes("degree")) category = "graduation";
  else if (q.includes("admiss") || q.includes("apply")) category = "admissions";
  else if (q.includes("calendar") || q.includes("date") || q.includes("deadline")) category = "calendar";

  const bodies: Record<Category, string> = {
    registration:
      "Course registration is handled through the Student Portal:\n\n1. Sign in and open Academic Services.\n2. Select the current term and browse the course catalog.\n3. Add courses to your plan and check for prerequisite requirements.\n4. Submit and confirm your final schedule.\n\nIf a course is full, you may join the waitlist. Contact your academic advisor if you cannot resolve a scheduling conflict.",
    fees:
      "Tuition and fees can be paid through the Student Portal:\n\n- Full payment at the start of the term.\n- Monthly installment plan (enrollment required each term).\n- Approved sponsor or scholarship billing.\n\nOfficial receipts are issued automatically. For hardship or extension requests, contact the Bursar's Office.",
    examinations:
      "The examination period runs during the final two weeks of each term.\n\n- Individual exam schedules are published two weeks before the exam period.\n- Bring your student ID and required materials only.\n- If you have a scheduling conflict, request accommodation from the Examinations Office in advance.",
    graduation:
      "To graduate, verify that:\n\n- All core, major, and elective credits are completed.\n- Your cumulative GPA meets the program minimum.\n- Outstanding balances are cleared.\n- Any capstone or thesis requirement is on file.\n\nSubmit the graduation application at least one full semester before your intended graduation term.",
    admissions:
      "Admissions applications are submitted through the Institution Name admissions portal.\n\n- Review program requirements and deadlines.\n- Prepare academic transcripts and supporting documents.\n- Submit the application before the posted deadline.\n\nDecisions are communicated by email.",
    calendar:
      "The current academic calendar is published in the Academic Resources section of this application. It lists term start and end dates, registration windows, examination periods, and official holidays.",
    policies:
      "Academic policies are documented in the Student Handbook. They cover attendance, academic integrity, grading, appeals, and student conduct.",
    campus:
      "Campus services include the library, health center, counseling, career services, IT support, and student housing. Hours and contact information are listed under Campus Services.",
    support:
      "Student support is available through this application, at the Student Services desk, and by email. For urgent matters outside office hours, use the Help page to submit a request.",
  };

  const sources: Record<Category, { title: string; reference: string }[]> = {
    registration: [{ title: "Academic Registration Guide", reference: "Section 3" }],
    fees: [{ title: "Tuition & Fees Policy", reference: "Section 4" }],
    examinations: [{ title: "Examination Regulations", reference: "Chapter 2" }],
    graduation: [{ title: "Graduation Requirements Handbook", reference: "Chapter 2" }],
    admissions: [{ title: "Admissions Guide", reference: "Section 1" }],
    calendar: [{ title: "Academic Calendar", reference: "Current term" }],
    policies: [{ title: "Student Handbook", reference: "Policies" }],
    campus: [{ title: "Campus Services Directory", reference: "Overview" }],
    support: [{ title: "Student Support Guide", reference: "Overview" }],
  };

  const suggestions: Record<Category, string[]> = {
    registration: ["How do I add or drop a course?", "What if a course is full?"],
    fees: ["How do I set up a payment plan?", "Where can I find my invoice?"],
    examinations: ["Can I reschedule an exam?", "Where do I find my exam schedule?"],
    graduation: ["How do I apply for graduation?", "What is a degree audit?"],
    admissions: ["What documents do I need?", "When is the admissions deadline?"],
    calendar: ["When does the next term begin?", "When are the holidays?"],
    policies: ["What is the attendance policy?", "How do I appeal a grade?"],
    campus: ["What are the library hours?", "How do I access counseling?"],
    support: ["How do I contact a human advisor?", "How do I report an issue?"],
  };

  return {
    content: bodies[category],
    sources: sources[category],
    suggestions: suggestions[category],
  };
}
