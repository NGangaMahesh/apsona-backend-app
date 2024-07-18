import Note from '../models/noteModels.js';
import User from '../models/userModels.js';

// Create a new note for a specific user
const createNote = async (req, res) => {
  const { title, content, color, labels } = req.body;
  const userId = req.body.userId; // Accessing authenticated user's ID

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (labels && labels.length > 9) {
      return res.status(400).json({ message: 'Cannot have more than 9 labels per note' });
    }

    const newNote = new Note({
      title,
      content,
      color,
      labels,
      user: userId
    });

    const savedNote = await newNote.save();
    user.notes.push(savedNote);
    await user.save();

    res.status(201).json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create note' });
  }
};

// Get all notes for a specific user
const getAllNotes = async (req, res) => {
  const userId = req.body.userId; // Accessing authenticated user's ID

  try {
    const user = await User.findById(userId).populate('notes');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve notes' });
  }
};

// Get a single note by ID
const getNoteById = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId; // Accessing authenticated user's ID

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve note' });
  }
};

// Search notes by title or content
const searchNotes = async (req, res) => {
  const { query } = req.query;
  const userId = req.body.userId; // Accessing authenticated user's ID
  try {
    // Check if query is a string
    if (typeof query !== 'string') {
      return res.status(400).json({ message: 'Query parameter must be a string' });
    }

    const notes = await Note.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive search for title
        { content: { $regex: query, $options: 'i' } } // Case-insensitive search for content
      ],
      user: userId
    });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search notes' });
  }
};

// Update a note by ID for a specific user
const updateNoteById = async (req, res) => {
  const { id } = req.params;
  const { title, content, color, labels, archived } = req.body;
  const userId = req.body.userId; // Accessing authenticated user's ID

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (labels && labels.length > 9) {
      return res.status(400).json({ message: 'Cannot have more than 9 labels per note' });
    }

    const updatedFields = {
      title,
      content,
      color,
      labels,
      archived,
      updatedAt: Date.now()
    };

    if (archived && !note.archived) {
      updatedFields.archived = true;
      updatedFields.updatedAt = Date.now();
    } else if (!archived && note.archived) {
      updatedFields.archived = false;
      updatedFields.updatedAt = Date.now();
    }

    const updatedNote = await Note.findByIdAndUpdate(id, updatedFields, { new: true });

    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update note' });
  }
};

// Delete a note by ID for a specific user
const deleteNoteById = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId; // Accessing authenticated user's ID

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Soft delete: Move note to trash (set deletedAt timestamp)
    note.deletedAt = Date.now();
    await note.save();

    res.json({ message: 'Note moved to trash' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
};

export { createNote, getAllNotes, getNoteById, searchNotes, updateNoteById, deleteNoteById };
