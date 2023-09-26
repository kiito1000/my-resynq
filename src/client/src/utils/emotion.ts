import type { CreateStyled } from "@emotion/styled";

// for the issues: https://github.com/emotion-js/emotion/issues/183
// refered solution: https://github.com/emotion-js/emotion/issues/2193#issuecomment-766173118
export const transientOptions: Parameters<CreateStyled>[1] = {
  shouldForwardProp: (propName: string) => !propName.startsWith("$"),
};
