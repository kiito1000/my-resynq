import { LocalProject, Question } from "@/firebase/db";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { strings } from "@strings";
import React, { FC, useMemo } from "react";

const maxItemsTable = {
  md: 2,
  lg: 3,
  xl: 4,
  multiline: 5,
} as const;

type QuestionItem =
  | ({
      type: "question";
    } & Question)
  | {
      type: "ellipsis";
      count: number;
    };

export type ProjectCardPreviewProps = {
  className?: string;
  project: LocalProject;
  multiline?: boolean;
};

export const ProjectCardPreview: FC<ProjectCardPreviewProps> = ({
  className,
  project,
  multiline = false,
}) => {
  const theme = useTheme();
  const xLarge = useMediaQuery(theme.breakpoints.up(2270));
  const large = useMediaQuery(theme.breakpoints.up(1840));

  const maxItems = multiline
    ? maxItemsTable.multiline
    : xLarge
    ? maxItemsTable.xl
    : large
    ? maxItemsTable.lg
    : maxItemsTable.md;

  const { questions } = project.slide;
  const items: QuestionItem[] = useMemo(() => {
    const slicedItems = questions
      .map((question) => ({ ...question, type: "question" as const }))
      .slice(0, maxItems);
    if (questions.length <= maxItems) {
      return slicedItems;
    }
    return [
      ...slicedItems,
      { type: "ellipsis" as const, count: questions.length - maxItems },
    ];
  }, [maxItems, questions]);

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: multiline ? "column" : "row",
        flexWrap: "wrap",
        alignItems: multiline ? "flex-start" : "center",
        gap: 1,
        minWidth: 0,
      }}
    >
      {items.map((item, i) =>
        item.type === "question" ? (
          <Box
            key={item.id}
            sx={{
              maxWidth: multiline ? 1.0 : "16em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              backgroundColor: (theme) => theme.palette.grey[100],
              borderRadius: "4px",
              px: 1,
              py: "2px",
            }}
          >{`Q${i + 1}. ${item.title}`}</Box>
        ) : (
          <Box
            key={"etc"}
            sx={{
              backgroundColor: (theme) => theme.palette.grey[100],
              borderRadius: "4px",
              px: 1,
              py: "2px",
            }}
          >
            {strings.project.etc(item.count)}
          </Box>
        )
      )}
    </Box>
  );
};
