import React from 'react';
import { Patient } from './PatientDirectory';

interface TableViewProps {
    patients: Patient[];
    getMedicalIssueBadge: (issue: string) => string;
    getInitials: (name: string) => string;
}

const TableView: React.FC<TableViewProps> = ({ patients, getMedicalIssueBadge, getInitials }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <th className="text-left font-medium text-blue-600 dark:text-blue-400 px-6 py-4">ID</th>
                            <th className="text-left font-medium text-blue-600 dark:text-blue-400 px-6 py-4">Name</th>
                            <th className="text-left font-medium text-blue-600 dark:text-blue-400 px-6 py-4">Age</th>
                            <th className="text-left font-medium text-blue-600 dark:text-blue-400 px-6 py-4">Medical Issue</th>
                            <th className="text-left font-medium text-blue-600 dark:text-blue-400 px-6 py-4">Address</th>
                            <th className="text-left font-medium text-blue-600 dark:text-blue-400 px-6 py-4">Phone</th>
                            <th className="text-left font-medium text-blue-600 dark:text-blue-400 px-6 py-4">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient, index) => {
                            const contact = patient.contact[0] || {};
                            return (
                                <tr key={`${patient.patient_id}-${index}`} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        ID-{patient.patient_id.toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                                                {patient.photo_url ? (
                                                    <img 
                                                        src={patient.photo_url} 
                                                        alt={patient.patient_name}
                                                        className="h-8 w-8 rounded-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            if (e.currentTarget.nextElementSibling) {
                                                                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                                            }
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`text-xs font-medium text-blue-600 dark:text-blue-400 ${patient.photo_url ? 'hidden' : 'flex'} items-center justify-center`}>
                                                    {getInitials(patient.patient_name)}
                                                </div>
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{patient.patient_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{patient.age}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMedicalIssueBadge(patient.medical_issue)}`}>
                                            {patient.medical_issue}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                                        <div className="truncate" title={contact.address || 'No address'}>
                                            {contact.address || <span className="text-gray-400 dark:text-gray-500 italic">No address</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {contact.number ? (
                                            <a href={`tel:${contact.number}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
                                                {contact.number}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500 italic">No phone</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm max-w-xs">
                                        {contact.email ? (
                                            <a 
                                                href={`mailto:${contact.email}`} 
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline block truncate"
                                                title={contact.email}
                                            >
                                                {contact.email}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500 italic">No email</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableView;