import React from "react";
import { createBrowserRouter, Outlet } from "react-router";
import { AppProvider } from "./context";
import { MobileFrame } from "./components/MobileFrame";
import { TripInfoScreen } from "./components/TripInfoScreen";
import { StyleScreen } from "./components/StyleScreen";
import { ModeScreen } from "./components/ModeScreen";
import { PlacesScreen } from "./components/PlacesScreen";
import { TimelineEditor } from "./components/TimelineEditor";
import { ShareScreen } from "./components/ShareScreen";
import { SavedTripsScreen } from "./components/SavedTripsScreen";
import { MyPageScreen } from "./components/MyPageScreen";
import { BottomNav } from "./components/BottomNav";
import { DepartureArrivalScreen } from "./components/DepartureArrivalScreen";
import { CalendarScreen } from "./components/CalendarScreen";
import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { LoginScreen } from "./components/LoginScreen";
import { NotificationSettingsScreen } from "./components/NotificationSettingsScreen";
import { TravelHistoryScreen } from "./components/TravelHistoryScreen";
import { PrivacyPolicyScreen } from "./components/PrivacyPolicyScreen";
import { CustomerSupportScreen } from "./components/CustomerSupportScreen";
import { DestinationSelectScreen } from "./components/DestinationSelectScreen";
import { MapSearchScreen } from "./components/MapSearchScreen";
import { PlaceSearchScreen } from "./components/PlaceSearchScreen";
import { PlaceDetail } from "./components/PlaceDetail";

function RootLayout() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}

function AppLayout() {
  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

function WizardLayout() {
  return (
    <MobileFrame>
      <Outlet />
    </MobileFrame>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", Component: TripInfoScreen },
          { path: "/calendar", Component: CalendarScreen },
          { path: "/saved", Component: SavedTripsScreen },
          { path: "/mypage", Component: MyPageScreen },
        ],
      },
      {
        element: <WizardLayout />,
        children: [
          { path: "/splash", Component: SplashScreen },
          { path: "/onboarding", Component: OnboardingScreen },
          { path: "/login", Component: LoginScreen },
          { path: "/style", Component: StyleScreen },
          { path: "/mode", Component: ModeScreen },
          {
            path: "/departure",
            Component: DepartureArrivalScreen,
          },
          { path: "/places", Component: PlacesScreen },
          { path: "/editor", Component: TimelineEditor },
          { path: "/share", Component: ShareScreen },
          { path: "/place-detail", Component: PlaceDetail },
          {
            path: "/notifications",
            Component: NotificationSettingsScreen,
          },
          { path: "/history", Component: TravelHistoryScreen },
          { path: "/privacy", Component: PrivacyPolicyScreen },
          {
            path: "/support",
            Component: CustomerSupportScreen,
          },
          {
            path: "/destination",
            Component: DestinationSelectScreen,
          },
          { path: "/map-search", Component: MapSearchScreen },
          {
            path: "/place-search",
            Component: PlaceSearchScreen,
          },
        ],
      },
    ],
  },
]);