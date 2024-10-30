import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import 'express-async-errors'
import connectDB from './db/connect';
import authRouter from './routes/auth';
import bookRouter from './routes/books'
import commentRouter from './routes/comments'
import notFound from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';

dotenv.config()
const app = express();
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Welcome to my bookstore!');
});


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/book', bookRouter)
app.use('/api/v1/books', commentRouter)


app.use(notFound);
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000;


const startServer = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    await connectDB(mongoURI);
    console.log('Database connected');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

startServer()