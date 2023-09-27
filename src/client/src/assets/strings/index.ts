import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const app = {
  title: "Resynq〈リシンク〉| 結婚式の余興や懇親会で使えるクイズアプリ",
  organization: "Resynq",
  description: [
    "結婚式の",
    "余興や",
    "懇親会",
    "で使える",
    " ",
    "クイズアプリ",
  ],
  copyright: () => {
    const year = dayjs().year();
    const yearString = 2023 < year ? `2023-${year - 2000}` : "2023";
    return `©${yearString} Resynq`;
  },
} as const;

const termOfService = {
  title: "Resynq 利用規約",
  updatedAt: "2023年1月1日",
} as const;

const releaseNotes = {
  title: "リリースノート",
};

const contact = {
  title: "お問い合わせ",
};

const button = {
  cancel: "キャンセル",
  save: "変更を保存",
  delete: "削除",
  next: "次へ",
  yes: "はい",
} as const;

const date = {
  createDateFromNow: (date: Dayjs) => `${date.fromNow()}に作成`,
  createDate: (date: Dayjs) =>
    `${date.format("YYYY/MM/DD")} (${date.fromNow()}) 作成`,
  holdDate: (date: Dayjs) =>
    `${date.format("YYYY/MM/DD")} (${date.fromNow()}) 開催`,
} as const;

const units = {
  vote: "票",
  user: "人",
  seconds: "秒",
  page: "ページ",
} as const;

const form = {
  optional: "オプション",
} as const;

const user = {
  signUp: "新規登録",
  login: "ログイン",
  signUpOrLoginWithGoogle: "Googleアカウントで登録/ログイン",
  signUpOrLoginWithTwitter: "Twitterアカウントで登録/ログイン",
  logout: "ログアウト",
  editProfile: "プロフィールを編集",
  profileImage: "プロフィール画像",
  setNewProfileImage: "新しい画像を設定",
  displayName: "表示名",
  name: "名前",
  defaultDisplayName: "ユーザー",
  tos: "利用規約",
  recommendUsingWithPc:
    "クイズの作成や出題は、PCなどの大きな画面でのご利用を推奨しております。",
  copyLink: "リンクをコピー",
} as const;

const slide = {
  common: {
    begin: {
      body: "右のQRコードから\n参加登録を行ってください",
    },
    end: {
      body: "イベントは終了しました。\nお楽しみいただきありがとうございました。",
    },
    qr: {
      copied: "コピーしました",
      title: "参加登録",
    },
    records: {
      title: "成績発表",
    },
  },
} as const;

const common = {
  rank: "位",
  order: "順位",
  exampleName: "リシンク 太郎",
  copied: "コピーしました",
  points: "得点",
};

const answerer = {
  heading: {
    records: "成績発表",
    end: "イベント終了",
    register: "参加登録",
    registered: "参加登録完了",
  },
  subtitle: {
    accepting: "回答受付中",
    aggregating: "集計中",
    correct: "正解",
    incorrect: "不正解",
    unanswered: "未回答",
    getRankingText: ({
      rank,
      population,
    }: {
      rank: number | string;
      population: number | string;
    }) => `あなたは${population}人中${rank}位でした。`,
  },
  content: {
    welcome: "リアルタイムクイズアプリResynqへ ようこそ。",
    target: "参加イベント",
    registerWithLogin: "ログインして参加登録",
    registerWithoutLogin: "ログインせずに参加登録",
    whatIsRegisterWithLogin:
      "SNSのアイコンを利用できます。また、参加したイベントの履歴の保存(今後実装予定)や、イベントの主催ができます。ReSynqはあなたの表示名とアイコン、IDのみにアクセスできます。",
    whatIsRegisterWithoutLogin: "名前を入力して簡単に参加できます。",
    loginWithGoogle: "Googleアカウントでログイン",
    loginWithTwitter: "Twitterアカウントでログイン",
    loggedInWithGoogle: "Googleアカウントでログインしました。",
    loggedInWithTwitter: "Twitterアカウントでログインしました。",
    tellMe: "参加者に公開するあなたのお名前とアイコンを教えて下さい。",
    displayName: "お名前",
    icon: "アイコン",
    register: "はじめる",
    wait: "イベント開始まで\nしばらくお待ち下さい。",
    end: "本イベントは終了いたしました。お楽しみいただきありがとうございました。",
  },
};

