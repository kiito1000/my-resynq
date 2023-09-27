import { SlidePage } from "@/firebase/db";
import { mdiAccountMultiple, mdiPlayBoxOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import {
  Card,
  CardProps,
  Stack,
  Tab,
  Tabs,
  TabsProps,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppSelector } from "@redux/hooks/useAppSelector";
import { strings } from "@strings";
import sortBy from "lodash.sortby";
import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { ParticipantTable } from "./ParticipantTable";
import { ParticipantTableItem } from "./ParticipantTableRow";
import { SlidePageTable } from "./SlidePageTable";
import { SlidePageTableItem } from "./SlidePageTableRow";

const pageTitle = (page: SlidePage) => {
  switch (page.type) {
    case "start":
      return strings.presenter.pageTitles.start;
    case "question":
      return strings.presenter.pageTitles.question(
        page.question.title,
        page.question.index
      );
    case "rank":
      return strings.presenter.pageTitles.rank;
    case "end":
      return strings.presenter.pageTitles.end;
  }
};

type Tab = "pageList" | "participantList";

type TabPanelProps = {
  children: ReactNode;
  name: Tab;
  value: Tab;
};

const TabPanel: FC<TabPanelProps> = ({ name, value, children }) => {
  if (name !== value) {
    return null;
  }
  return <>{children}</>;
};

type TabLabelProps = {
  label: string;
};

const TabLabel: FC<TabLabelProps> = ({ label }) => {
  return <Typography fontSize={16}>{label}</Typography>;
};

type PageStatusProps = {
  currentPage: number;
  maxPages: number;
};

const PageStatus: FC<PageStatusProps> = ({ currentPage, maxPages }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <Icon
        path={mdiPlayBoxOutline}
        size="20px"
        color={theme.palette.text.secondary}
        style={{ marginTop: 2 }}
      />
      <Typography component="span" fontSize={14}>
        {`${currentPage} `}
        <Typography component="span" fontSize={12}>
          {`/${maxPages} ${strings.units.page} `}
        </Typography>
      </Typography>
    </Stack>
  );
};

type JoinedUserStatusProps = {
  joinedUsers: number;
};

const JoinedUserStatus: FC<JoinedUserStatusProps> = ({ joinedUsers }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <Icon
        path={mdiAccountMultiple}
        color={theme.palette.text.secondary}
        size={"20px"}
        style={{ marginTop: 2 }}
      />
      <Typography component="span" fontSize={14}>
        {joinedUsers}
        <Typography component="span" fontSize={12}>
          {strings.units.user}
        </Typography>
      </Typography>
    </Stack>
  );
};

export type SlideSideBarProps = CardProps;

export const SlideSideBar: FC<SlideSideBarProps> = ({ sx, ...props }) => {
  const pages = useAppSelector((state) => state.presenter.pages);
  const participants = useAppSelector((state) => state.presenter.participants);

  const [selectedTab, setSelectedTab] = useState<Tab>("pageList");

  const handleChangeTab: NonNullable<TabsProps["onChange"]> = useCallback(
    (_, value) => {
      setSelectedTab(value as Tab);
    },
    []
  );
  const pageTableItems: SlidePageTableItem[] = useMemo(
    () =>
      pages.map((page, i) => ({
        page: i + 1,
        title: pageTitle(page),
      })),
    [pages]
  );
  const participantTableItems: ParticipantTableItem[] = useMemo(
    () =>
      sortBy(participants, (participant) => participant.joinDate.unix()).map(
        (participant, i) => ({
          index: i + 1,
          iconUrl: participant.iconUrl,
          displayName: participant.displayName,
        })
      ),
    [participants]
  );

  const activePage = pages.findIndex((page) => page.status != null) + 1;

  return (
    <Card
      elevation={0}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          border: 1,
          borderColor: "border.main",
          borderRadius: 1,
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ borderBottom: 1, borderColor: "divider", pr: 2 }}
      >
        <Tabs value={selectedTab} onChange={handleChangeTab}>
          <Tab
            label={<TabLabel label={strings.presenter.pageList} />}
            value="pageList"
          />
          <Tab
            label={<TabLabel label={strings.presenter.participantList} />}
            value="participantList"
          />
        </Tabs>
        {selectedTab === "pageList" ? (
          <PageStatus currentPage={activePage} maxPages={pages.length} />
        ) : (
          <JoinedUserStatus joinedUsers={participants.length} />
        )}
      </Stack>
      <TabPanel name="pageList" value={selectedTab}>
        <SlidePageTable items={pageTableItems} activePage={activePage} />
      </TabPanel>
      <TabPanel name="participantList" value={selectedTab}>
        <ParticipantTable items={participantTableItems} />
      </TabPanel>
    </Card>
  );
};
