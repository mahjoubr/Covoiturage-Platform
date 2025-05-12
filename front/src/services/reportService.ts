import axios from "axios";

export type ReportAction = 'approve' | 'decline' | 'delete';
const API_BASE = 'http://localhost:3000/reports';

export async function handleReportAction(
    id: number,
    action: 'approve' | 'decline' | 'delete'
): Promise<Report | void> {
    const url = `${API_BASE}/${id}`;

    switch (action) {
        case 'approve':
        case 'decline': {
            const response = await axios.put<Report>(
                url,
                {},
                { params: { action } }
            );
            return response.data;
        }

        case 'delete': {
            await axios.put(url, {}, { params: { action } });
            return;
        }

        default:
            throw new Error(`Unknown action: ${action}`);
    }
}