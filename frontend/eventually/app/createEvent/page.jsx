'use client'; // Mark as a client component for using React hooks

import React, { useState } from 'react';

const CreateEvent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [userName, setUserName] = useState('');
    const [finalDate, setFinalDate] = useState('');
    const [proposedDates, setProposedDates] = useState([{ start: '', end: '' }]);
    const [responseMessage, setResponseMessage] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/api/event/create';

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventData = {
            title,
            description,
            location,
            joinCode,
            userName,
            finalDate,
            proposedDates,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage({ success: true, message: 'Event created successfully!' });
                console.log('Event created:', data.message);
            } else {
                setResponseMessage({ success: false, message: data.error || 'Failed to create event.' });
                console.error('Error creating event:', data.error);
            }
        } catch (error) {
            setResponseMessage({ success: false, message: 'Network error: ' + error.message });
            console.error('Network error:', error);
        }
    };

    const handleProposedDateChange = (index, field, value) => {
        const updatedDates = [...proposedDates];
        updatedDates[index][field] = value;
        setProposedDates(updatedDates);
    };

    const addProposedDate = () => {
        setProposedDates([...proposedDates, { start: '', end: '' }]);
    };

    const removeProposedDate = (index) => {
        const updatedDates = proposedDates.filter((_, i) => i !== index);
        setProposedDates(updatedDates);
    };

    return (
        <div className="flex flex-col p-4 space-y-4">
            <h1 className="font-extrabold text-2xl mb-4">Create Event</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title" className="block text-lg font-medium">Event Name:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-lg font-medium">Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-lg font-medium">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="joinCode" className="block text-lg font-medium">Join Code:</label>
                    <input
                        type="text"
                        id="joinCode"
                        name="joinCode"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="userName" className="block text-lg font-medium">User Name:</label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="finalDate" className="block text-lg font-medium">Final Date:</label>
                    <input
                        type="date"
                        id="finalDate"
                        name="finalDate"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded"
                        value={finalDate}
                        onChange={(e) => setFinalDate(e.target.value)}
                    />
                </div>

                {/* Proposed Dates Section */}
                <div>
                    <h3 className="mt-4 text-lg font-medium">Proposed Dates:</h3>
                    {proposedDates.map((date, index) => (
                        <div key={index} className="flex space-x-2 mt-2">
                            <input
                                type="datetime-local"
                                value={date.start}
                                onChange={(e) => handleProposedDateChange(index, 'start', e.target.value)}
                                className="flex-1 px-4 py-2 text-black bg-gray-300 rounded"
                                placeholder="Start Date"
                            />
                            <input
                                type="datetime-local"
                                value={date.end}
                                onChange={(e) => handleProposedDateChange(index, 'end', e.target.value)}
                                className="flex-1 px-4 py-2 text-black bg-gray-300 rounded"
                                placeholder="End Date"
                            />
                            <button
                                type="button"
                                onClick={() => removeProposedDate(index)}
                                className="px-2 py-1 bg-red-500 text-white rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addProposedDate}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Add Proposed Date
                    </button>
                </div>

                <button type="submit" className="mt-4 px-4 py-2 text-white bg-gray-800 rounded">
                    Create Event
                </button>
            </form>

            {responseMessage && (
                <div className={`mt-4 ${responseMessage.success ? 'text-green-500' : 'text-red-500'}`}>
                    {responseMessage.message}
                </div>
            )}
        </div>
    );
};

export default CreateEvent;

