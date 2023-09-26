import { Auth } from "@components/Auth";
import { Login } from "@components/Login";
import { NotFound } from "@components/NotFound";
import { PresentationTop } from "@components/presentations/PresentationTop";
import { lazy } from "react";
import { Navigate, createBrowserRouter, generatePath } from "react-router-dom";

const LandingTop = lazy(() => import("@components/landing/LandingTop"));
const SlideEditor = lazy(
  () => import("@components/projects/slideEditor/SlideEditor")
);
const ProjectList = lazy(
  () => import("@components/projects/projectList/ProjectList")
);
const SlideTop = lazy(() => import("@components/slide/SlideTop"));

const routes = {
  root: "/",
  login: "login",
  tos: "tos",
  releaseNotes: "release-notes",
  contact: "contact",
  events: {
    index: "events",
    project: ":projectId",
  },
  slides: {
    index: "slides",
    slide: ":presentationId",
  },
  presentations: {
    index: "presentations",
    presentation: ":presentationId",
  },
  notFound: "404",
} as const;

export const pages = {
  lp: () => routes.root,
  login: () => `/${routes.login}`,
  tos: () => `/${routes.tos}`,
  releaseNotes: () => `/${routes.releaseNotes}`,
  contact: () => `/${routes.contact}`,
  events: () => `/${routes.events.index}`,
  slideEditor: (projectId: string) =>
    generatePath(`/${routes.events.index}/${routes.events.project}`, {
      projectId,
    }),
  slideViewer: (presentationId: string) =>
    generatePath(`/${routes.slides.index}/${routes.slides.slide}`, {
      presentationId,
    }),
  presentation: (presentationId: string) =>
    generatePath(
      `/${routes.presentations.index}/${routes.presentations.presentation}`,
      { presentationId }
    ),
  notFound: () => `/${routes.notFound}`,
} as const;

export const router = createBrowserRouter([
  {
    path: routes.root,
    index: true,
    element: <LandingTop />,
  },
  {
    path: routes.root,
    children: [
      {
        path: routes.login,
        element: (
          <Auth disallowAnonymous fallback={<Login />}>
            <Navigate to={pages.events()} />
          </Auth>
        ),
      },
      {
        path: routes.tos,
        element: "利用規約画面",
      },
      {
        path: routes.releaseNotes,
        element: "リリースノート画面",
      },
      {
        path: routes.contact,
        element: "お問い合わせ画面",
      },
      {
        path: routes.events.index,
        index: true,
        element: (
          <Auth disallowAnonymous fallback={<Login />}>
            <ProjectList />
          </Auth>
        ),
      },
      {
        path: routes.events.index,
        children: [
          {
            path: routes.events.project,
            element: (
              <Auth disallowAnonymous fallback={<Login />}>
                <SlideEditor />
              </Auth>
            ),
          },
        ],
      },
      {
        path: routes.slides.index,
        children: [
          {
            path: routes.slides.slide,
            element: (
              <Auth autoLogin>
                <SlideTop />
              </Auth>
            ),
          },
        ],
      },
      {
        path: routes.presentations.index,
        children: [
          {
            path: routes.presentations.presentation,
            element: (
              <Auth autoLogin fallback={<Login />}>
                <PresentationTop />
              </Auth>
            ),
          },
        ],
      },
    ],
  },
  {
    path: routes.notFound,
    element: <NotFound />,
  },
  {
    path: "*",
    element: <Navigate to={pages.notFound()} />,
  },
]);
