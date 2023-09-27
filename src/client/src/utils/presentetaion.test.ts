import {
  Answers,
  Choice,
  LocalProject,
  LocalQuestion,
  LocalStatusAccept,
  LocalStatusCalculate,
  LocalStatusCheck,
  LocalStatusEnd,
  LocalStatusRank,
  LocalStatusStart,
  ParticipantMap,
  SlidePage,
  UserRecord,
} from "@/firebase/db";
import dayjs from "dayjs";
import {
  createAnswers,
  createRanking,
  createSlidePages,
  getNextStatus,
  getPreviousStatus,
  StatusError,
} from "./presentation";

const choices1: Choice[] = [
  {
    id: "C1",
    label: "Alpha",
    isCorrect: true,
  },
  {
    id: "C2",
    label: "Beta",
    isCorrect: false,
  },
];

const choices2: Choice[] = [
  {
    id: "C1",
    label: "gamma",
    isCorrect: true,
  },
  {
    id: "C2",
    label: "delta",
    isCorrect: false,
  },
  {
    id: "C3",
    label: "epsilon",
    isCorrect: false,
  },
];

const questions: LocalQuestion[] = [
  {
    id: "Q1",
    title: "Question 1",
    choices: choices1,
  },
  { id: "Q2", title: "Question 2", choices: choices2 },
];
const project: LocalProject = {
  id: "PJ1",
  name: "",
  createDate: dayjs(),
  slide: {
    questions,
  },
};

const participantMap: ParticipantMap = {
  U1: {
    joinDate: 1656079414,
    displayName: "User 1",
    iconUrl: "https://example.com/",
    answers: {
      Q1: ["C1"],
      Q2: ["C1"],
    },
  },
  U2: {
    joinDate: 1656079677,
    displayName: "User 2",
    iconUrl: "https://example.com/",
    answers: {
      Q1: ["C1"],
      Q2: ["C3"],
    },
  },
  U3: {
    joinDate: 1656079537,
    displayName: "User 3",
    iconUrl: "https://example.com/",
    answers: {
      Q1: ["C2"],
      Q2: ["C1"],
    },
  },
  U4: {
    joinDate: 1656079749,
    displayName: "User 4",
    iconUrl: "https://example.com/",
    answers: {
      Q1: ["C2"],
      Q2: [],
    },
  },
};

test("convert project to slide pages", () => {
  const pages = createSlidePages(project);
  const expected: SlidePage[] = [
    { type: "start", index: 1 },
    {
      type: "question",
      question: {
        id: "Q1",
        title: "Question 1",
        choices: choices1,
        index: 1,
      },
      index: 2,
    },
    {
      type: "question",
      question: {
        id: "Q2",
        title: "Question 2",
        choices: choices2,
        index: 2,
      },
      index: 3,
    },
    {
      type: "rank",
      index: 4,
      ranking: [],
    },
    {
      type: "end",
      index: 5,
    },
  ];
  expect(pages).toEqual(expected);
});

test("convert participants map to answers", () => {
  const answers = createAnswers(participantMap);
  const expected: Answers = {
    Q1: {
      answeredUsers: ["U1", "U2", "U3", "U4"],
      choices: {
        C1: ["U1", "U2"],
        C2: ["U3", "U4"],
      },
    },
    Q2: {
      answeredUsers: ["U1", "U2", "U3"],
      choices: {
        C1: ["U1", "U3"],
        C3: ["U2"],
      },
    },
  };
  expect(answers).toEqual(expected);
});

describe("create ranking", () => {
  test("ranks: 1, 2, 2, 4", () => {
    const participants = participantMap;
    const expected: UserRecord[] = [
      {
        userId: "U1",
        displayName: "User 1",
        iconUrl: "https://example.com/",
        points: 2,
        rank: 1,
      },
      {
        userId: "U3",
        displayName: "User 3",
        iconUrl: "https://example.com/",
        points: 1,
        rank: 2,
      },
      {
        userId: "U2",
        displayName: "User 2",
        iconUrl: "https://example.com/",
        points: 1,
        rank: 2,
      },
      {
        userId: "U4",
        displayName: "User 4",
        iconUrl: "https://example.com/",
        points: 0,
        rank: 4,
      },
    ];
    expect(createRanking(questions, participants)).toEqual(expected);
  });

  test("ranks: 1, 1, 3, 4", () => {
    const participants: ParticipantMap = {
      U1: {
        ...participantMap.U1,
        answers: {
          Q1: ["C1"],
          Q2: ["C1"],
        },
      },
      U2: {
        ...participantMap.U2,
        answers: {
          Q1: [],
          Q2: ["C3"],
        },
      },
      U3: {
        ...participantMap.U3,
        answers: {
          Q1: ["C1"],
          Q2: ["C1"],
        },
      },
      U4: {
        ...participantMap.U4,
        answers: {
          Q1: ["C3"],
          Q2: ["C1"],
        },
      },
    };
    const expected: UserRecord[] = [
      {
        userId: "U1",
        displayName: "User 1",
        iconUrl: "https://example.com/",
        points: 2,
        rank: 1,
      },
      {
        userId: "U3",
        displayName: "User 3",
        iconUrl: "https://example.com/",
        points: 2,
        rank: 1,
      },

      {
        userId: "U4",
        displayName: "User 4",
        iconUrl: "https://example.com/",
        points: 1,
        rank: 3,
      },
      {
        userId: "U2",
        displayName: "User 2",
        iconUrl: "https://example.com/",
        points: 0,
        rank: 4,
      },
    ];

    expect(createRanking(questions, participants)).toEqual(expected);
  });
});

