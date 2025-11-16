import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesAPI, attachmentsAPI } from '../services/api';
import { Note, Attachment } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, Trash2, Paperclip, Download, Loader2 } from 'lucide-react';

interface NotesSectionProps {
  leadId?: number;
  contactId?: number;
  dealId?: number;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ leadId, contactId, dealId }) => {
  const [showForm, setShowForm] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', { lead: leadId, contact: contactId, deal: dealId }],
    queryFn: () => notesAPI.getAll({ lead: leadId, contact: contactId, deal: dealId }),
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const note = await notesAPI.create(data);

      // Upload attachment if selected
      if (selectedFile && note.id) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('note', note.id.toString());
        if (leadId) formData.append('lead', leadId.toString());
        if (contactId) formData.append('contact', contactId.toString());
        if (dealId) formData.append('deal', dealId.toString());

        await attachmentsAPI.upload(formData);
      }

      return note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      setNoteContent('');
      setSelectedFile(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    createMutation.mutate({
      content: noteContent,
      ...(leadId && { lead: leadId }),
      ...(contactId && { contact: contactId }),
      ...(dealId && { deal: dealId }),
    });
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading notes...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notes & Attachments</CardTitle>
        <Button onClick={() => setShowForm(!showForm)} icon={Plus} size="sm">
          Add Note
        </Button>
      </CardHeader>

      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-theme-bg-tertiary rounded-lg">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="input-field mb-3"
              rows={4}
              placeholder="Write your note here..."
              required
            />

            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-theme-text-secondary hover:text-theme-text-primary">
                <Paperclip className="h-4 w-4" />
                <span>{selectedFile ? selectedFile.name : 'Attach file'}</span>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                icon={createMutation.isPending ? Loader2 : Plus}
              >
                {createMutation.isPending ? 'Saving...' : 'Save Note'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setNoteContent('');
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {notes?.map((note: Note) => (
            <div key={note.id} className="p-4 bg-theme-bg-secondary rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-theme-text-primary">
                    {note.created_by_name}
                  </p>
                  <p className="text-xs text-theme-text-tertiary">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(note.id)}
                  className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                  title="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-theme-text-secondary whitespace-pre-wrap mb-3">
                {note.content}
              </p>

              {note.attachments && note.attachments.length > 0 && (
                <div className="space-y-2">
                  {note.attachments.map((attachment: Attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.file_url}
                      download={attachment.filename}
                      className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Download className="h-4 w-4" />
                      <span>{attachment.filename}</span>
                      <span className="text-xs text-theme-text-tertiary">
                        ({(attachment.file_size / 1024).toFixed(1)}KB)
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {(!notes || notes.length === 0) && !showForm && (
            <p className="text-center text-sm text-theme-text-tertiary py-8">
              No notes yet. Click "Add Note" to create one.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
