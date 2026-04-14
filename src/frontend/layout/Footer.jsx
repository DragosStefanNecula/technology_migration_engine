import React from "react";
import "#src/frontend/layout/Navbar.css";
import "#src/frontend/layout/Footer.css";
import { useAppContext } from "#src/frontend/renderer/renderer";
import ExportJavaButton from "#src/frontend/components/interface/actions/ExportButton";
import CopyToClipboardButton from "#src/frontend/components/interface/actions/CopyToClipboardButton";

export default function Footer() {
    const { output, processing, skipConfirmModal, setSkipConfirmModal } = useAppContext();

    return (
        <nav className="navbar footer">
            <div className="footer__left">
                <label className="footer__checkbox-label">
                    <input
                        type="checkbox"
                        checked={skipConfirmModal}
                        onChange={(e) => setSkipConfirmModal(e.target.checked)}
                        className="footer__checkbox"
                    />
                    Don't show run confirmation
                </label>
            </div>
            <div className="footer__right">
                {processing === true && (
                    <>
                        <ExportJavaButton content={output} />
                        <CopyToClipboardButton content={output} />
                    </>
                )}
            </div>
        </nav>
    );
}