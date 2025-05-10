import React, { useEffect, useState } from 'react';
import { X, FileText, User, MapPin, Calendar, Clock, AlertCircle, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { ReportDetailsProps } from '../../types/report.ts';
import { getStatusConfig } from './statusConfig.tsx';
import { CurrentUser, getCurrentUser } from '../../services/authService.ts';
import { handleReportAction } from '../../services/reportService.ts';
import { Report } from '../../types/report';

const ReportDetails: React.FC<ReportDetailsProps> = ({ report, onClose , onChange }) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [localReport, setLocalReport] = useState<Report | null>(null);

    useEffect(() => {
        (async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        })();
    }, []);

    useEffect(() => {
        setLocalReport(report);
    }, [report]);

    const handleAction = async (id: number, action: 'delete' | 'approve' | 'decline') => {
        try {
             await handleReportAction(id, action);
            onClose();
            onChange?.();
        } catch (err) {
            console.error(err);
            // TODO: display notification to user
        }
    };

    if (!localReport) return null;
    const statusConfig = getStatusConfig(localReport.status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto py-8">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative mx-4 border border-gray-200">
                {/* Header */}
                <div className="bg-gray-50 p-6 rounded-t-2xl border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="text-blue-600" size={24} />
                                Report Details
                            </h2>
                            <span className={`${statusConfig.lightClass} px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1`}>
                {statusConfig.icon}
                                {statusConfig.label}
              </span>
                        </div>
                        <button onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Reporter & Reported User */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h3 className="flex items-center gap-2 text-purple-700 font-semibold mb-3">
                                <User size={18} /> Reporter
                            </h3>
                            <div className="flex items-center gap-3">
                                <img src={localReport.reporter.imageUrl} alt="Reporter" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                                <p className="font-medium text-gray-800">{localReport.reporter.name} {localReport.reporter.lastName}</p>
                            </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <h3 className="flex items-center gap-2 text-red-700 font-semibold mb-3">
                                <AlertCircle size={18} /> Reported User
                            </h3>
                            <div className="flex items-center gap-3">
                                <img src={localReport.reportedUser.imageUrl} alt="Reported User" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                                <p className="font-medium text-gray-800">{localReport.reportedUser.name} {localReport.reportedUser.lastName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Reason for Report</p>
                        <p className="text-gray-800">{localReport.reason}</p>
                    </div>

                    {/* Basics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Subject</p>
                            <p className="font-medium text-gray-800">{localReport.subjectType}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Reported on</p>
                            <p className="font-medium text-gray-800">{new Date(localReport.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Ride */}
                    {localReport.reportedRide && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="flex items-center gap-2 text-gray-700 font-semibold mb-3"><MapPin size={18} /> Reported Ride</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-sm text-gray-500">Departure</p><p className="font-medium text-gray-800">{localReport.reportedRide.departure}</p></div>
                                <div><p className="text-sm text-gray-500">Arrival</p><p className="font-medium text-gray-800">{localReport.reportedRide.arrival}</p></div>
                                <div><p className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14} />Date</p><p className="font-medium text-gray-800">{localReport.reportedRide.date}</p></div>
                                <div><p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14} />Time</p><p className="font-medium text-gray-800">{localReport.reportedRide.time}</p></div>
                            </div>
                        </div>
                    )}

                    {/* Proof */}
                    {localReport.proofUrl && (
                        <button onClick={() => window.open(localReport.proofUrl, '_blank')} rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <FileText size={16} /> View Proof Document
                        </button>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-6">
                        <button onClick={() => handleAction(localReport.id, 'delete')} className="text-red-600 hover:text-red-800 hover:bg-red-100/70 p-2 rounded-full transition-colors" title="Delete Report">
                            <Trash2 size={20} />
                        </button>
                        {currentUser?.role === 'admin' && localReport.status === 'PENDING' && (
                            <div className="flex gap-4">
                                <button onClick={() => handleAction(localReport.id, 'approve')} className="flex items-center gap-2 px-5 py-2.5 bg-green-100 hover:bg-emerald-200 active:bg-green-400 text-green-700 border border-green-200 rounded-lg text-sm font-medium shadow-sm">
                                    <CheckCircle size={18} /> Approve
                                </button>
                                <button onClick={() => handleAction(localReport.id, 'decline')} className="flex items-center gap-2 px-5 py-2.5 bg-red-100 hover:bg-red-300 active:bg-red-400 text-red-700 border border-red-200 rounded-lg text-sm font-medium shadow-sm">
                                    <XCircle size={18} /> Decline
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
