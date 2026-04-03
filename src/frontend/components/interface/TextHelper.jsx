import React, { useState, useEffect } from 'react';
import { textGenAi } from './genAi';
import { useAppContext } from '../../renderer/renderer';
import Spinner from '../base/Spinner';
import { SmartTooltip } from '../base/Tooltip';

export const TextHelper = ({ sourceContext, finalPassText }) => {
    const [hotTip, setHotTip] = useState();
    const { selectedAgent } = useAppContext();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            try {
                const result = await textGenAi(sourceContext, finalPassText, selectedAgent);
                setHotTip(result);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    // Split into first sentence + remainder
    const getFirstSentence = (text = '') => {
        const match = text.match(/[^.!?]+[.!?]/);
        return match ? match[0].trim() : text;
    };

    const firstSentence = hotTip ? getFirstSentence(hotTip) : '';
    const remainingText = hotTip ? hotTip : '';

    return (
        <div style={{ marginTop: '5px' }}>
            {!loading && hotTip ? (
                <SmartTooltip content={remainingText} type="hover">
                    <div
                        style={{
                            width: '400px',
                            padding: '4px 8px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            backgroundColor: '#f9f9f9',
                            fontSize: '13px',
                            lineHeight: '1.4',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'default',
                        }}
                    >
                        {firstSentence}<b>Hover for more information.</b>
                    </div>
                </SmartTooltip>
            ) : (
                <div style={{ fontSize: '13px' }}>
                    Loading more information <Spinner size={10} />
                </div>
            )}
        </div>
    );
};

export default TextHelper;