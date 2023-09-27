import {
  LocalParticipant,
  LocalPresentation,
  LocalPresentationStatus,
  LocalProject,
  LocalSlide,
  LocalStatusAccept,
  LocalStatusCalculate,
  LocalStatusCheck,
  LocalStatusEnd,
  LocalStatusRank,
  LocalStatusStart,
  Participant,
  Presentation,
  PresentationStatus,
  Project,
  StatusAccept,
  StatusCalculate,
  StatusCheck,
  StatusEnd,
  StatusRank,
  StatusStart,
} from "@/firebase/db";
import dayjs from "dayjs";
import {
  convertToLocalParticipant,
  convertToLocalPresentation,
  convertToLocalPresentationStatus,
  convertToLocalProject,
  convertToPresentationStatus,
} from "./dbConverter";

describe("Project", () => {
  test("to LocalProject", () => {
    const createDate = 1656509450;
    const holdDate = 1656509519;
    const slide: LocalSlide = {
      questions: [
        {
          id: "Q1",
          title: "Question 1",
          choices: [
            {
              id: "C1",
              label: "Choice 1",
              isCorrect: true,
            },
            {
              id: "C2",
              label: "Choice 2",
              isCorrect: false,
            },
          ],
        },
      ],
    };
    const project: Project = {
      name: "Project 1",
      createDate,
      holdDate,
      hashtag: "#PJ1",
      slide,
      presentationId: "PT1",
    };
    const expected: LocalProject = {
      id: "PJ1",
      name: "Project 1",
      createDate: dayjs.unix(createDate),
      holdDate: dayjs.unix(holdDate),
      hashtag: "#PJ1",
      slide,
      presentationId: "PT1",
    };
    expect(convertToLocalProject("PJ1", project)).toEqual(expected);
  });
});

describe("PresentationStatus", () => {
  describe("to LocalPresentationStatus", () => {
    test("status: start", () => {
      const status: StatusStart = { type: "start" };
      const expected: LocalStatusStart = {
        type: "start",
      };
      expect(convertToLocalPresentationStatus(status)).toEqual(expected);
    });

    test("status: accept", () => {
      const startDate = 1655998520;
      const question: LocalStatusAccept["question"] = {
        id: "",
        title: "",
        choices: [],
      };
      const status: StatusAccept = {
        type: "accept",
        startDate,
        question,
      };
      const expected: LocalStatusAccept = {
        type: "accept",
        startDate: dayjs.unix(startDate),
        question,
      };
      expect(convertToLocalPresentationStatus(status)).toEqual(expected);
    });
  });

  test("status: calculate", () => {
    const startDate = 1655998520;
    const question: LocalStatusCalculate["question"] = {
      id: "",
      title: "",
      choices: [],
    };
    const status: StatusCalculate = {
      type: "calculate",
      startDate,
      question,
    };
    const expected: LocalStatusCalculate = {
      type: "calculate",
      startDate: dayjs.unix(startDate),
      question,
    };
    expect(convertToLocalPresentationStatus(status)).toEqual(expected);
  });

  test("status: check", () => {
    const startDate = 1655998520;
    const question: LocalStatusCheck["question"] = {
      id: "",
      title: "",
      choices: [],
    };
    const status: StatusCheck = {
      type: "check",
      startDate,
      question,
    };
    const expected: LocalStatusCheck = {
      type: "check",
      startDate: dayjs.unix(startDate),
      question,
    };
    expect(convertToLocalPresentationStatus(status)).toEqual(expected);
  });

  test("status: rank", () => {
    const status: StatusRank = {
      type: "rank",
      records: [],
    };
    const expected: LocalStatusRank = {
      type: "rank",
      records: [],
    };
    expect(convertToLocalPresentationStatus(status)).toEqual(expected);
  });

  test("status: end", () => {
    const status: StatusEnd = { type: "end" };
    const expected: LocalStatusEnd = {
      type: "end",
    };
    expect(convertToLocalPresentationStatus(status)).toEqual(expected);
  });
});

