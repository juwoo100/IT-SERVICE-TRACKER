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
        <div>
            <h2>Create new ticket</h2>
            <form onSubmit={handleSubmit(submitForm)}>
                <p>Welcome, <b>{localStorage.getItem('username')}</b>!</p>

                <label>
                    Title:
                    <input type="text" {...register('title')} />
                </label>
                <br />
                <label>
                    Description:
                    <textarea {...register('description')} />
                </label>
                <br />
                <label>
                    Status:
                    <select {...register('status')}>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>
                </label>
                <br />
                <label>
                    Report To:
                    <select {...register('reportTo')}>
                        <option value="admin">Admin</option>
                        <option value="support">Support</option>
                    </select>
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}