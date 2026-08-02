import { useEffect, useState } from "react";

function getTimeParts(target) {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return null;

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

// Shows a live countdown to `target` (an ISO date string). Renders a
// caller-supplied label once the countdown reaches zero.
function CountdownTimer({ target, doneLabel = "Ended" }) {
    const [parts, setParts] = useState(() => getTimeParts(target));

    useEffect(() => {
        const interval = setInterval(() => setParts(getTimeParts(target)), 1000);
        return () => clearInterval(interval);
    }, [target]);

    if (!parts) {
        return <span className="countdown countdown-done">{doneLabel}</span>;
    }

    return (
        <span className="countdown">
            {parts.days}d {parts.hours}h {parts.minutes}m {parts.seconds}s
        </span>
    );
}

export default CountdownTimer;
