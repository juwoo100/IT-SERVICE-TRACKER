import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createTicket } from '../api/ticketApi.js';

export default function TicketForm() {
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            username: '',
            title: '',
            description: '',
            status: 'open',
            reportTo: '',
        }

    });

    useEffect(() => {
        let data = {
            username: 'default user',
            title: 'default title',
            description: 'default description',
            status: 'open',
            reportTo: 'admin'
        }
        const loggedUser = localStorage.getItem('username') || 'Guest';
        setValue('username', loggedUser);
        for (const prop in data) {
            setValue(prop, data[prop]);
        }
    }, [setValue])

    async function submitForm(data) {
        console.log('Form submitted:', data);
        await createTicket(data);
        alert('Ticket successfully created!');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-scrren bd-g-gray-300">
            
            <h2 className="text-3xl font-semibold mb-6">Create new ticket</h2>
            <form onSubmit={handleSubmit(submitForm)} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
                <p>Welcome, <b>{localStorage.getItem('username')}</b>!</p>

                <label className="block">
                    Title:
                    <input type="text" {...register('title')} className="border border-gray-300 w-full p-2 rounded-nd nt-1" />
                </label>
                <br />
                <label className='block'>
                    Description:
                    <textarea {...register('description')} className="border border-gray-300 w-full p-2 rounded-md mt-1" />
                </label>
                <br />
                <label className="block">
                    Status:
                    <select {...register('status')} className="border border-gray-300 w-full p-2 rounded-md mt-1">
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>
                </label>
                <br />
                <label className="block">
                    Report To:
                    <select {...register('reportTo')} className="border border-gray-300 w-full p-2 rounded-md mt-1">
                        <option value="admin">Admin</option>
                        <option value="support">Support</option>
                    </select>
                </label>
                <br />
                <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md transition-colors">Submit</button>
            </form>
        </div>
    );
}