describe("LocalPresentationStatus", () => {
  describe("to PresentationStatus", () => {
    test("status: start", () => {
      const status: LocalPresentationStatus = {
        type: "start",
      };
      const expected: PresentationStatus = {
        type: "start",
      };
      expect(convertToPresentationStatus(status)).toEqual(expected);
    });

    test("status: accept", () => {
      const startDate = 1656510639;
      const status: LocalPresentationStatus = {
        type: "accept",
        startDate: dayjs.unix(startDate),
        question: {
          id: "Q1",
          title: "Question 1",
          choices: [],
        },
      };
      const expected: PresentationStatus = {
        type: "accept",
        startDate,
        question: {
          id: "Q1",
          title: "Question 1",
          choices: [],
        },
      };
      expect(convertToPresentationStatus(status)).toEqual(expected);
    });

    test("status: calculate", () => {
      const startDate = 1656510639;
      const status: LocalPresentationStatus = {
        type: "calculate",
        startDate: dayjs.unix(startDate),
        question: {
          id: "Q1",
          title: "Question 1",
          choices: [],
        },
      };
      const expected: PresentationStatus = {
        type: "calculate",
        startDate,
        question: {
          id: "Q1",
          title: "Question 1",
          choices: [],
        },
      };
      expect(convertToPresentationStatus(status)).toEqual(expected);
    });

    test("status: check", () => {
      const startDate = 1656510639;
      const status: LocalPresentationStatus = {
        type: "check",
        startDate: dayjs.unix(startDate),
        question: {
          id: "Q1",
          title: "Question 1",
          choices: [],
        },
      };
      const expected: PresentationStatus = {
        type: "check",
        startDate,
        question: {
          id: "Q1",
          title: "Question 1",
          choices: [],
        },
      };
      expect(convertToPresentationStatus(status)).toEqual(expected);
    });

    test("status: rank", () => {
      const status: LocalPresentationStatus = {
        type: "rank",
        records: [],
      };
      const expected: PresentationStatus = {
        type: "rank",
        records: [],
      };
      expect(convertToPresentationStatus(status)).toEqual(expected);
    });

    test("status: end", () => {
      const status: LocalPresentationStatus = {
        type: "end",
      };
      const expected: PresentationStatus = {
        type: "end",
      };
      expect(convertToPresentationStatus(status)).toEqual(expected);
    });
  });
});

describe("Presentation", () => {
  describe("to LocalPresentation", () => {
    test("with no dates", () => {
      const presentation: Presentation = {
        ownerUserId: "U0",
        projectId: "PJ0",
        name: "sample",
        hashtag: "#sample",
        status: { type: "start" },
        participants: 0,
        ranking: [
          {
            userId: "U1",
            displayName: "anonymous",
            iconUrl: "https://example.com",
            points: 10,
            rank: 1,
          },
        ],
      };
      const presentationId = "PT0";
      const expected: LocalPresentation = {
        id: presentationId,
        ownerUserId: "U0",
        projectId: "PJ0",
        name: "sample",
        hashtag: "#sample",
        participants: 0,
        ranking: [
          {
            userId: "U1",
            displayName: "anonymous",
            iconUrl: "https://example.com",
            points: 10,
            rank: 1,
          },
        ],
      };
      expect(convertToLocalPresentation(presentationId, presentation)).toEqual(
        expected
      );
    });

    test("with dates", () => {
      const startDate = 1655998520;
      const endDate = 1656998530;
      const presentation: Presentation = {
        ownerUserId: "U0",
        projectId: "PJ0",
        name: "sample",
        hashtag: "#sample",
        startDate: 1655998520,
        endDate: 1656998530,
        status: { type: "start" },
        participants: 0,
        ranking: [
          {
            userId: "U1",
            displayName: "anonymous",
            iconUrl: "https://example.com",
            points: 10,
            rank: 1,
          },
        ],
      };
      const presentationId = "PT0";
      const expected: LocalPresentation = {
        id: presentationId,
        ownerUserId: "U0",
        projectId: "PJ0",
        name: "sample",
        hashtag: "#sample",
        startDate: dayjs.unix(startDate),
        endDate: dayjs.unix(endDate),
        participants: 0,
        ranking: [
          {
            userId: "U1",
            displayName: "anonymous",
            iconUrl: "https://example.com",
            points: 10,
            rank: 1,
          },
        ],
      };
      expect(convertToLocalPresentation(presentationId, presentation)).toEqual(
        expected
      );
    });
  });
});

describe("Participant", () => {
  describe("to LocalParticipant", () => {
    test("with no answers", () => {
      const joinDate = 1656511218;
      const participant: Participant = {
        joinDate,
        displayName: "anonymous",
        iconUrl: "https://example.com",
      };
      const expected: LocalParticipant = {
        id: "U1",
        joinDate: dayjs.unix(joinDate),
        displayName: "anonymous",
        iconUrl: "https://example.com",
        answers: {},
      };
      expect(convertToLocalParticipant("U1", participant)).toEqual(expected);
    });

    test("with answers", () => {
      const joinDate = 1656511218;
      const participant: Participant = {
        joinDate,
        displayName: "anonymous",
        iconUrl: "https://example.com",
        answers: {
          Q1: ["C1", "C2"],
          Q2: ["C1"],
        },
      };
      const expected: LocalParticipant = {
        id: "U1",
        joinDate: dayjs.unix(joinDate),
        displayName: "anonymous",
        iconUrl: "https://example.com",
        answers: {
          Q1: ["C1", "C2"],
          Q2: ["C1"],
        },
      };
      expect(convertToLocalParticipant("U1", participant)).toEqual(expected);
    });
  });
});
