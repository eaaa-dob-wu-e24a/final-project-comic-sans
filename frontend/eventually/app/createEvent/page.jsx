'use client'; // Mark as a client component for using React hooks

import React, { useState, useEffect } from 'react';
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
    const [proposedDates, setProposedDates] = useState([
        { start: getCurrentDateTime(), end: getCurrentDateTime() },
    ]);
    const [responseMessage, setResponseMessage] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/api/event/create';
    const joinCodeEndpoint = process.env.NEXT_PUBLIC_API_URL + '/api/code/generate';
    const userSessionEndpoint = process.env.NEXT_PUBLIC_API_URL + '/api/user/check_session';

    const fetchUserSession = async () => {
        try {
            const response = await fetch(userSessionEndpoint, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (data.status === "success" && data.user) {
                setUserName(data.user.name); // Set the username if user is logged in
            }
        } catch (error) {
            console.error('Error fetching user session:', error);
            // Leave userName as an empty string if fetching fails
        }
    };

    const fetchJoinCode = async () => {
        try {
            const response = await fetch(joinCodeEndpoint, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch join code.');
            }

            const data = await response.json();
            setJoinCode(data.code);
        } catch (error) {
            console.error('Error fetching join code:', error);
            setJoinCode('');
        }
    };

    useEffect(() => {
        fetchUserSession(); // Attempt to fetch user data
        fetchJoinCode(); // Fetch join code
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventData = {
            title,
            description,
            location,
            joinCode, // Include the fetched join code
            userName,
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
                fetchJoinCode(); // Fetch a new join code after creating the event
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

            <section className="max-w-6xl w-full p-12 rounded-xl drop-shadow mx-auto flex flex-col color: var(--foreground) place-content-center bg-background my-12">
                <form onSubmit={handleSubmit}>
                    <div className='flex justify-between mb-8'>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="flex-grow max-w-lg mt-1 bg-page-foreground hover:border-b-4 hover:border-transparent hover:border-b-gray-300 focus:outline-none font-bold text-2xl"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Event Name'
                            maxlength="30"
                        />
                        <div className='flex'>
                            <div id="joinCode" className="hover:border-transparent focus:outline-none mt-1 text-2xl  font-bold px-4 py-2  rounded-full">
                                {joinCode || 'Fetching...'}
                            </div>
                            <button type="submit" className="text-white text-m font-bold py-2 px-16 uppercase rounded-full shadow-md hover:cursor-pointer bg-secondary hover:bg-secondary-hover transition-all duration-200r undefined">
                                Create Event
                            </button>
                        </div>
                    </div>


                    <div className='flex gap-16'>
                        <div className='w-2/5 space-y-4'>
                            <div>
                                <label htmlFor="userName" className="block text-lg font-medium">User Name:</label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    className="max-w-lg w-full rounded-full mt-1 px-4 py-2 border-2 border-grey-300"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder='User Name'
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-lg font-medium">Location:</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    className="max-w-lg w-full rounded-full mt-1 px-4 py-2  border-2 border-grey-300"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder='Location'
                                />
                            </div>
                            <div className='flex flex-col min-h-[4rem] w-full'>
                                <label htmlFor="description" className="block text-lg  font-medium">Description:</label>
                                <textarea
                                    type="text"
                                    id="description"
                                    name="description"
                                    className="leading-6 rounded-xl w-full mt-1 px-4 py-2 rounded border-2 border-grey-300"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder='Description'
                                />
                            </div>
                        </div>

                        <div>
                            {/* Proposed Dates Section */}

                            <label className="text-lg font-medium mr-4 color: var(--foreground)">Proposed Dates:</label>
                            <div className='w-3/5 space-y-4'>
                                {proposedDates.map((date, index) => (
                                    <div key={index} className="flex space-x-2">
                                        <input
                                            type="datetime-local"
                                            value={date.start}
                                            onChange={(e) => handleProposedDateChange(index, 'start', e.target.value)}
                                            className="max-w-lg rounded-full  px-4 py-2 text-black border-2 border-grey-300"
                                            placeholder="Start Date"
                                        />
                                        <input
                                            type="datetime-local"
                                            value={date.end}
                                            onChange={(e) => handleProposedDateChange(index, 'end', e.target.value)}
                                            className="max-w-lg rounded-full  px-4 py-2 text-black border-2 border-grey-300"
                                            placeholder="End Date"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeProposedDate(index)}
                                            className="rounded-full  px-2 py-1 bg-red-500 text-background rounded"
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
                                    +
                                </button>
                            </div>
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
