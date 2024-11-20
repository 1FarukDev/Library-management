import cron from 'node-cron';
import BorrowBook, { IBorrowPopulated } from '../models/BorrowBook';
import { format } from 'date-fns';
import transporter from './transporter';


interface User {
    email: string;
    name: string;
}


const sendReminderEmails = async (): Promise<void> => {
    const now = new Date();
    const startDate = new Date(now.setHours(0, 0, 0, 0));
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 2); 
    endDate.setHours(23, 59, 59, 999);  

    try {
        const dueSoon = await BorrowBook.find({
            dueDate: { $gte: startDate, $lte: endDate }
        })
            .populate('user')
            .populate('book') as IBorrowPopulated[];

        for (const record of dueSoon) {
            const { user, dueDate, book } = record;

            await transporter.sendMail({
                from: 'library@example.com',
                to: user.email,
                subject: 'Due Date Reminder',
                text: `Hello ${user.last_name + ' ' + user.first_name},\n\nThe book "${book.title}" is due on ${format(dueDate, 'yyyy-MM-dd')}. Please return it on time to avoid penalties.\n\nThank you!`,
            });

            console.log(`Reminder sent to ${user.email} for book: ${book.title}`);
        }
    } catch (error) {
        console.error('Error sending reminders:', error);
    }
};



cron.schedule('0 8 * * *', sendReminderEmails);
