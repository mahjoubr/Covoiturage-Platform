import React from 'react';
import { X, FileText, User, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { ReportDetailsProps } from "../../types/report.ts";
import {getStatusConfig} from "./statusConfig.tsx";

const ReportDetails: React.FC<ReportDetailsProps> = ({ report, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto py-8">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative mx-4 border border-gray-200">
                {/* Header with status now included */}
                <div className="bg-gray-50 p-6 rounded-t-2xl border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="text-blue-600" size={24} />
                                Report Details
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusConfig(report.status).lightClass}`}>
                                {getStatusConfig(report.status).icon}
                                {getStatusConfig(report.status).label}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* People involved - moved to top */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Reporter - changed to purple */}
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h3 className="flex items-center gap-2 text-purple-700 font-semibold mb-3">
                                <User size={18} />
                                Reporter
                            </h3>
                            <div className="flex items-center gap-3">
                                <img src={report.reporter.imageUrl} alt="Reporter" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                                <div>
                                    <p className="font-medium text-gray-800">{report.reporter.name} {report.reporter.lastName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reported User */}
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <h3 className="flex items-center gap-2 text-red-700 font-semibold mb-3">
                                <AlertCircle size={18} />
                                Reported User
                            </h3>
                            <div className="flex items-center gap-3">
                                <img src={report.reportedUser.imageUrl} alt="Reported User" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                                <div>
                                    <p className="font-medium text-gray-800">{report.reportedUser.name} {report.reportedUser.lastName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Reason for Report</p>
                        <p className="text-gray-800">{report.reason}</p>
                    </div>

                    {/* Basic info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Subject</p>
                            <p className="font-medium text-gray-800">{report.subjectType}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Reported on</p>
                            <p className="font-medium text-gray-800">{new Date(report.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Reported Ride (if exists) */}
                    {report.reportedRide && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                <MapPin size={18} />
                                Reported Ride
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Departure</p>
                                    <p className="font-medium text-gray-800">{report.reportedRide.departure}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Arrival</p>
                                    <p className="font-medium text-gray-800">{report.reportedRide.arrival}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar size={14} /> Date
                                    </p>
                                    <p className="font-medium text-gray-800">{report.reportedRide.date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Clock size={14} /> Time
                                    </p>
                                    <p className="font-medium text-gray-800">{report.reportedRide.time}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Proof (if exists) */}
                    {report.proofUrl && (
                        <div className="mt-4">
                            <button
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <FileText size={16} />
                                View Proof Document
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;