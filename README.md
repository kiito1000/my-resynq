# My Resynq

[Resynq](https://resynq.app/) のソースコードの一部  
Resynqは @kiito1000 と @isixd が共同で開発しています。

以下のコードは除外しています。

- 回答者、スライド、ランディングページ
  - 大半を @isixd が実装したため
- 秘匿情報
- バックエンド

ビルドは可能ですが動作しません。

## Technology Stacks

### Common

- [TypeScript](https://www.typescriptlang.org/)
- [yarn](https://yarnpkg.com)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- [stylelint](https://stylelint.io/)
- [husky](https://github.com/typicode/husky) + [lint-staged](https://github.com/okonet/lint-staged)
- [Jest](https://jestjs.io/) + [@swc/jest](https://swc.rs/docs/usage/jest)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Dayjs](https://day.js.org/)
- [lodash](https://lodash.com/)

### Frontend

- [React](https://reactjs.org/)
- [React Router](https://reacttraining.com/react-router/)
- [React Redux](https://react-redux.js.org/) + [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux-Saga](https://redux-saga.js.org/) + [typed-redux-saga](https://github.com/agiledigital/typed-redux-saga)
- [React Testing Libary](https://testing-library.com/docs/react-testing-library/intro)
- [React Hook Form](https://react-hook-form.com)
- [emotion](https://emotion.sh/)
- [MUI](https://mui.com/)
- [notistack](https://github.com/iamhosseindhv/notistack)
- [vite](https://vitejs.dev/)
- [clsx](https://www.npmjs.com/package/clsx)

### Backend

- [node.js](https://nodejs.org)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)

### Recommended Editor

- [Visual Studio Code](https://code.visualstudio.com/)

## License

No License
