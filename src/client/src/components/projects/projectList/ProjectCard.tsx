import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  Card,
} from "@mui/material";
import React, { FC, useCallback, useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import { strings } from "@strings";
import { Icon } from "@mdi/react";
import { mdiNoteEditOutline } from "@mdi/js";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Button } from "@components/Button";
import { ProjectCardPreview } from "./ProjectCardPreview";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalProject } from "@/firebase/db";

const BUTTON_INSIDE_ICON_SIZE = 18;
const ICON_BUTTON_SIZE = 22;

type FoldedCardContentProps = {
  project: LocalProject;
  onEditSlide?: () => void;
};

const FoldedCardContent: FC<FoldedCardContentProps> = ({
  project,
  onEditSlide,
}) => {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Typography variant="caption" color="text.secondary">
          {strings.date.createDateFromNow(project.createDate)}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
          {strings.project.questionCount(project.slide.questions.length)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 1.5,
        }}
      >
        <ProjectCardPreview project={project} />
        <Button
          variant="text"
          size="small"
          sx={{
            padding: 0,
            whiteSpace: "nowrap",
            flexShrink: 0,
            alignSelf: "center",
            ".MuiButton-startIcon": {
              margin: "2px",
            },
          }}
          startIcon={
            <Icon
              path={mdiNoteEditOutline}
              color={theme.palette.primary.main}
              size={`${BUTTON_INSIDE_ICON_SIZE}px`}
            />
          }
          onClick={onEditSlide}
        >
          {strings.project.editSlide}
        </Button>
      </Box>
    </>
  );
};

type UnfoldedCardContentProps = {
  project: LocalProject;
  onHoldProject?: () => void;
  onCopyProject?: () => void;
  onDeleteProject?: () => void;
  onEditSlide?: () => void;
};

const UnfoldedCardContent: FC<UnfoldedCardContentProps> = ({
  project,
  onHoldProject,
  onCopyProject,
  onDeleteProject,
  onEditSlide,
}) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 1,
          mb: 2,
        }}
      >
        <ProjectCardPreview project={project} multiline={true} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "end",
            flexShrink: 0,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {strings.date.createDate(project.createDate)}
          </Typography>
          {project.holdDate && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CheckIcon sx={{ pr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {strings.date.holdDate(project.holdDate)}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          width: 1.0,
          display: "flex",
          justifyContent: "space-between",
          my: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: "0 24px", flexWrap: "wrap" }}>
          <Button
            variant="text"
            size="small"
            sx={{
              padding: 0,
              whiteSpace: "nowrap",
              flexShrink: 0,
              alignSelf: "center",
              ".MuiSvgIcon-root": {
                fontSize: BUTTON_INSIDE_ICON_SIZE,
              },
              ".MuiButton-startIcon": {
                margin: "2px",
              },
            }}
            startIcon={<PlayCircleOutlineIcon />}
            onClick={onHoldProject}
            disabled={project.holdDate != null}
          >
            {strings.project.startEvent}
          </Button>
          <Button
            variant="text"
            size="small"
            sx={{
              padding: 0,
              whiteSpace: "nowrap",
              flexShrink: 0,
              alignSelf: "center",
              ".MuiSvgIcon-root": {
                fontSize: BUTTON_INSIDE_ICON_SIZE,
              },
              ".MuiButton-startIcon": {
                margin: "2px",
              },
            }}
            startIcon={<ContentCopyIcon />}
            onClick={onCopyProject}
            disabled={onCopyProject == null}
          >
            {strings.project.copyProject}
          </Button>
          <Button
            variant="text"
            size="small"
            sx={{
              padding: 0,
              whiteSpace: "nowrap",
              flexShrink: 0,
              alignSelf: "center",
              ".MuiSvgIcon-root": {
                fontSize: BUTTON_INSIDE_ICON_SIZE,
              },
              ".MuiButton-startIcon": {
                margin: "2px",
              },
            }}
            startIcon={<DeleteIcon fontSize="inherit" />}
            onClick={onDeleteProject}
          >
            {strings.project.deleteProject}
          </Button>
        </Box>
        <Box>
          <Button
            variant="text"
            size="small"
            sx={{
              padding: 0,
              whiteSpace: "nowrap",
              flexShrink: 0,
              alignSelf: "center",
              ".MuiButton-startIcon": {
                margin: "2px",
              },
            }}
            startIcon={
              <Icon
                path={mdiNoteEditOutline}
                color={theme.palette.primary.main}
                size={`${BUTTON_INSIDE_ICON_SIZE}px`}
              />
            }
            onClick={onEditSlide}
          >
            {strings.project.editSlide}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export type ProjectCardProps = {
  project: LocalProject;
  onEditProject?: (project: LocalProject) => void;
  onHoldProject?: (project: LocalProject) => void;
  onCopyProject?: (project: LocalProject) => void;
  onDeleteProject?: (project: LocalProject) => void;
  onEditSlide?: (project: LocalProject) => void;
};

export const ProjectCard: FC<ProjectCardProps> = ({
  project,
  onEditProject,
  onHoldProject,
  onCopyProject,
  onDeleteProject,
  onEditSlide,
}) => {
  const [folded, setFolded] = useState<boolean>(true);

  const handleEditProject = useCallback(() => {
    onEditProject?.(project);
  }, [onEditProject, project]);
  const handleHoldProject = useCallback(() => {
    onHoldProject?.(project);
  }, [onHoldProject, project]);
  const handleCopyProject = useMemo(() => {
    if (onCopyProject == null) {
      return undefined;
    }
    return () => onCopyProject?.(project);
  }, [onCopyProject, project]);
  const handleDeleteProject = useCallback(() => {
    onDeleteProject?.(project);
  }, [onDeleteProject, project]);
  const handleEditSlide = useCallback(() => {
    onEditSlide?.(project);
  }, [onEditSlide, project]);

  const switchUnfolded = useCallback(() => {
    setFolded((value) => !value);
  }, []);

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: (theme) => theme.palette.border.main,
        borderRadius: 1,
        px: 3,
        py: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          ".MuiSvgIcon-root": {
            fontSize: `${ICON_BUTTON_SIZE}px`,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {project.name}
          </Typography>
          {project.hashtag && (
            <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
              {project.hashtag}
            </Typography>
          )}
          <Tooltip title={strings.project.editProjectTitle}>
            <IconButton
              sx={{
                color: (theme) => theme.palette.text.secondary,
              }}
              size="medium"
              aria-label="edit"
              onClick={handleEditProject}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <Tooltip title={strings.project.startEvent}>
            <IconButton
              sx={{
                color: (theme) => theme.palette.text.secondary,
              }}
              size="medium"
              aria-label="hold"
              onClick={handleHoldProject}
              disabled={project.holdDate != null}
            >
              <PlayCircleOutlineIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              folded ? strings.project.readMore : strings.project.closeReadMore
            }
          >
            <IconButton
              sx={{
                color: (theme) => theme.palette.text.secondary,
              }}
              size="medium"
              aria-label="unfolded"
              onClick={switchUnfolded}
            >
              {folded ? (
                <UnfoldMoreIcon fontSize="inherit" />
              ) : (
                <UnfoldLessIcon fontSize="inherit" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {folded ? (
        <FoldedCardContent project={project} onEditSlide={handleEditSlide} />
      ) : (
        <UnfoldedCardContent
          project={project}
          onHoldProject={handleHoldProject}
          onCopyProject={handleCopyProject}
          onDeleteProject={handleDeleteProject}
          onEditSlide={handleEditSlide}
        />
      )}
    </Card>
  );
};
