"use client";

import { useState, useEffect } from 'react';

const Countdown = () => {
    const weddingDate = new Date('2026-05-16T15:30:00');

    const calculateTimeLeft = () => {
        const difference = +weddingDate - +new Date();
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

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
