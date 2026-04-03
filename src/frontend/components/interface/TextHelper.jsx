import React from 'react';
import { textGenAi } from './genAi';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../renderer/renderer';
import Spinner from '../base/Spinner';

export const TextHelper = ({ sourceContext, finalPassText }) => {

    const [hotTip, setHotTip] = useState(); 
    const { selectedAgent, setSelectedAgent } = useAppContext();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            try {
                const result = await textGenAi(sourceContext, finalPassText, selectedAgent);
                console.log(result)
                setHotTip(result);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    return (
        <div
            style={{
                width: '400px',
                padding: '6px',
                marginTop: '5px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                fontSize: '14px',
                lineHeight: '1.5',
                whiteSpace: 'pre-line',
            }}
        >
            {!loading ? hotTip : <div>Loading more information <Spinner size={10}/></div>}
        </div>
    );
};

export default TextHelper;