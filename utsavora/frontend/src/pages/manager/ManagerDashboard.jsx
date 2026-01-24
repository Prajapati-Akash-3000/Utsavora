import React from 'react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Manager Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Event Requests
                                </dt>
                                <dd>
                                    <Link to="/manager/requests" className="text-lg font-medium text-indigo-600 hover:text-indigo-900">
                                        View Requests &rarr;
                                    </Link>
                                </dd>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    My Packages
                                </dt>
                                <dd>
                                    <Link to="/manager/packages" className="text-lg font-medium text-indigo-600 hover:text-indigo-900">
                                        Manage Packages &rarr;
                                    </Link>
                                </dd>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Profile & Bank
                                </dt>
                                <dd>
                                    <Link to="/manager/profile" className="text-lg font-medium text-indigo-600 hover:text-indigo-900">
                                        Edit Profile &rarr;
                                    </Link>
                                </dd>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Availability Calendar
                                </dt>
                                <dd>
                                    <Link to="/manager/calendar" className="text-lg font-medium text-indigo-600 hover:text-indigo-900">
                                        Manage Dates &rarr;
                                    </Link>
                                </dd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
