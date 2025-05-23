import React, { useState, useEffect } from 'react';
import PersonCard from './PersonCard';
import SearchBar from './SearchBar';
import { markAttendance as markAttendanceApi, getEventAttendees as getEventWithAttendeesAPI } from '../services/api';
import { saveAttendance, getLocalEventWithAttendees } from '../services/db';

const AttendanceList = ({ event, onBack, isOnline }) => {
    const [attendees, setAttendees] = useState([]);
    const [filteredAttendees, setFilteredAttendees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    console.log('event in AttendanceList =>', event)
    useEffect(() => {
        const loadAttendees = async () => {
            setIsLoading(true);
            try {
                let eventData;

                if (isOnline) {
                    // En producción, aquí harías una llamada a la API real
                    //eventData = event;
                    eventData = await getEventWithAttendeesAPI(event.id);
                } else {
                    eventData = await getLocalEventWithAttendees(event.id);
                }

                setAttendees(eventData?.attendees || []);
            } catch (error) {
                console.error('Error loading attendees:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAttendees();
    }, [event.id, isOnline]);

    useEffect(() => {
        const filtered = attendees.filter(person =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.credentialNumber.includes(searchTerm) ||
            person.dni.includes(searchTerm) ||
            person.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAttendees(filtered);
    }, [searchTerm, attendees]);

    const handleMarkAttendance = async (personId) => {
        console.log('personId =>', personId)
        const attendanceRecord = {
            eventId: event.id,
            personId,
            timestamp: new Date().toISOString()
        };

        try {
            if (isOnline) {
                await markAttendanceApi(attendanceRecord);
            }

            await saveAttendance(attendanceRecord);

            setAttendees(attendees.map(person =>
                person.id === personId
                    ? {
                        ...person,
                        attended: true,
                        attendanceTime: attendanceRecord.timestamp
                    }
                    : person
            ));
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    if (isLoading) {
        return <div className="loading">Cargando asistentes...</div>;
    }

    return (
        <div className="attendance-list">
            <button className="back-button" onClick={onBack}>
                &larr; Volver a Eventos
            </button>
            <h1>Registro de Asistencia</h1>
            <h2>{event.name}</h2>

            <SearchBar value={searchTerm} onChange={setSearchTerm} />

            <div className="stats">
                <p>
                    Total: {attendees.length} |
                    Asistentes: {attendees.filter(a => a.attended).length}
                </p>
            </div>

            <div className="person-list">
                {filteredAttendees.length > 0 ? (
                    filteredAttendees.map(person => (
                        <PersonCard
                            key={person._id}
                            person={person}
                            onMarkAttendance={handleMarkAttendance}
                        />
                    ))
                ) : (
                    <p className="no-results">No se encontraron resultados</p>
                )}
            </div>
        </div>
    );
};

export default AttendanceList;