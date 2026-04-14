import Editor from "@monaco-editor/react";
import React from "react";
import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { firstPassGenAi } from "#src/frontend/components/interface/checker/genAi";
import { useAppContext } from "#src/frontend/renderer/renderer";
import Spinner from "#src/frontend/components/base/Spinner";
import { SmartTooltip } from "#src/frontend/components/base/SmartTooltip";
import "#src/frontend/components/interface/checker/editors/FirstPassEditor.css";

class Widget {
    container = document.createElement("div");

    constructor(codeBlock, editor, lineHeight) {
        this.codeBlock = codeBlock;
        this.editor = editor;
        this.lineHeight = lineHeight;

        this.container.className = "editor-zone";
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
            <div className="editor-zone__loading">
                <span className="editor-zone__spinner">
                    <Spinner size={10} />
                </span>
                LOADING
            </div>
        );
    }

    update(text, context) {
        let visible = false;

        const render = () => {
            this.root.render(
                <SmartTooltip content={context} open={visible}>
                    <div className="editor-zone__text">{text}</div>
                </SmartTooltip>
            );
        };

        render();

        if (!this._listenersAttached) {
            this._listenersAttached = true;

            this._mouseListener = this.editor.onMouseMove((e) => {
                const isInZone = e.target.position?.lineNumber === this.codeBlock.line;

                if (isInZone !== visible) {
                    visible = isInZone;
                    render();
                }
            });

            this.editor.getDomNode().addEventListener("mouseleave", () => {
                if (visible) {
                    visible = false;
                    render();
                }
            });
        }

        const newHeight = text.split("\n").length * this.lineHeight;

        this.editor.changeViewZones((accessor) => {
            if (this.zoneId) accessor.removeZone(this.zoneId);

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

        const CONTEXT_WINDOW = 3000;

        let runningContext = "";
        for (const node of contextedBuffer) {
            if (node.shard === "text") {
                runningContext += node.value;
            }

            if (node.shard === "codeGen") {
                const windowedContext = runningContext.slice(-CONTEXT_WINDOW);
                let result = await firstPassGenAi(sourceContext, windowedContext, node, selectedAgent);
                let modifiedResult = result
                    .split('\n')
                    .map((line) => node.ind + line)
                    .join('\n');
                widgets[node.uuid].update(modifiedResult, node.value);
                runningContext += modifiedResult.replace(node.ind, '');
            }
        }

        const finalText = runningContext;
        setFirstPassText(finalText);
        setLoading(false);
    }

    return (
        <div className={`pass-editor${isVisible ? "" : " pass-editor--hidden"}`}>
            <div className="pass-editor__label">
                First Pass
                {loading && (
                    <div className="pass-editor__spinner">
                        <Spinner size={10} />
                    </div>
                )}
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
