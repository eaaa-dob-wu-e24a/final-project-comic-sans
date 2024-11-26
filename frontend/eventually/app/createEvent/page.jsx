'use client'; // Mark as a client component for using React hooks

import React, { useState } from 'react';

const CreateEvent = () => {
    // State hooks to store form data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [userName, setUserName] = useState('');
    const [finalDate, setFinalDate] = useState('');

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form behavior

        // Prepare the data to send to the server
        const eventData = {
            title,
            description,
            location,
            joinCode,
            userName,
            finalDate
        };

        try {
            const response = await fetch('http://localhost:4000/backend/api/event/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData), // Send the form data as JSON
            });

            const data = await response.json();

            if (response.ok) {
                // Handle success (e.g., show success message or redirect)
                console.log('Event created:', data.message);
            } else {
                // Handle error (e.g., show error message)
                console.error('Error creating event:', data.error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
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
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} // Update state
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-lg font-medium">Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} // Update state
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-lg font-medium">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)} // Update state
                    />
                </div>
                <div>
                    <label htmlFor="joinCode" className="block text-lg font-medium">Join Code:</label>
                    <input
                        type="text"
                        id="joinCode"
                        name="joinCode"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)} // Update state
                    />
                </div>
                <div>
                    <label htmlFor="userName" className="block text-lg font-medium">User Name:</label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)} // Update state
                    />
                </div>
                <div>
                    <label htmlFor="finalDate" className="block text-lg font-medium">Final Date:</label>
                    <input
                        type="date"
                        id="finalDate"
                        name="finalDate"
                        className="mt-1 px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={finalDate}
                        onChange={(e) => setFinalDate(e.target.value)} // Update state
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                >
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
