import React, { useState, useEffect } from 'react';
import { textGenAi } from './genAi';
import { useAppContext } from '../../../renderer/renderer';
import Spinner from '../../base/Spinner';
import { SmartTooltip } from '../../base/SmartTooltip';
import "./TextHelper.css";

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

    const getFirstSentence = (text = '') => {
        const match = text.match(/[^.!?]+[.!?]/);
        return match ? match[0].trim() : text;
    };

    const firstSentence = hotTip ? getFirstSentence(hotTip) : '';
    const remainingText = hotTip ? hotTip : '';

    return (
        <div className="text-helper">
            {!loading && hotTip ? (
                <SmartTooltip content={remainingText} type="hover">
                    <div className="text-helper__tip">
                        <b>Hover for more information. </b>{firstSentence}
                    </div>
                </SmartTooltip>
            ) : (
                <div className="text-helper__loading">
                    Loading more information <Spinner size={10} />
                </div>
            )}
        </div>
    );
};

export default TextHelper;
