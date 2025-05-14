// Mock API para simular llamadas al servidor
// const eventsData = [
//     {
//         id: 1,
//         name: "Conferencia de Tecnología",
//         description: "Evento anual de tecnología",
//         date: "2023-11-15",
//         status: "open",
//         attendees: [
//             { id: 1, name: "Juan Pérez", credentialNumber: "CP001", dni: "12345678", email: "juan@example.com" },
//             { id: 2, name: "María García", credentialNumber: "CP002", dni: "87654321", email: "maria@example.com" }
//         ]
//     },
//     {
//         id: 2,
//         name: "Taller de React",
//         description: "Taller práctico de ReactJS",
//         date: "2023-11-20",
//         status: "open",
//         attendees: [
//             { id: 3, name: "Carlos López", credentialNumber: "CP003", dni: "11223344", email: "carlos@example.com" }
//         ]
//     }
// ];

// const attendancesData = [];

// export const fetchEvents = async () => {
//     return new Promise(resolve => {
//         setTimeout(() => resolve(eventsData), 500);
//     });
// };

// export const getEventAttendees = async (eventId) => {
//     return new Promise(resolve => {
//         const event = eventsData.find(e => e.id === eventId);
//         resolve(event ? [...event.attendees] : []);
//     });
// };

// export const markAttendance = async (attendance) => {
//     return new Promise(resolve => {
//         attendancesData.push(attendance);
//         setTimeout(() => resolve(true), 300);
//     });
// };

// export const syncAttendances = async (pendingAttendances) => {
//     return new Promise(resolve => {
//         pendingAttendances.forEach(att => attendancesData.push(att));
//         setTimeout(() => resolve(true), 500);
//     });
// };


// const API_URL = process.env.REACT_APP_API_URL;
// const API_URL = '/api'; // Usa proxy en desarrollo
const API_URL = process.env.NODE_ENV === 'development'
    ? '/api'
    : process.env.REACT_APP_API_URL;

export const fetchEvents = async () => {
    const response = await fetch(`${API_URL}/events/open`);
    if (!response.ok) {
        throw new Error('Error fetching events');
    }
    return response.json();
};

export const getEventAttendees = async (eventId) => {
    const response = await fetch(`${API_URL}/events/${eventId}/attendees`);
    if (!response.ok) {
        throw new Error('Error fetching attendees');
    }
    return response.json();
};

export const markAttendance = async (attendance) => {
    const response = await fetch(`${API_URL}/attendances`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            eventId: attendance.eventId,
            personId: attendance.personId
        }),
    });

    if (!response.ok) {
        throw new Error('Error marking attendance');
    }

    return response.json();
};

export const syncAttendances = async (pendingAttendances) => {
    const response = await fetch(`${API_URL}/attendances/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pendingAttendances
        }),
    });

    if (!response.ok) {
        throw new Error('Error syncing attendances');
    }

    return response.json();
};

