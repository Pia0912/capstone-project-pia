import InAppPurchase from "../InAppPurchase.tsx";
import ProfilePage from "./ProfilePage.tsx";

export default function StatsTab() {
    return (
        <>
            <ProfilePage />
        <div id="stats" className="tabContent">
            <h3>Account Statistic</h3>
            <div className="in-app-container"><InAppPurchase /></div>
        </div>
        </>
    );
}