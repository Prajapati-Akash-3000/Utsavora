import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/common/Loader'; // Assuming Loader exists

const ManagerDashboard = () => {
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const res = await api.get('/accounts/manager/earnings/');
                setEarnings(res.data);
            } catch (err) {
                console.error("Failed to load earnings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    if (loading) return <Loader text="Loading dashboard..." />;

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Manager Dashboard</h1>
            
            {/* EARNINGS STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-gray-500 font-medium">Total Released</p>
                    <p className="text-3xl font-bold text-gray-900">₹{earnings?.total_earned?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <p className="text-gray-500 font-medium">Pending Clearance</p>
                    <p className="text-3xl font-bold text-gray-900">₹{earnings?.pending_clearance?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <p className="text-gray-500 font-medium">Events Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{earnings?.events_completed || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
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

                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
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

                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
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

                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
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
            
            {/* Recent Completed Events */}
            {earnings?.recent?.length > 0 && (
                <div className="mt-8 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Recent Completed Events</h3>
                    <ul className="divide-y">
                        {earnings.recent.map((e, idx) => (
                            <li key={idx} className="py-2 flex justify-between">
                                <span>{e.event}</span>
                                <span className="font-bold text-green-600">+₹{e.amount}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;
