import mongoose, { Schema, Document } from 'mongoose';

// Interface for individual quiz question
interface IQuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

// Interface for a quiz session (a set of questions for a topic)
export interface IQuiz extends Document {
    rootTopic: string;       // The main root topic (e.g., "Biology")
    parentTopic: string;     // The parent topic the quiz is for
    childTopics: string[];   // Child topics covered in the quiz
    questions: IQuizQuestion[];
    createdAt: Date;
    updatedAt: Date;
}

const quizQuestionSchema = new Schema<IQuizQuestion>({
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctIndex: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    }
}, { _id: false });

const quizSchema = new Schema<IQuiz>({
    rootTopic: {
        type: String,
        required: true,
        index: true
    },
    parentTopic: {
        type: String,
        required: true
    },
    childTopics: [{
        type: String
    }],
    questions: [quizQuestionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster lookups
quizSchema.index({ rootTopic: 1, parentTopic: 1 });

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
