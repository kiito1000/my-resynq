import { SlidePage } from "@/firebase/db";
import { CopyTextIconButton } from "@components/CopyTextIconButton";
import { ExternalLinkButton } from "@components/ExternalLinkButton";
import { Box, styled, Typography } from "@mui/material";
import { strings } from "@strings";
import { FC } from "react";
import { SlidePageItemTemplate } from "./SlidePageItemTemplate";

const StyledTypographyForUrl = styled(Typography)(({ theme }) => ({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  fontSize: 12,
  color: theme.palette.text.secondary,
}));

type SlideStartPageItemProps = {
  page: Extract<SlidePage, { type: "start" }>;
  answererUrl: string;
  slideUrl: string;
};

export const SlideStartPageItem: FC<SlideStartPageItemProps> = ({
  page,
  answererUrl,
  slideUrl,
}) => {
  return (
    <SlidePageItemTemplate title={strings.presenter.status.start} page={page}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mx: 4,
          my: 3,
        }}
      >
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", lineHeight: 2.0, width: 0.6 }}
        >
          {strings.presenter.tutorial}
        </Typography>
        <Box sx={{ width: 0.4 }}>
          <Typography variant="subtitle2">
            {strings.presenter.answererUrl}
            <CopyTextIconButton
              text={answererUrl}
              sx={{
                fontSize: 18,
                p: 0.5,
                ml: 0.5,
                color: (theme) => theme.palette.text.secondary,
              }}
            />
          </Typography>
          <Box component="span">
            <StyledTypographyForUrl>{answererUrl}</StyledTypographyForUrl>
          </Box>
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            {strings.presenter.slideUrl}
            <CopyTextIconButton
              text={slideUrl}
              sx={{
                fontSize: 18,
                p: 0.5,
                ml: 0.5,
                color: (theme) => theme.palette.text.secondary,
              }}
            />
            <ExternalLinkButton
              href={slideUrl}
              sx={{
                fontSize: 18,
                p: 0.5,
                color: (theme) => theme.palette.text.secondary,
              }}
            />
          </Typography>
          <Box component="span">
            <StyledTypographyForUrl>{slideUrl}</StyledTypographyForUrl>
          </Box>
        </Box>
      </Box>
    </SlidePageItemTemplate>
  );
};
