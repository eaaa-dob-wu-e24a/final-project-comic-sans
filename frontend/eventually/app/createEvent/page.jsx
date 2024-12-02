'use client'; // Mark as a client component for using React hooks

import React, { useState } from 'react';
import GradientCurve from "@/components/gradientcurve";

const CreateEvent = () => {
    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Format as 'YYYY-MM-DDTHH:mm'
    };

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [userName, setUserName] = useState('');
    const [finalDate, setFinalDate] = useState('');
    const [proposedDates, setProposedDates] = useState([
        { start: getCurrentDateTime(), end: getCurrentDateTime() },
    ]);
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
                credentials: "include", // Send cookies with the request if needed for session-based auth
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
        setProposedDates([...proposedDates, { start: getCurrentDateTime(), end: getCurrentDateTime() }]);
    };

    const removeProposedDate = (index) => {
        const updatedDates = proposedDates.filter((_, i) => i !== index);
        setProposedDates(updatedDates);
    };

    return (
        <main className="flex flex-col">
            <GradientCurve className={"max-h-24"}>
                <div className="max-w-6xl mx-auto flex">
                    <h1 className="font-bold text-2xl mx-auto max-w-6xl pb-12 text-white">
                        Create Event
                    </h1>
                </div>
            </GradientCurve>

            <section className="max-w-6xl w-full space-y-4 p-12 rounded-xl drop-shadow mx-auto flex flex-col text-black place-content-center bg-background my-12">
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="max-w-lg mt-1 text-black hover:border-transparent focus:outline-none font-medium text-2xl mb-8"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Event Name'
                        />
                    </div>

                    <div className='flex'>
                        <div className='flex-grow'>
                            <div>
                                <label htmlFor="location" className="block text-lg font-medium">Location:</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    className="max-w-lg rounded-full mt-1 px-4 py-2 text-black border-2 border-grey-300"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder='Location'
                                />
                            </div>
                            <div>
                                <label htmlFor="joinCode" className="block text-lg font-medium">Join Code:</label>
                                <input
                                    type="text"
                                    id="joinCode"
                                    name="joinCode"
                                    className="max-w-lg rounded-full mt-1 px-4 py-2 text-black border-2 border-grey-300"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    placeholder='Join Code'
                                />
                            </div>
                            <div>
                                <label htmlFor="userName" className="block text-lg font-medium">User Name:</label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    className="max-w-lg rounded-full mt-1 px-4 py-2 text-black border-2 border-grey-300"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder='User Name'
                                />
                            </div>
                        </div>

                        <div className='flex-grow'>
                            <div>
                                <label htmlFor="finalDate" className="block text-lg font-medium">Final Date:</label>
                                <input
                                    type="date"
                                    id="finalDate"
                                    name="finalDate"
                                    className="max-w-lg rounded-full mt-1 px-4 py-2 text-black border-2 border-grey-300"
                                    value={finalDate}
                                    onChange={(e) => setFinalDate(e.target.value)}
                                    placeholder='Final Date'
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
                                            className="max-w-lg rounded-full mt-1 px-4 py-2 text-black border-2 border-grey-300"
                                            placeholder="Start Date"
                                        />
                                        <input
                                            type="datetime-local"
                                            value={date.end}
                                            onChange={(e) => handleProposedDateChange(index, 'end', e.target.value)}
                                            className="max-w-lg rounded-full mt-1 px-4 py-2 text-black border-2 border-grey-300"
                                            placeholder="End Date"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeProposedDate(index)}
                                            className="rounded-full px-2 py-1 bg-red-500 text-background rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addProposedDate}
                                    className="rounded-full mt-2 px-4 py-2 bg-blue-500 text-white"
                                >
                                    Add Proposed Date
                                </button>
                            </div>

                            <div className='flex flex-col min-h-[4rem] w-full'>
                                <label htmlFor="description" className="block  text-lg text-black font-medium">Description:</label>
                                <textarea
                                    type="text"
                                    id="description"
                                    name="description"
                                    className="rounded-xl w-full mt-1 px-4 py-2 text-black rounded border-2 border-grey-300"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder='Description'
                                />
                            </div>

                            <button type="submit" className="rounded-full mt-4 px-4 py-2 text-white bg-gray-800">
                                Create Event
                            </button>
                        </div>
                    </div>
                </form>

                {responseMessage && (
                    <div className={`mt-4 ${responseMessage.success ? 'text-green-500' : 'text-red-500'}`}>
                        {responseMessage.message}
                    </div>
                )}

            </section>

        </main>
    );
};

export default CreateEvent;
