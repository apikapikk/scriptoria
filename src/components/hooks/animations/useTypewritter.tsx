import { useState, useEffect } from "react";

const useTypewriter = (baseText: string, variations: string[], speed: number = 100, delay: number = 1500) => {
    const [displayText, setDisplayText] = useState(baseText);
    const [variationIndex, setVariationIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const fullText = baseText + " " + variations[variationIndex];

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (!isDeleting) {
            timeout = setTimeout(() => {
                setDisplayText(fullText.substring(0, charIndex + 1));
                setCharIndex((prev) => prev + 1);
            }, speed);

            if (charIndex === fullText.length) {
                setTimeout(() => setIsDeleting(true), delay);
            }
        } else {
            timeout = setTimeout(() => {
                setDisplayText(fullText.substring(0, charIndex - 1));
                setCharIndex((prev) => prev - 1);
            }, speed / 2);

            if (charIndex === baseText.length) {
                setIsDeleting(false);
                setVariationIndex((prev) => (prev + 1) % variations.length);
            }
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, variationIndex, fullText, speed, delay, baseText.length, variations.length]);

    return displayText;
};

export default useTypewriter;
