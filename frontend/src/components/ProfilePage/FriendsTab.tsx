import InAppPurchase from "../InAppPurchase.tsx";
import ProfilePage from "./ProfilePage.tsx";

export default function FriendsTab() {
    return (
        <>
            <ProfilePage />
        <div id="friends" className="tabContent">
                <h3>Friends</h3>
                <div className="in-app-container"><InAppPurchase /></div>
        </div>
            </>
    );
}