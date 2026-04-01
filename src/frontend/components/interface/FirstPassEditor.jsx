import Editor from "@monaco-editor/react";
import React from "react";
import { useRef, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { genAi } from "./genAi";
import { useAppContext } from "../../renderer/renderer";

class Widget {
    container = document.createElement("div");

    constructor(codeBlock, editor, lineHeight) {
        this.codeBlock = codeBlock;
        this.editor = editor;
        this.lineHeight = lineHeight;

        this.container.style.color = "black";
        this.container.style.display = "flex";
        this.container.style.alignItems = "center";
        this.container.style.padding = "0 10px";
        this.container.style.background = "#f9ff53";
        this.container.style.fontSize = "13px";
        this.root = createRoot(this.container);
        this.editor.changeViewZones((accessor) => {
            this.zoneId = accessor.addZone({
                afterLineNumber: this.codeBlock.line,
                heightInPx: lineHeight,
                domNode: this.container,
            });
        });
    }

    load() {
        this.root.render(<div>LOADING</div>);
    }

    update(text) {
       this.root.render(<div style={{ whiteSpace: "pre" }}>{text}</div>);

        const lineCount = text.split("\n").length;

        const newHeight = lineCount * this.lineHeight;
        
        this.editor.changeViewZones((accessor) => {
            accessor.removeZone(this.zoneId);
            this.zoneId = accessor.addZone({
                afterLineNumber: this.codeBlock.line,
                heightInPx: newHeight,
                domNode: this.container,
            });    
        });
    }
}

export default function FirstPassEditor({ currentCodeBuffer, sourceContext }) {

    const { selectedAgent, setSelectedAgent } = useAppContext();

    function processBuffer(currentCodeBuffer) {
        let showText = "";
        let line = 0;
        let widgets = {};

        const countNewlines = (str) => (str.match(/\n/g) || []).length;

        for (const node of currentCodeBuffer) {
            if (node.type === "text") {
                showText += node.value;
                line += countNewlines(node.value);
            }

            if (node.type === "codeGen") {
                node["line"] = line;
                node["uuid"] = crypto.randomUUID();
            }
        }

        return {
            showText,
            processedBuffer: currentCodeBuffer,
            widgets
        };
    }

    const { showText, processedBuffer } = processBuffer(currentCodeBuffer);

    const editorRef = useRef(null);

    let finalText = "";

    async function handleMount(editor, monaco) {
        // Initialise Widgets
        editorRef.current = editor;
        const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
        let widgets = {};
        for (const node of processedBuffer) {
            if (node.type === "codeGen") {
                editor.changeViewZones((accessor) => {
                    let widget = new Widget(node, editor, lineHeight);
                    widget.load();
                    widgets[node.uuid] = widget;
                });
            }
        }

        // Create final text and update widgets as you go
        let runningContext;
        for (const node of processedBuffer) {
            if (node.type === "text") {
                runningContext += node.value;
            }

            if (node.type === "codeGen") {
                let result = await genAi(sourceContext, runningContext, node, selectedAgent);
                let modifiedResult = result
                    .split('\n')
                    .map((line) => node.ind + line)
                    .join('\n');

                widgets[node.uuid].update(modifiedResult);
                runningContext += modifiedResult.replace(node.ind, ''); //first line already has a ident applied
            }
        }

        const finalText = runningContext;
        console.log(finalText)
    }

    return (
        <Editor
            height="400px"
            defaultLanguage="java" //TODO: Add support for perl
            defaultValue={showText}
            onMount={handleMount}
            options={{
                lineNumbers: "off", // TODO: disables all line numbers
                minimap: { enabled: false },
            }}
        />
    );
}
