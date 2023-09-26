import type { Dayjs } from "dayjs";

export type User = {
  displayName?: string;
  iconUrl?: string;
  description?: string;
};

export type Slide = {
  questions?: Question[];
};

export type Choice = {
  id: string;
  label: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  title: string;
  choices?: Choice[];
};

export type Project = {
  name: string;
  createDate: number;
  holdDate?: number;
  hashtag?: string;
  slide?: Slide;
  presentationId?: string;
};

// 待機中
export type StatusStart = {
  type: "start";
};

// お題解答受付中
export type StatusAccept = {
  type: "accept";
  startDate: number;
  question: {
    id: string;
    title: string;
    choices?: {
      id: string;
      label: string;
    }[];
  };
};

// お題解答集計中
export type StatusCalculate = {
  type: "calculate";
  startDate: number;
  question: {
    id: string;
    title: string;
    choices?: {
      id: string;
      label: string;
      selectedRate: number;
    }[];
  };
};

// お題解答表示中
export type StatusCheck = {
  type: "check";
  startDate: number;
  question: {
    id: string;
    title: string;
    choices?: {
      id: string;
      label: string;
      selectedRate: number;
      isCorrect: boolean;
    }[];
  };
};

export type UserRecord = {
  userId: string;
  displayName: string;
  iconUrl: string;
  points: number;
  rank: number;
};

// 結果発表中
export type StatusRank = {
  type: "rank";
  records?: UserRecord[];
};

// イベント終了
export type StatusEnd = {
  type: "end";
};

export type PresentationStatus =
  | StatusStart
  | StatusAccept
  | StatusCalculate
  | StatusCheck
  | StatusRank
  | StatusEnd;

export type Presentation = {
  ownerUserId: string;
  projectId: string;
  startDate?: number; // 初めてStatusAcceptになったときに日付が入る
  endDate?: number;
  name: string;
  hashtag?: string;
  status: PresentationStatus; // プレゼン開始直後はStatusStart
  participants: number;
  ranking?: UserRecord[];
};

export type Participant = {
  joinDate: number;
  displayName: string;
  iconUrl: string;
  answers?: {
    [questionId: string]: string[];
  };
};

export type ParticipantMap = {
  [userId: string]: Participant;
};

// Realtime DBでは空objectを保存できないので、object型はoptionalにする
export type DB = {
  users?: {
    [userId: string]: User;
  };
  projects?: {
    [userId: string]: {
      [projectId: string]: Project;
    };
  };
  presentations?: {
    [presentationId: string]: Presentation;
  };
  participants?: {
    [presentationId: string]: ParticipantMap;
  };
};

export type LocalQuestion = {
  id: string;
  title: string;
  choices: Choice[];
};

export type LocalSlide = {
  questions: LocalQuestion[];
};

export type LocalProject = {
  id: string;
  name: string;
  createDate: Dayjs;
  holdDate?: Dayjs;
  hashtag?: string;
  slide: LocalSlide;
  presentationId?: string;
};

export type LocalParticipant = {
  id: string;
  joinDate: Dayjs;
  displayName: string;
  iconUrl: string;
  answers: {
    [questionId: string]: string[];
  };
};

export type LocalPresentation = {
  id: string;
  ownerUserId: string;
  projectId: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  name: string;
  hashtag?: string;
  participants: number;
  ranking: UserRecord[];
};

export type LocalStatusStart = StatusStart;

export type LocalStatusAccept = {
  type: "accept";
  startDate: Dayjs;
  question: {
    id: string;
    title: string;
    choices: {
      id: string;
      label: string;
    }[];
  };
};

export type LocalStatusCalculate = {
  type: "calculate";
  startDate: Dayjs;
  question: {
    id: string;
    title: string;
    choices: {
      id: string;
      label: string;
      selectedRate: number;
    }[];
  };
};

export type LocalStatusCheck = {
  type: "check";
  startDate: Dayjs;
  question: {
    id: string;
    title: string;
    choices: {
      id: string;
      label: string;
      selectedRate: number;
      isCorrect: boolean;
    }[];
  };
};

export type LocalStatusRank = {
  type: "rank";
  records: UserRecord[];
};

export type LocalStatusEnd = StatusEnd;

export type LocalPresentationStatus =
  | LocalStatusStart
  | LocalStatusAccept
  | LocalStatusCalculate
  | LocalStatusCheck
  | LocalStatusRank
  | LocalStatusEnd;

export type SlidePageType = "start" | "question" | "rank" | "end";

export type SlidePage = { isDone?: boolean } & (
  | {
      type: "start";
      index: number;
      status?: LocalStatusStart;
    }
  | {
      type: "question";
      index: number;
      question: LocalQuestion & { index: number };
      status?: LocalStatusAccept | LocalStatusCalculate | LocalStatusCheck;
    }
  | {
      type: "rank";
      index: number;
      ranking: UserRecord[];
      status?: LocalStatusRank;
    }
  | {
      type: "end";
      index: number;
      status?: LocalStatusEnd;
    }
);

type UserId = string;

export type Answers = {
  [questionId: string]: {
    answeredUsers: UserId[];
    choices: {
      [choiceId: string]: UserId[];
    };
  };
};
