import Editor from "@monaco-editor/react";
import React from "react";
import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { firstPassGenAi } from "./genAi";
import { useAppContext } from "../../renderer/renderer";
import Spinner from "../base/Spinner";

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
        this.root.render(
            <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginInlineEnd: "5px" }}>
                    <Spinner size={10} />
                </span>
                LOADING
            </div>);
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

export default function FirstPassEditor({ currentCodeBuffer, sourceContext, setFirstPassText, isVisible }) {

    const { selectedAgent, setSelectedAgent } = useAppContext();

    const [loading, setLoading] = useState(false);

    function contextMaker(currentCodeBuffer) {
        let showText = "";
        let line = 0;

        const countNewlines = (str) => (str.match(/\n/g) || []).length;

        for (const node of currentCodeBuffer) {
            if (node.shard === "text") {
                showText += node.value;
                line += countNewlines(node.value);
            }

            if (node.shard === "codeGen") {
                node["line"] = line;
            }
        }

        return {
            showText,
            contextedBuffer: currentCodeBuffer,
        };
    }

    const { showText, contextedBuffer } = contextMaker(currentCodeBuffer);
    let finalText = "";
    const editorRef = useRef(null);

    async function handleMount(editor, monaco) {
        setLoading(true);
        // Initialise Widgets
        editorRef.current = editor;
        const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
        let widgets = {};
        for (const node of contextedBuffer) {
            if (node.shard === "codeGen") {
                let widget = new Widget(node, editor, lineHeight);
                widget.load();
                widgets[node.uuid] = widget;
            }
        }

        // Create final text and update widgets as you go
        let runningContext;
        for (const node of contextedBuffer) {
            if (node.shard === "text") {
                runningContext += node.value;
            }

            if (node.shard === "codeGen") {
                let result = await firstPassGenAi(sourceContext, runningContext, node, selectedAgent);
                let modifiedResult = result
                    .split('\n')
                    .map((line) => node.ind + line)
                    .join('\n');
                widgets[node.uuid].update(modifiedResult);
                runningContext += modifiedResult.replace(node.ind, ''); //first line already has a ident applied
            }
        }

        const finalText = runningContext;
        setFirstPassText(finalText);
        setLoading(false);
    }

    return (
        <div style={{ width: "100%", display: isVisible ? "block" : "none" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBlock: "2px", height: "20px" }}>
                First Pass
                {loading && <div style={{ marginInlineStart: "5px" }}>
                    <Spinner size={10} />
                </div>}
            </div>
            <Editor
                height="400px"
                defaultLanguage="java"
                defaultValue={showText}
                onMount={handleMount}
                options={{
                    lineNumbers: "off",
                    minimap: { enabled: false },
                    readOnly: true
                }}
            />
        </div>
    );
}
