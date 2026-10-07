import { Hash } from 'lucide-react';
import { closeModal, session, useActiveBuffer, useUi } from '../chat';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { RichText } from './RichText';

export function TopicDialog() {
    const open = useUi((s) => s.modal === 'topic');
    const buffer = useActiveBuffer();
    return (
        <Modal id="topicModal" open={open} labelledBy="topicTitle">
            <div className="modal-header">
                <h2
                    className="modal-title h5 d-flex align-items-center gap-2 text-break"
                    id="topicTitle"
                >
                    <Icon icon={Hash} /> {buffer?.shortName || buffer?.fullName}
                </h2>
                <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                />
            </div>
            {buffer && (
                <div className="modal-body">
                    <p className="topic mb-2">
                        {buffer.titleText ? (
                            <RichText
                                parts={buffer.title}
                                onChannel={(channel) =>
                                    session.openQuery(buffer.id, channel)
                                }
                            />
                        ) : (
                            <span className="text-body-secondary">No topic.</span>
                        )}
                    </p>
                    {buffer.modes && (
                        <p className="small text-body-secondary mb-0">
                            Modes: {buffer.modes}
                        </p>
                    )}
                    <p className="small text-body-secondary mb-0 text-break">
                        {buffer.fullName}
                    </p>
                </div>
            )}
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeModal}>
                    Close
                </button>
            </div>
        </Modal>
    );
}
