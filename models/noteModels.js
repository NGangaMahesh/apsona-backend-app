import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#ffffff' // Default color for notes
  },
  labels: {
    type: [{
      type: String,
      trim: true,
      maxlength: 20 // Max length for each label (adjust as needed)
    }],
    validate: {
      validator: function(labels) {
        return labels.length <= 9;
      },
      message: 'Cannot have more than 9 labels per note'
    }
  },
  archived: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model('Note', noteSchema);
export default Note;
