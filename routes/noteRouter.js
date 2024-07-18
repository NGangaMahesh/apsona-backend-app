import express from 'express';
import { createNote, getAllNotes, updateNoteById, searchNotes, deleteNoteById } from '../controllers/noteController.js';
import authenticateUser from '../middleware/auth.js'; // Example middleware for JWT authentication

const noteRouter = express.Router();

// Middleware to authenticate user with JWT
noteRouter.use(authenticateUser);

// POST /api/notes
noteRouter.post('/createnote', createNote);

// GET /api/notes
noteRouter.get('/allnotes', getAllNotes);

// GET /api/notes/search?query=keyword
noteRouter.get('/search', searchNotes);

// PUT /api/notes/:id
noteRouter.put('/:id', updateNoteById);

// DELETE /api/notes/:id
noteRouter.delete('/:id', deleteNoteById);


export default noteRouter;
