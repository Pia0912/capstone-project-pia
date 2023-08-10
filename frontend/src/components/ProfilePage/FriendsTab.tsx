import ProfilePage from "./ProfilePage.tsx";
import LoadingPage from "./LoadingPage.tsx";

export default function FriendsTab() {
    return (
        <div className="div-friendsTab">
            <ProfilePage />
        <div id="friends" className="tabContent">
                <h2>Friends</h2>
                <LoadingPage />
        </div>
            </div>
    );
}
