import Editor from "@monaco-editor/react";
import React from "react";
import { useRef, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AutoUpdatingWidget } from "./AutoUpdatingWidget";

class Widget {
    id = null;

    container = document.createElement("div");

    constructor(codeBlock, accessor, lineHeight) {
        this.codeBlock = codeBlock;
        this.accessor = accessor;
        this.lineHeight = lineHeight;

        this.container.style.height = `${this.lineHeight}px`;
        this.container.style.color = "white";
        this.container.style.display = "flex";
        this.container.style.alignItems = "center";
        this.container.style.padding = "0 10px";
        this.container.style.background = "#1e1e1e";
        this.container.style.fontSize = "13px";
        this.root = createRoot(this.container);
        this.root.render(<AutoUpdatingWidget/>);
        this.accessor.addZone({
            afterLineNumber: this.codeBlock.line,
            heightInPx: lineHeight,
            domNode: this.container,
        });
    }

    load() {
        this.root.render(<div></div>);
    }

    update() {
        // TODO: Make the zone the highlighted line too
    }
}

export default function FirstPassEditor({ buffer }) {

    function processBuffer(buffer) {
        let showText = "";
        let line = 0;
        let widgets = {};

        const countNewlines = (str) => (str.match(/\n/g) || []).length;

        for (const node of buffer) {
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
            processedBuffer: buffer,
            widgets
        };
    }

    const { showText, processedBuffer } = processBuffer(buffer);

    const editorRef = useRef(null);

    let finalText = "";

    function handleMount(editor, monaco) {
        // Initialise Widgets
        editorRef.current = editor;
        const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
        let widgets = {};
        for (const node of buffer) {
            if (node.type === "codeGen") {
                editor.changeViewZones((accessor) => {
                    let widget = new Widget(node, accessor, lineHeight);
                    widget.load();
                    widgets[node.uuid] = widget;
                });
            }
        }

        // Create final text and update widgets as you go
        let finalText;
        for (const node of buffer) {
            if (node.type === "text") {
                finalText += node.value;
            }

            if (node.type === "codeGen") {
                // let resullt = await AI;
                // finalText += result;
                // widgets[node.uuid].update(result);
            }
        }
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
