import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(backendUrl + "/api/user/my-appointments", {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            const data = await res.json().catch(() => null);
            if (!data) {
                setError("No response from server");
                toast.error("Could not load appointments");
                setAppointments([]);
                return;
            }
            if (!res.ok || !data.success) {
                setError(data.message || "Failed to load appointments");
                toast.error(data.message || "Failed to load appointments");
                setAppointments([]);
                return;
            }
            setAppointments(Array.isArray(data.appointments) ? data.appointments : []);
        } catch (err) {
            console.error("fetchAppointments error", err);
            setError(err.message || "Failed to load appointments");
            toast.error(err.message || "Failed to load appointments");
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancel = async (appointmentId) => {
        if (!appointmentId) return;
        if (!confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            const res = await fetch(backendUrl + "/api/user/cancel-appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({ appointmentId }),
            });
            const data = await res.json().catch(() => null);
            if (!data) {
                toast.error("No response from server");
                return;
            }
            if (!res.ok || !data.success) {
                toast.error(data.message || "Could not cancel appointment");
                return;
            }
            toast.success(data.message || "Appointment cancelled");
            // refresh list
            fetchAppointments();
        } catch (err) {
            console.error("cancel appointment error", err);
            toast.error(err.message || "Could not cancel appointment");
        }
    };

    return (
        <div className="mt-12">
            <p className="pb-3 font-medium text-zinc-700 border-b mb-4">My Appointments</p>

            {loading && <p className="text-sm text-gray-500">Loading appointments...</p>}
            {error && !loading && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {!loading && appointments.length === 0 && (
                <div className="text-sm text-gray-600">You have no appointments yet.</div>
            )}

            <div className="space-y-4 mt-4">
                {appointments.map((ap) => {
                    const id = ap._id || ap.id || '';
                    const doc = ap.doctorData || ap.doctor || {};
                    const slotDate = ap.slotDate || ap.date || '';
                    const slotTime = ap.slotTime || '';
                    const amount = ap.amount || (doc.fees ?? '');
                    return (
                        <div key={id} className="grid grid-cols-[80px_1fr_auto] gap-4 items-center border-b pb-4">
                            <div>
                                <img src={doc.image || ''} alt={doc.name || 'doctor'} className="w-20 h-20 object-cover rounded-md bg-gray-50" />
                            </div>
                            <div className="text-sm text-zinc-700">
                                <p className="font-semibold">{doc.name || 'Doctor'}</p>
                                <p className="text-xs text-gray-500">{doc.speciality || ''}</p>
                                <p className="mt-2 text-xs text-gray-600">Date & Time: <span className="font-medium">{slotDate} | {slotTime}</span></p>
                                <p className="text-xs text-gray-600">Fee: <span className="font-medium">{amount}</span></p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <button onClick={() => toast.info('Payment flow not implemented')} className="text-sm text-stone-500 py-2 px-4 border rounded-full hover:bg-primary hover:text-white transition-all">Pay Online</button>
                                <button onClick={() => handleCancel(id)} className="text-sm text-stone-500 py-2 px-4 border rounded-full hover:bg-red-400 hover:text-white transition-all">Cancel Appointment</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyAppointments;