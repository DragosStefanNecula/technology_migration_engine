import React from 'react';
import { Pane } from './Pane';

const Checker = ({ code }) => {
    const buffer = code.buffer;
    const context = code.functionContext;
    
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
    
    return (
        <div className='checker'>
            {Object.entries(functionDictionary).map(([functionName, items]) => (
                <div className='pane' key={functionName}>
                    <Pane currentCodeBuffer={functionDictionary[functionName]} sourceContext={code.functionContext[functionName]}/>
                </div> 
            ))}
        </div>
    );
};

export default Checker; 