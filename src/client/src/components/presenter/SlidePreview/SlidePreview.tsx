import { Card, CardProps } from "@mui/material";
import { FC } from "react";

const SlideMock: FC = () => {
  // Created by https://github.com/isIxd
  return <>スライド画面</>;
};

export type SlidePreviewProps = CardProps;

export const SlidePreview: FC<SlidePreviewProps> = ({ sx, ...props }) => {
  return (
    <Card
      elevation={0}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          justifyContent: "stretch",
          border: 1,
          borderColor: "border.main",
          borderRadius: 1,
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <SlideMock />
    </Card>
  );
};
