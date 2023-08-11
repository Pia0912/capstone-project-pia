import ProfilePage from "./ProfilePage.tsx";
import LoadingPage from "./LoadingPage.tsx";

export default function BadgesTab() {
    return (
        <div className="div-badgesTab">
            <ProfilePage />
        <div id="badges" className="tabContent">
            <h2 className="tabTitle">Badges</h2>
            <LoadingPage />
        </div>
            </div>
    );
}
