import React, { useState, useEffect } from 'react';

const App = () => {
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [timer, setTimer] = useState(workDuration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);
    const [historicalData, setHistoricalData] = useState([]);

    useEffect(() => {
        if (timer === 0) {
            if (sessionCount % 2 === 0) {
                setTimer(breakDuration * 60);
            } else {
                setTimer(workDuration * 60);
            }
            setSessionCount(prevCount => prevCount + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer]);

    useEffect(() => {
        const data = localStorage.getItem('pomodoroData');
        if (data) {
            setHistoricalData(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('pomodoroData', JSON.stringify(historicalData));
    }, [historicalData]);

    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [isRunning]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleStartPause = () => {
        setIsRunning(prevState => !prevState);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimer(workDuration * 60);
    };

    const handleChangeWorkDuration = (e) => {
        setWorkDuration(parseInt(e.target.value));
    };

    const handleChangeBreakDuration = (e) => {
        setBreakDuration(parseInt(e.target.value));
    };

    const saveSession = () => {
        const newData = {
            id: Date.now(),
            workDuration: workDuration,
            breakDuration: breakDuration,
            sessions: sessionCount,
            date: new Date().toLocaleDateString(),
        };
        setHistoricalData([...historicalData, newData]);
    };

    return (
        <div className="container">
            <h1>Pomodoro Timer</h1>
            <div className="timer">{formatTime(timer)}</div>
            <div className="settings">
                <label>Work Duration (minutes):</label>
                <input type="number" value={workDuration} onChange={handleChangeWorkDuration} />
                <label>Break Duration (minutes):</label>
                <input type="number" value={breakDuration} onChange={handleChangeBreakDuration} />
            </div>
            <div className="buttons">
                <button onClick={handleStartPause}>{isRunning ? 'Pause' : 'Start'}</button>
                <button onClick={handleReset}>Reset</button>
                <button onClick={saveSession}>Save Session</button>
            </div>
            <div className="session-count">Sessions Completed: {sessionCount}</div>
            <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${((workDuration * 60 - timer) / (workDuration * 60)) * 100}%` }}></div>
            </div>
            <h2>Historical Data</h2>
            <ul>
                {historicalData.map(data => (
                    <li key={data.id}>
                        <div>Date: {data.date}</div>
                        <div>Work Duration: {data.workDuration} minutes</div>
                        <div>Break Duration: {data.breakDuration} minutes</div>
                        <div>Sessions: {data.sessions}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
