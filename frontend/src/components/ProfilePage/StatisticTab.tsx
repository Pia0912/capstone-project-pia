import ProfilePage from "./ProfilePage.tsx";
import LoadingPage from "./LoadingPage.tsx";

export default function StatsTab() {
    return (
        <div className="div-statisticTab">
            <ProfilePage />
        <div id="stats" className="tabContent">
            <h2 className="tabTitle">Account Statistic</h2>
            <LoadingPage />
        </div>
        </div>
    );
}
