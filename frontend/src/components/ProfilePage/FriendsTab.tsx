import ProfilePage from "./ProfilePage.tsx";
import LoadingPage from "./LoadingPage.tsx";

export default function FriendsTab() {
    return (
        <>
            <ProfilePage />
        <div id="friends" className="tabContent">
                <h2>Friends</h2>
                <LoadingPage />
        </div>
            </>
    );
}
