import InAppPurchase from "../InAppPurchase.tsx";
import ProfilePage from "./ProfilePage.tsx";

export default function BadgesTab() {
    return (
        <>
            <ProfilePage />
        <div id="badges" className="tabContent">
                <h3>Badges</h3>
            <div className="in-app-container"><InAppPurchase /></div>
        </div>
            </>
    );
}