import React from 'react';

export default function GoBackArrow({ handleBack }) {
    return (
        <div
            style={{
                fontSize: "200%",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer"
            }}
            onClick={handleBack}
        >
            &larr;
        </div>
    )
}