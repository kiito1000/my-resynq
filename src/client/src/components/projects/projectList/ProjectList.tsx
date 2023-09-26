import { Button } from "@components/Button";
import { Box, Typography, useTheme } from "@mui/material";
import { strings } from "@strings";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
  memo,
} from "react";
import { ProjectFilter, ProjectFilterValue } from "./ProjectFilter";
import { Icon } from "@mdi/react";
import { mdiNotePlusOutline } from "@mdi/js";
import { ProjectCard, ProjectCardProps } from "./ProjectCard";
import "dayjs/locale/ja";
import { AddProjectDialog, AddProjectDialogProps } from "./AddProjectDialog";
import { EditProjectDialog, EditProjectDialogProps } from "./EditProjectDialog";
import {
  DeleteProjectDialog,
  DeleteProjectDialogProps,
} from "./DeleteProjectDialog";
import { useAppSelector } from "@redux/hooks/useAppSelector";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { useNavigate } from "react-router";
import { LocalProject } from "@/firebase/db";
import { TopStickyLayout } from "../TopStickyLayout";
import reverse from "lodash.reverse";
import sortBy from "lodash.sortby";
import { pages } from "@router";

const maxProjects = 10;

type ProjectListActionsProps = {
  projects: number;
  filter: ProjectFilterValue;
  setFilter: React.Dispatch<React.SetStateAction<ProjectFilterValue>>;
  onAddNewProject: () => void;
};

const ProjectListActions: FC<ProjectListActionsProps> = ({
  projects,
  filter,
  setFilter,
  onAddNewProject,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 1.0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        position: "sticky",
        pt: 5,
        pb: 1.5,
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <ProjectFilter value={filter} onChange={setFilter} />
      <Button
        disabled={projects >= maxProjects}
        variant="contained"
        startIcon={
          <Icon
            path={mdiNotePlusOutline}
            color={theme.palette.common.white}
            size={"18px"}
          />
        }
        onClick={onAddNewProject}
      >
        {strings.project.addProject}
      </Button>
    </Box>
  );
};

const MemorizedProjectListActions = memo(ProjectListActions);

type ProjectListContentProps = Omit<ProjectCardProps, "project"> & {
  projects: LocalProject[];
  filter: ProjectFilterValue;
};

const ProjectListContent: FC<ProjectListContentProps> = ({
  projects,
  onHoldProject,
  onEditProject,
  onCopyProject,
  onDeleteProject,
  onEditSlide,
  filter,
}) => {
  const filteredProjects = useMemo(
    () =>
      reverse(
        sortBy(
          projects.filter((project) => {
            switch (filter) {
              case "all":
                return true;
              case "held":
                return project.holdDate != null;
              case "notHeld":
                return project.holdDate == null;
            }
          }),
          ["createDate"]
        )
      ),
    [filter, projects]
  );

  return (
    <>
      {filteredProjects.length === 0 ? (
        <Box
          sx={{
            height: 1.0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography fontSize={64}>🙈</Typography>
          <Typography fontSize={20}>{strings.project.noProjects}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            py: 1.5,
          }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEditProject={onEditProject}
              onHoldProject={onHoldProject}
              onCopyProject={onCopyProject}
              onDeleteProject={onDeleteProject}
              onEditSlide={onEditSlide}
            />
          ))}
        </Box>
      )}
    </>
  );
};

const MemorizedProjectListContent = memo(ProjectListContent);

type DialogState =
  | {
      type: "none" | "add";
    }
  | {
      type: "edit" | "delete";
      project: LocalProject;
    };

export const ProjectList: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const projects = useAppSelector((state) => state.projectList);
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const [selectedFilter, setSelectedFilter] =
    useState<ProjectFilterValue>("all");

  const handleAddNewProject = useCallback(() => {
    setDialog({ type: "add" });
  }, []);
  const handleEditProject: NonNullable<
    ProjectListContentProps["onEditProject"]
  > = useCallback((project) => {
    setDialog({ type: "edit", project });
  }, []);
  const handleHoldProject: NonNullable<
    ProjectListContentProps["onHoldProject"]
  > = useCallback(
    (project) => {
      if (project.presentationId != null) {
        navigate(pages.presentation(project.presentationId));
      } else if (project.holdDate == null) {
        dispatch(({ presentation }) =>
          presentation.createPresentation(project)
        );
      }
    },
    [dispatch, navigate]
  );
  const handleCopyProject: ProjectListContentProps["onCopyProject"] =
    useMemo(() => {
      if (projects.length >= maxProjects) {
        return undefined;
      }
      return (project) => {
        dispatch(({ projectList }) => projectList.copyProject({ project }));
      };
    }, [dispatch, projects.length]);
  const handleDeleteProject: NonNullable<
    ProjectListContentProps["onDeleteProject"]
  > = useCallback((project) => {
    setDialog({ type: "delete", project });
  }, []);
  const handleEditSlide: NonNullable<ProjectListContentProps["onEditSlide"]> =
    useCallback(
      (project) => {
        navigate(pages.slideEditor(project.id));
      },
      [navigate]
    );

  const handleClose = useCallback(() => {
    setDialog({ type: "none" });
  }, []);

  const submitNewProject: AddProjectDialogProps["onSubmit"] = useCallback(
    (value) => {
      dispatch(({ projectList }) => projectList.createProject(value));
      handleClose();
    },
    [dispatch, handleClose]
  );

  const editProject: EditProjectDialogProps["onSubmit"] = useCallback(
    (value) => {
      if (dialog.type !== "edit") {
        return;
      }
      dispatch(({ projectList }) =>
        projectList.updateProject({
          project: {
            ...dialog.project,
            ...value,
          },
        })
      );
      handleClose();
    },
    [dialog, dispatch, handleClose]
  );

  const deleteProject: DeleteProjectDialogProps["onSubmit"] =
    useCallback(() => {
      if (dialog.type !== "delete") {
        return;
      }
      dispatch(({ projectList }) =>
        projectList.deleteProject({ projectId: dialog.project.id })
      );
      handleClose();
    }, [dialog, dispatch, handleClose]);

  useEffect(() => {
    dispatch(({ projectList }) => projectList.setListener());
    return () => {
      dispatch(({ projectList }) => projectList.clearListener());
    };
  }, [dispatch]);

  return (
    <TopStickyLayout
      subHeader={{
        title: strings.project.projectList,
      }}
      top={
        <MemorizedProjectListActions
          projects={projects.length}
          filter={selectedFilter}
          setFilter={setSelectedFilter}
          onAddNewProject={handleAddNewProject}
        />
      }
    >
      <MemorizedProjectListContent
        projects={projects}
        filter={selectedFilter}
        onEditProject={handleEditProject}
        onHoldProject={handleHoldProject}
        onCopyProject={handleCopyProject}
        onDeleteProject={handleDeleteProject}
        onEditSlide={handleEditSlide}
      />
      <AddProjectDialog
        open={dialog.type === "add"}
        onClose={handleClose}
        onSubmit={submitNewProject}
      />
      <EditProjectDialog
        open={dialog.type === "edit"}
        initialValue={dialog.type === "edit" ? dialog.project : undefined}
        onClose={handleClose}
        onCancel={handleClose}
        onSubmit={editProject}
      />
      <DeleteProjectDialog
        open={dialog.type === "delete"}
        project={dialog.type === "delete" ? dialog.project : undefined}
        onClose={handleClose}
        onCancel={handleClose}
        onSubmit={deleteProject}
      />
    </TopStickyLayout>
  );
};

export default ProjectList;
