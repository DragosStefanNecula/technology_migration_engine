import React from 'react';
import { Pane } from './Pane';
import { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../../renderer/renderer';

const Checker = ({ code }) => {

    const { output, setOutput } = useAppContext();

    const buffer = code.buffer;
    
    function groupByFunction(items) {
        const grouped = {};

        for (const item of items) {
            const key = item.function;

            if(key !== "source")
            {
                if (!grouped[key]) {
                    grouped[key] = [];
                }

                grouped[key].push(item);
            }
        }

        return grouped;
    }

    const functionDictionary = groupByFunction(buffer);

    const [finalTexts, setFinalTexts] = useState({});

    const handleFinalText = (functionName, text) => {
        setFinalTexts(prev => ({
            ...prev,
            [functionName]: text
        }));
    };

    const functionNames = Object.keys(functionDictionary);

    const allDone = useMemo(() => {
        return functionNames.every(fn => finalTexts[fn] !== undefined);
    }, [finalTexts]);

    useEffect(() =>
    {   
        if (allDone){
            setOutput(functionNames
                .map(fn => finalTexts[fn])
                .join("\n\n"));
        }
    }, [allDone, finalTexts]); 

    return (
        <div className='checker'>
            {Object.entries(functionDictionary).map(([functionName, items]) => (
                <div className='pane' key={functionName}>
                    <Pane
                        currentCodeBuffer={items}
                        sourceContext={code.functionContext[functionName]}
                        functionName={functionName}
                        onFinalText={handleFinalText}
                    />
                </div> 
            ))}
        </div>
    );
};

export default Checker; 