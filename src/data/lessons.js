// Dummy data for lessons
export const lessons = [
  // Fractions lessons
  {
    id: "fractions-intro",
    topicId: "fractions",
    lessonNumber: 1,
    title: "What is a Fraction?",
    duration: 10,
    status: "completed",
    content: "A fraction represents a part of a whole. When we divide something into equal parts, each part is a fraction of the whole.",
    examples: [
      {
        latex: "\\frac{1}{2}",
        explanation: "One half - when you divide something into 2 equal parts and take 1"
      },
      {
        latex: "\\frac{3}{4}",
        explanation: "Three quarters - divide into 4 parts, take 3"
      }
    ],
    practiceProblems: [
      { question: "What fraction is shaded if 1 out of 4 parts is colored?", answer: "\\frac{1}{4}" },
      { question: "Write the fraction for three out of five parts", answer: "\\frac{3}{5}" }
    ]
  },
  {
    id: "fractions-numerator-denominator",
    topicId: "fractions",
    lessonNumber: 2,
    title: "Numerator and Denominator",
    duration: 12,
    status: "completed",
    content: "Every fraction has two parts: the numerator (top number) tells us how many parts we have, and the denominator (bottom number) tells us how many equal parts the whole is divided into.",
    examples: [
      {
        latex: "\\frac{\\text{numerator}}{\\text{denominator}} = \\frac{3}{5}",
        explanation: "3 is the numerator, 5 is the denominator"
      }
    ],
    practiceProblems: [
      { question: "In the fraction 7/8, what is the numerator?", answer: "7" },
      { question: "In the fraction 2/3, what is the denominator?", answer: "3" }
    ]
  },
  {
    id: "fractions-equivalent",
    topicId: "fractions",
    lessonNumber: 3,
    title: "Equivalent Fractions",
    duration: 15,
    status: "in_progress",
    content: "Equivalent fractions are different fractions that represent the same value. You can create equivalent fractions by multiplying or dividing both the numerator and denominator by the same number.",
    examples: [
      {
        latex: "\\frac{1}{2} = \\frac{2}{4} = \\frac{3}{6} = \\frac{4}{8}",
        explanation: "All these fractions represent the same amount - one half"
      }
    ],
    practiceProblems: [
      { question: "Find an equivalent fraction to 1/3", answer: "\\frac{2}{6}" }
    ]
  },

  // Algebra lessons
  {
    id: "algebra-variables",
    topicId: "algebra-basics",
    lessonNumber: 1,
    title: "Introduction to Variables",
    duration: 15,
    status: "completed",
    content: "A variable is a letter or symbol that represents an unknown number. Variables allow us to write general expressions and equations.",
    examples: [
      {
        latex: "x + 5 = 10",
        explanation: "Here x is a variable representing an unknown number. We can solve to find x = 5"
      },
      {
        latex: "2y = 14",
        explanation: "The variable y represents a number. Since 2 × 7 = 14, y = 7"
      }
    ],
    practiceProblems: [
      { question: "If x + 3 = 8, what is x?", answer: "5" }
    ]
  },
  {
    id: "algebra-expressions",
    topicId: "algebra-basics",
    lessonNumber: 2,
    title: "Algebraic Expressions",
    duration: 18,
    status: "completed",
    content: "An algebraic expression combines numbers, variables, and operations. Expressions can be simplified and evaluated for specific values of variables.",
    examples: [
      {
        latex: "3x + 2x = 5x",
        explanation: "We can combine like terms - both have x"
      },
      {
        latex: "2(x + 4) = 2x + 8",
        explanation: "Using the distributive property"
      }
    ],
    practiceProblems: [
      { question: "Simplify: 4x + 3x", answer: "7x" },
      { question: "Expand: 3(y + 2)", answer: "3y + 6" }
    ]
  },

  // Calculus lessons
  {
    id: "limits-intro",
    topicId: "calculus-limits",
    lessonNumber: 1,
    title: "Introduction to Limits",
    duration: 20,
    status: "completed",
    content: "A limit describes the value that a function approaches as the input approaches some value. Limits are fundamental to calculus and help define derivatives and integrals.",
    examples: [
      {
        latex: "\\lim_{x \\to 2} (x^2) = 4",
        explanation: "As x gets closer to 2, x² gets closer to 4"
      },
      {
        latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1",
        explanation: "A famous limit used throughout calculus"
      }
    ],
    practiceProblems: [
      { question: "Find the limit: lim(x→3) of (x + 1)", answer: "4" }
    ]
  },
  {
    id: "limits-properties",
    topicId: "calculus-limits",
    lessonNumber: 2,
    title: "Properties of Limits",
    duration: 25,
    status: "in_progress",
    content: "Limits follow several important properties: the limit of a sum is the sum of limits, the limit of a product is the product of limits, and the limit of a quotient is the quotient of limits (when denominator limit ≠ 0).",
    examples: [
      {
        latex: "\\lim_{x \\to a} [f(x) + g(x)] = \\lim_{x \\to a} f(x) + \\lim_{x \\to a} g(x)",
        explanation: "Sum property of limits"
      },
      {
        latex: "\\lim_{x \\to a} [c \\cdot f(x)] = c \\cdot \\lim_{x \\to a} f(x)",
        explanation: "Constant multiple property"
      }
    ],
    practiceProblems: [
      { question: "If lim f(x) = 3 and lim g(x) = 2, find lim[f(x) + g(x)]", answer: "5" }
    ]
  },
  {
    id: "derivatives-intro",
    topicId: "derivatives",
    lessonNumber: 1,
    title: "The Derivative Concept",
    duration: 25,
    status: "completed",
    content: "The derivative measures the instantaneous rate of change of a function. It represents the slope of the tangent line to a curve at any point.",
    examples: [
      {
        latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        explanation: "The formal definition of a derivative"
      },
      {
        latex: "\\frac{d}{dx}(x^2) = 2x",
        explanation: "The derivative of x² is 2x"
      }
    ],
    practiceProblems: [
      { question: "Find the derivative of f(x) = x³", answer: "3x^2" }
    ]
  }
];

export const getLessonsByTopic = (topicId) => {
  return lessons.filter(l => l.topicId === topicId);
};

export const getLessonById = (id) => {
  return lessons.find(l => l.id === id);
};
