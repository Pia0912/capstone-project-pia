import ProfilePage from "./ProfilePage.tsx";
import LoadingPage from "./LoadingPage.tsx";

export default function GoalsTab() {
    return (
        <>
            <ProfilePage />
        <div id="goals" className="tabContent">
                <h2 className="tabTitle">Goals</h2>
            <LoadingPage />
        </div>
            </>
    );
}