describe("PresentationStatus", () => {
  const date = dayjs.unix(1656082042);
  const statusStart: LocalStatusStart = {
    type: "start",
  };
  const statusAccept1: LocalStatusAccept = {
    type: "accept",
    startDate: date,
    question: {
      id: "Q1",
      title: "Question 1",
      choices: [
        {
          id: "C1",
          label: "Alpha",
        },
        {
          id: "C2",
          label: "Beta",
        },
      ],
    },
  };
  const statusCalculate1: LocalStatusCalculate = {
    type: "calculate",
    startDate: date,
    question: {
      id: "Q1",
      title: "Question 1",
      choices: [
        {
          id: "C1",
          label: "Alpha",
          selectedRate: 2 / 4,
        },
        {
          id: "C2",
          label: "Beta",
          selectedRate: 2 / 4,
        },
      ],
    },
  };
  const statusCheck1: LocalStatusCheck = {
    type: "check",
    startDate: date,
    question: {
      id: "Q1",
      title: "Question 1",
      choices: [
        {
          id: "C1",
          label: "Alpha",
          selectedRate: 2 / 4,
          isCorrect: true,
        },
        {
          id: "C2",
          label: "Beta",
          selectedRate: 2 / 4,
          isCorrect: false,
        },
      ],
    },
  };
  const statusAccept2: LocalStatusAccept = {
    type: "accept",
    startDate: date,
    question: {
      id: "Q2",
      title: "Question 2",
      choices: [
        {
          id: "C1",
          label: "gamma",
        },
        {
          id: "C2",
          label: "delta",
        },
        {
          id: "C3",
          label: "epsilon",
        },
      ],
    },
  };
  const statusCalculate2: LocalStatusCalculate = {
    type: "calculate",
    startDate: date,
    question: {
      id: "Q2",
      title: "Question 2",
      choices: [
        {
          id: "C1",
          label: "gamma",
          selectedRate: 2 / 3,
        },
        {
          id: "C2",
          label: "delta",
          selectedRate: 0,
        },
        {
          id: "C3",
          label: "epsilon",
          selectedRate: 1 / 3,
        },
      ],
    },
  };

  const statusCheck2: LocalStatusCheck = {
    type: "check",
    startDate: date,
    question: {
      id: "Q2",
      title: "Question 2",
      choices: [
        {
          id: "C1",
          label: "gamma",
          selectedRate: 2 / 3,
          isCorrect: true,
        },
        {
          id: "C2",
          label: "delta",
          selectedRate: 0,
          isCorrect: false,
        },
        {
          id: "C3",
          label: "epsilon",
          selectedRate: 1 / 3,
          isCorrect: false,
        },
      ],
    },
  };
  const statusRank: LocalStatusRank = {
    type: "rank",
    records: [
      {
        userId: "U1",
        displayName: "User 1",
        iconUrl: "https://example.com/",
        points: 2,
        rank: 1,
      },
      {
        userId: "U3",
        displayName: "User 3",
        iconUrl: "https://example.com/",
        points: 1,
        rank: 2,
      },
      {
        userId: "U2",
        displayName: "User 2",
        iconUrl: "https://example.com/",
        points: 1,
        rank: 2,
      },
      {
        userId: "U4",
        displayName: "User 4",
        iconUrl: "https://example.com/",
        points: 0,
        rank: 4,
      },
    ],
  };
  const statusEnd: LocalStatusEnd = {
    type: "end",
  };

  test("start -> accept (Question 1)", () => {
    expect(getNextStatus(statusStart, project, participantMap, date)).toEqual(
      statusAccept1
    );
  });

  test("accept -> calculate (Question 1)", () => {
    expect(getNextStatus(statusAccept1, project, participantMap, date)).toEqual(
      statusCalculate1
    );
  });

  test("calculate -> check (Question 1)", () => {
    expect(
      getNextStatus(statusCalculate1, project, participantMap, date)
    ).toEqual(statusCheck1);
  });

  test("check (Question 1) -> accept (Question 2)", () => {
    expect(getNextStatus(statusCheck1, project, participantMap, date)).toEqual(
      statusAccept2
    );
  });

  test("accept -> calculate (Question 2)", () => {
    expect(getNextStatus(statusAccept2, project, participantMap, date)).toEqual(
      statusCalculate2
    );
  });

  test("calculate -> check (Question 2)", () => {
    expect(
      getNextStatus(statusCalculate2, project, participantMap, date)
    ).toEqual(statusCheck2);
  });

  test("check (Question 2) -> rank", () => {
    expect(getNextStatus(statusCheck2, project, participantMap, date)).toEqual(
      statusRank
    );
  });

  test("rank -> end", () => {
    expect(getNextStatus(statusRank, project, participantMap, date)).toEqual(
      statusEnd
    );
  });

  test("end -> rank", () => {
    expect(getPreviousStatus(statusEnd, project, participantMap, date)).toEqual(
      statusRank
    );
  });

  test("rank -> check (Question 2)", () => {
    expect(
      getPreviousStatus(statusRank, project, participantMap, date)
    ).toEqual(statusCheck2);
  });

  test("check -> calculate (Question 2)", () => {
    expect(
      getPreviousStatus(statusCheck2, project, participantMap, date)
    ).toEqual(statusCalculate2);
  });

  test("calculate -> accept (Question 2)", () => {
    expect(
      getPreviousStatus(statusCalculate2, project, participantMap, date)
    ).toEqual(statusAccept2);
  });

  test("accept (Question 2) -> check (Question 1)", () => {
    expect(
      getPreviousStatus(statusAccept2, project, participantMap, date)
    ).toEqual(statusCheck1);
  });

  test("check -> calculate (Question 1)", () => {
    expect(
      getPreviousStatus(statusCheck1, project, participantMap, date)
    ).toEqual(statusCalculate1);
  });

  test("calculate -> accept (Question 1)", () => {
    expect(
      getPreviousStatus(statusCalculate1, project, participantMap, date)
    ).toEqual(statusAccept1);
  });

  test("accept (Question 1) -> start", () => {
    expect(
      getPreviousStatus(statusAccept1, project, participantMap, date)
    ).toEqual(statusStart);
  });

  test("start -> error (NoQuestions)", () => {
    const projectWithNoQuestions: LocalProject = {
      id: "PJ1",
      name: "",
      createDate: dayjs.unix(1656082042),
      slide: {
        questions: [],
      },
    };
    const expected: StatusError = {
      type: "error",
      reason: "NoQuestions",
    };
    expect(
      getNextStatus(statusStart, projectWithNoQuestions, participantMap, date)
    ).toEqual(expected);
  });

  test("calculate -> error (QuestionNotFound)", () => {
    const status: LocalStatusCalculate = {
      ...statusCalculate1,
      question: {
        id: "Q3",
        title: "Question 3",
        choices: statusCalculate1.question.choices,
      },
    };
    const expected: StatusError = {
      type: "error",
      reason: "QuestionNotFound",
    };
    expect(getNextStatus(status, project, participantMap, date)).toEqual(
      expected
    );
  });

  test("end -> error (OutOfRange)", () => {
    const expected: StatusError = {
      type: "error",
      reason: "OutOfRange",
    };
    expect(getNextStatus(statusEnd, project, participantMap, date)).toEqual(
      expected
    );
  });

  test("rank -> error (NoQuestions)", () => {
    const projectWithNoQuestions: LocalProject = {
      id: "PJ1",
      name: "",
      createDate: dayjs.unix(1656082042),
      slide: {
        questions: [],
      },
    };
    const expected: StatusError = {
      type: "error",
      reason: "NoQuestions",
    };
    expect(
      getPreviousStatus(
        statusRank,
        projectWithNoQuestions,
        participantMap,
        date
      )
    ).toEqual(expected);
  });

  test("accept -> error (QuestionNotFound)", () => {
    const status: LocalStatusAccept = {
      ...statusAccept1,
      question: {
        id: "Q3",
        title: "Question 3",
        choices: statusAccept1.question.choices,
      },
    };
    const expected: StatusError = {
      type: "error",
      reason: "QuestionNotFound",
    };
    expect(getPreviousStatus(status, project, participantMap, date)).toEqual(
      expected
    );
  });

  test("start -> error (OutOfRange)", () => {
    const expected: StatusError = {
      type: "error",
      reason: "OutOfRange",
    };
    expect(
      getPreviousStatus(statusStart, project, participantMap, date)
    ).toEqual(expected);
  });
});
