import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import EditProfile from "./pages/EditProfile";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ChatPage from "./pages/Chat/chatPage";
import MyReviewsWithClient from "./pages/Review/ReviewedListPage";
import Home from "./pages/Dashboard/Home";
import Posts from "./pages/Posts/PostsPage";
import UserProfiles from "./pages/UserProfile";
import ReviewPage from "./pages/Review/ReviewFormPage";
import Rides from "./pages/Rides/RidesPage";
import MyReceivedReviews from "./pages/Review/RecievedReviewsListPage";
import UpdateReviewModal from "./pages/Review/updateReview";
export default function App() {
  return (
    <React.Fragment>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile/Edit" element={<EditProfile />} />
            <Route path="/profile" element={<UserProfiles />} />

            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="reviewed-list" element={<MyReviewsWithClient />} />
            <Route path="received-reviews" element={<MyReceivedReviews />} />
            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
            <Route path="/posts" element={<Posts/>}/>
            <Route path="/rides" element={<Rides/>}/>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </React.Fragment>
        );
}
