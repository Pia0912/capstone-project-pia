import InAppPurchase from "../InAppPurchase.tsx";
import ProfilePage from "./ProfilePage.tsx";

export default function GoalsTab() {
    return (
        <>
            <ProfilePage />
        <div id="goals" className="tabContent">
                <h3>Goals</h3>
            <div className="in-app-container"><InAppPurchase /></div>
        </div>
            </>
    );
}