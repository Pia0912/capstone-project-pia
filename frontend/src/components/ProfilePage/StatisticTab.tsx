import { useEffect, useState } from 'react';
import axios from 'axios';
import ProfilePage from './ProfilePage.tsx';

interface ActivityCounts {
    [key: string]: number;
}

interface ActivityDays {
    [key: string]: number;
}

interface MostAddedActivity {
    name: string;
}

export default function StatisticTab() {
    const [activityCounts, setActivityCounts] = useState<ActivityCounts>({});
    const [mostAddedActivity, setMostAddedActivity] = useState<MostAddedActivity | null>(null);
    const [activityDays, setActivityDays] = useState<ActivityDays>({});

    useEffect(() => {
        axios.get<ActivityCounts>('/api/activities/activity-counts')
            .then(response => setActivityCounts(response.data))
            .catch(error => console.error(error));

        axios.get<string>('/api/activities/most-added-activity')
            .then(response => setMostAddedActivity({ name: response.data }))
            .catch(error => console.error(error));

        axios.get<ActivityDays>('/api/activities/activity-days')
            .then(response => setActivityDays(response.data))
            .catch(error => console.error(error));
    }, []);

    const formatData = (data: Record<string, number>) => {
        return Object.keys(data)
            .map(key => `${key}: ${data[key]}x`)
            .join('\n');
    };

    return (
        <div className="div-statisticTab">
            <ProfilePage/>
            <div id="stats" className="tabContent">
                <h2 className="tabTitle">Account Statistic</h2>
                <table className="statistic-table">
                    <tbody>
                    <tr>
                        <td className="statistic-subheader2">Days you added activities</td>
                        <td >
                            <pre className="statistic-pre2">{formatData(activityDays)}</pre>
                        </td>
                    </tr>
                    <tr>
                        <td className="statistic-subheader">Most Added Activity</td>
                        <td>
                            <pre className="statistic-pre">{mostAddedActivity?.name ?? 'N/A'}</pre>
                        </td>
                    </tr>
                    <tr>
                        <td className="statistic-subheader3">Activity Counts</td>
                        <td>
                            <pre className="statistic-pre3">{formatData(activityCounts)}</pre>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
