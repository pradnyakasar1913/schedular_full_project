import React, { useState } from "react";

const EditTaskModal = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [scheduleAt, setScheduleAt] = useState(task.scheduleAt ? new Date(task.scheduleAt).toISOString().slice(0,16) : "");

  const handleSave = () => {
    onSave({
      title,
      description,
      scheduleAt: scheduleAt ? new Date(scheduleAt) : undefined,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-3">
        <h5>Edit Task</h5>
        <div className="mb-2">
          <label>Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Schedule</label>
          <input type="datetime-local" className="form-control" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} />
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary me-2" onClick={handleSave}>Save</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 8px;
          width: 400px;
        }
      `}</style>
    </div>
  );
};

export default EditTaskModal;