const project = {
  questionList: "お題一覧",
  order: "番号",
  question: "お題",
  choiceCount: "選択肢数",
  addQuestion: "お題を追加",
  questionTitle: "問題文",
  correct: "正解",
  choice: "選択肢",
  addChoice: "選択肢を追加",
  saving: "保存中",
  saved: "保存済",
  startEvent: "イベント開始(URL発行)",
  projectFilter: {
    all: "すべて",
    notHeld: "未開催",
    held: "開催済",
  },
  projectList: "イベント一覧",
  addProject: "新規イベント",
  questionCount: (n: number) => `出題数 ${n}問`,
  editSlide: "クイズの編集",
  etc: (n: number) => `...他${n}件`,
  editProjectTitle: "イベント名を編集",
  readMore: "詳細を見る",
  closeReadMore: "詳細を閉じる",
  copyProject: "イベントを複製",
  deleteProject: "イベントを削除",
  projectName: "イベント名",
  createProject: "イベント作成",
  hashtag: "イベントタグ",
  dialogs: {
    addProject: "新規イベント",
    editProject: "イベント編集",
    deleteProject: "イベント削除",
  },
  noProjects: "表示するイベントがありません。",
} as const;

const presenter = {
  pageTitles: {
    start: "イベント開始画面",
    question: (title: string, n: number) => `第${n}問  ${title}`,
    rank: "成績発表画面",
    end: "イベント終了画面",
  },
  rankDescription: "ランキングは、集計後にここに表示されます。",
  pageList: "ページ一覧",
  participantList: "参加者一覧",
  tutorial:
    "1. スライドを別のスクリーンに投影する。\n2. 参加者にスライドのQRコードから参加登録してもらう。\n3. 準備ができたら「次へ」をクリックして、クイズを開始する。",
  answererUrl: "参加登録URL",
  slideUrl: "スライドURL",
  status: {
    start: "イベント開始",
    accept: "出題",
    calculate: "集計",
    check: "解答",
    rank: "成績発表",
    end: "イベント終了",
  },
  moreActions: "その他の操作",
  actions: {
    startQuiz: "クイズ開始",
    copyAnswererUrl: "参加登録URLをコピー",
    copySlideUrl: "スライドURLをコピー",
    openSlideWithNewWindow: "スライドを新しいウィンドウで開く",
    cancelPresentation: "イベント開始を取り消し",
    endEvent: "イベント終了",
  },
  dialogs: {
    cancelPresentationTitle: "イベント開始を取り消しますか？",
    cancelPresentationDetail:
      "イベント開始を取り消すと参加者の情報は削除され、イベントのURLも無効になります。",
    closeEventTitle: "イベントを終了しますか？",
  },
  backToCurrentPage: "現在のページに戻る",
} as const;

const notFound = {
  title: "ページが見つかりません",
  message: "お探しのページは移動もしくは削除された可能性があります。",
  backToTop: "トップに戻る",
} as const;

const db = {
  disconnectServer: "サーバーから切断されました",
  reconnectServer: "サーバーに再接続しました",
} as const;

const errors = {
  authError: "認証エラーが発生しました。\n再度ログインしてください。",
  failToLogin: "ログインに失敗しました",
  failToUpdateUserProfile: "プロフィールの更新に失敗しました",
  failToCreateEvent: "イベントの作成に失敗しました",
  failToUpdateEvent: "イベントの更新に失敗しました",
  failToDeleteEvent: "イベントの削除に失敗しました",
  failToCopyEvent: "イベントのコピーに失敗しました",
  failToAddQuestion: "クイズの追加に失敗しました",
  failToSortQuestions: "クイズの並び替えに失敗しました",
  failToEditQuestion: "クイズの編集に失敗しました",
  failToRemoveQuestion: "クイズの削除に失敗しました",
  doNotJoinEvent:
    "イベントに参加できませんでした。\n参加数上限に達している可能性があります。",
  failToAnswer: "回答に失敗しました",
  doNotStartEvent: "イベントが開始できませんでした",
  doNotGoNextPage: "次のページに遷移できませんでした",
  failToUpdateRanking: "ランキングの更新に失敗しました",
  doNotBackPreviousPage: "前のページに遷移できませんでした",
  doNotCancelEvent: "イベントをキャンセルできませんでした",
  doNotCloseEvent: "イベントを終了できませんでした",
  alreadyEndEvent: "既にイベントが終了しています",
} as const;

export const strings = {
  app,
  termOfService,
  releaseNotes,
  contact,
  button,
  date,
  units,
  form,
  user,
  slide,
  project,
  common,
  answerer,
  presenter,
  notFound,
  db,
  errors,
} as const;
