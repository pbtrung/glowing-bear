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
                                links={buffer.free ? 'scheme' : true}
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
                    {buffer.away !== null && (
                        <p className="small mb-0 text-break">
                            Away: {buffer.away || 'yes'}
                        </p>
                    )}
                    <p className="small text-body-secondary mb-0 text-break">
                        {buffer.fullName} · buffer {buffer.number}
                    </p>
                    {Object.keys(buffer.localVariables).length > 0 && (
                        <details className="small mt-2">
                            <summary className="text-body-secondary">
                                Local variables
                            </summary>
                            <dl className="local-variables mb-0">
                                {Object.entries(buffer.localVariables)
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([name, value]) => (
                                        <div key={name}>
                                            <dt>{name}</dt>
                                            <dd>{value}</dd>
                                        </div>
                                    ))}
                            </dl>
                        </details>
                    )}
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
