"use client";

import { useState, useEffect } from 'react';

const Countdown = () => {
    const weddingDate = new Date('2026-05-16T15:30:00');

    // Initialize with a default state or null to avoid server/client mismatch
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This effect runs only on the client, after the initial render
        setIsClient(true);
        
        const calculateTimeLeft = () => {
            const difference = +weddingDate - +new Date();
            let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return newTimeLeft;
        };
        
        // Set the initial time left on the client
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, []); // Empty dependency array ensures this runs once on mount

    const formatNumber = (num: number) => num.toString().padStart(2, '0');
    
    // Don't render the numbers until the client has mounted
    if (!isClient) {
        return (
             <div className="text-center max-w-2xl mx-auto">
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-background rounded-lg shadow-lg">
                        <div className="font-headline text-5xl md:text-7xl text-primary">00</div>
                        <div className="text-sm md:text-base text-muted-foreground mt-2">Dias</div>
                    </div>
                    <div className="p-4 bg-background rounded-lg shadow-lg">
                        <div className="font-headline text-5xl md:text-7xl text-primary">00</div>
                        <div className="text-sm md:text-base text-muted-foreground mt-2">Horas</div>
                    </div>
                    <div className="p-4 bg-background rounded-lg shadow-lg">
                        <div className="font-headline text-5xl md:text-7xl text-primary">00</div>
                        <div className="text-sm md:text-base text-muted-foreground mt-2">Minutos</div>
                    </div>
                    <div className="p-4 bg-background rounded-lg shadow-lg">
                        <div className="font-headline text-5xl md:text-7xl text-primary">00</div>
                        <div className="text-sm md:text-base text-muted-foreground mt-2">Segundos</div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="text-center max-w-2xl mx-auto">
            <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-background rounded-lg shadow-lg">
                    <div className="font-headline text-5xl md:text-7xl text-primary">{formatNumber(timeLeft.days)}</div>
                    <div className="text-sm md:text-base text-muted-foreground mt-2">Dias</div>
                </div>
                <div className="p-4 bg-background rounded-lg shadow-lg">
                    <div className="font-headline text-5xl md:text-7xl text-primary">{formatNumber(timeLeft.hours)}</div>
                    <div className="text-sm md:text-base text-muted-foreground mt-2">Horas</div>
                </div>
                <div className="p-4 bg-background rounded-lg shadow-lg">
                    <div className="font-headline text-5xl md:text-7xl text-primary">{formatNumber(timeLeft.minutes)}</div>
                    <div className="text-sm md:text-base text-muted-foreground mt-2">Minutos</div>
                </div>
                <div className="p-4 bg-background rounded-lg shadow-lg">
                    <div className="font-headline text-5xl md:text-7xl text-primary">{formatNumber(timeLeft.seconds)}</div>
                    <div className="text-sm md:text-base text-muted-foreground mt-2">Segundos</div>
                </div>
            </div>
        </div>
    );
};

export default Countdown;
