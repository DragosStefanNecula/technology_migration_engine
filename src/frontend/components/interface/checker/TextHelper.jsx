import React, { useState, useEffect } from 'react';
import { textGenAi } from '#src/frontend/components/interface/checker/genAi';
import { useAppContext } from '#src/frontend/renderer/renderer';
import Spinner from '#src/frontend/components/base/Spinner';
import { SmartTooltip } from '#src/frontend/components/base/SmartTooltip';
import "#src/frontend/components/interface/checker/TextHelper.css";

export const TextHelper = ({ sourceContext, finalPassText }) => {
    const [hotTip, setHotTip] = useState();
    const { selectedAgent, setError, setProcessing } = useAppContext();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            try {
                const result = await textGenAi(sourceContext, finalPassText, selectedAgent);
                setHotTip(result);
            } catch (err) {
                setError(err?.message ?? String(err));
                setProcessing(false);
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
