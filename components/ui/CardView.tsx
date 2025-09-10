import React from 'react';
import { Patient } from './PatientDirectory';

interface CardViewProps {
    patients: Patient[];
    getMedicalIssueBadge: (issue: string) => string;
    getInitials: (name: string) => string;
}

const CardView: React.FC<CardViewProps> = ({ patients, getMedicalIssueBadge, getInitials }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {patients.map((patient, index) => {
                const contact = patient.contact[0] || {};
                return (
                    <div
                        key={`${patient.patient_id}-${index}`}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                                {patient.photo_url ? (
                                    <img 
                                        src={patient.photo_url} 
                                        alt={patient.patient_name}
                                        className="h-12 w-12 rounded-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            if (e.currentTarget.nextElementSibling) {
                                                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                            }
                                        }}
                                    />
                                ) : null}
                                <div className={`text-sm font-medium text-blue-600 dark:text-blue-400 ${patient.photo_url ? 'hidden' : 'flex'} items-center justify-center`}>
                                    {getInitials(patient.patient_name)}
                                </div>
                            </div>
                            <span className="text-xs bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-full ml-2">
                                Age {patient.age}
                            </span>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{patient.patient_name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID-{patient.patient_id.toString().padStart(4, '0')}</p>
                        </div>

                        <div className="mb-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMedicalIssueBadge(patient.medical_issue)}`}>
                                {patient.medical_issue}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-start gap-2">
                                <span className="text-gray-400 dark:text-gray-500 mt-0.5">📍</span>
                                <span className="break-words flex-1">
                                    {contact.address || <span className="text-gray-400 dark:text-gray-500 italic">No address</span>}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 dark:text-gray-500">📞</span>
                                <span>
                                    {contact.number ? (
                                        <a href={`tel:${contact.number}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
                                            {contact.number}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 dark:text-gray-500 italic">No phone</span>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-gray-400 dark:text-gray-500 mt-0.5">📧</span>
                                {contact.email ? (
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 break-words flex-1 hover:underline transition-colors"
                                    >
                                        {contact.email}
                                    </a>
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500 italic">No email</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CardView;