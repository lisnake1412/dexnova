import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import Prev from 'assets/icons/prev.svg'

const getTotalDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
}

const getFirstDateOfMonth = (time: Date) => {
    return new Date(time.getTime() - 86400 * (time.getDate() - 1) * 1000)
        .toDateString()
        .split(' ')?.[0]
}

const dates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

const Calendar = ({
    dateRange,
    setDateRange,
    currentLabel,
}: {
    dateRange: {
        startDate: Date
        endDate: Date
    }
    setDateRange: React.Dispatch<
        React.SetStateAction<{
            startDate: Date
            endDate: Date
        }>
    >
    currentLabel: 'Start' | 'End'
}) => {
    const [time, setTime] = useState(dateRange.startDate)
    const [month, setMonth] = useState(time.getUTCMonth() + 2)
    const [year, setYear] = useState(time.getFullYear())
    const [activeTimestamp, setActiveTimestamp] = useState(time.getTime())
    const [isStartDate, setIsStartDate] = useState(true)

    const firstDateOfMonth = useMemo(() => {
        return getFirstDateOfMonth(time)
    }, [time])

    const totalDateOfMonth = useMemo(() => {
        return getTotalDayOfMonth(year, month)
    }, [year, month])

    const dateOfMonth = useMemo(() => {
        return new Array(totalDateOfMonth).fill(null).map((_, i) => i + 1)
    }, [totalDateOfMonth])

    const [listDate, setListDate] = useState([
        ...new Array(dates.findIndex((i) => i === firstDateOfMonth))
            .fill(null)
            .map((_) => 0),
        ...dateOfMonth,
    ])

    const handleNextMonth = () => {
        const newTotalDateOfMonth = getTotalDayOfMonth(year, month + 1)

        const newTime = time.getTime() + 86400 * 1000 * newTotalDateOfMonth
        const newFirstDateOfMonth = getFirstDateOfMonth(new Date(newTime))

        setTime(new Date(newTime))
        if (month === 12) setYear((y) => y + 1)
        setMonth((i) => (i === 12 ? 1 : i + 1))

        const ind = dates.findIndex((i) => i === newFirstDateOfMonth)
        const newFill = new Array(ind).fill(null).map((_) => 0)
        const newDates = new Array(newTotalDateOfMonth)
            .fill(null)
            .map((_, i) => i + 1)
        const result = [...newFill, ...newDates]
        setListDate(result)
    }

    const handlePrevMonth = () => {
        const newTotalDateOfMonth = getTotalDayOfMonth(year, month - 1)

        const newTime = time.getTime() - 86400 * 1000 * newTotalDateOfMonth
        const newFirstDateOfMonth = getFirstDateOfMonth(new Date(newTime))

        setTime(new Date(newTime))
        if (month === 1) setYear((y) => y - 1)
        setMonth((i) => (i === 1 ? 12 : i - 1))

        const ind = dates.findIndex((i) => i === newFirstDateOfMonth)
        const newFill = new Array(ind).fill(null).map((_) => 0)
        const newDates = new Array(newTotalDateOfMonth)
            .fill(null)
            .map((_, i) => i + 1)
        const result = [...newFill, ...newDates]
        setListDate(result)
    }

    const getDayFromTime = (d: Date) => {
        return Number(d.toDateString().split(' ')?.[2])
    }

    const getTimestampOnClick = (day: number) => {
        const oneDay = 86400 * 1000

        if (getDayFromTime(time) > day) {
            const diff = getDayFromTime(time) - day
            return time.getTime() - diff * oneDay
        }

        const diff = day - getDayFromTime(time)
        return time.getTime() + diff * oneDay
    }

    const handleOnClick = (day: number) => {
        const tstamp = getTimestampOnClick(day)

        if (new Date().getTime() > tstamp + 86400 * 1000) return

        setActiveTimestamp(tstamp)

        if (
            (currentLabel === 'Start' &&
                tstamp > dateRange.endDate.getTime()) ||
            (currentLabel === 'End' && tstamp < dateRange.startDate.getTime())
        ) {
            return setDateRange((i) => {
                return {
                    startDate: new Date(tstamp),
                    endDate: new Date(tstamp),
                }
            })
        }

        setDateRange((i) => {
            return {
                startDate:
                    currentLabel === 'Start' ? new Date(tstamp) : i.startDate,
                endDate:
                    currentLabel === 'End' && i.startDate.getTime() <= tstamp
                        ? new Date(tstamp)
                        : i.endDate,
            }
        })

        // if(isStartDate) setDateRange(i => {return {
        //     ...i, startDate
        // }})
    }

    const handleClassName = (d: number) => {
        return d === 0
            ? 'disable'
            : new Date().getTime() > getTimestampOnClick(d) + 86400 * 1000
            ? 'past'
            : activeTimestamp === getTimestampOnClick(d) ||
              (getTimestampOnClick(d) >= dateRange.startDate.getTime() &&
                  getTimestampOnClick(d) <= dateRange.endDate.getTime())
            ? 'active'
            : ''
    }

    return (
        <Container>
            <LabelCalendar>
                <LabelHeader>
                    <div>
                        {months[month - 1]} {year}
                    </div>
                </LabelHeader>

                <LabelBody>
                    <div className="btn" onClick={handlePrevMonth}>
                        <img src={Prev} alt="prev" />
                    </div>
                    <LabelDate>
                        {dates.map((d) => {
                            return <div className="day">{d}</div>
                        })}
                        {listDate.map((d) => {
                            return (
                                <div
                                    className={`date ${handleClassName(d)}`}
                                    onClick={() => d > 0 && handleOnClick(d)}
                                >
                                    {d ? d : ''}
                                </div>
                            )
                        })}
                    </LabelDate>

                    <div className="btn" onClick={handleNextMonth}>
                        <img src={Prev} alt="prev" className="next" />
                    </div>
                </LabelBody>
            </LabelCalendar>
        </Container>
    )
}

export default Calendar

const Container = styled.div`
    display: flex;
    justify-content: center;
    /* padding: 0 1rem; */

    @media screen and (max-width: 576px) {
        scale: 0.6;
    }
`

const LabelBody = styled.div`
    display: flex;
    gap: 20px;
    min-height: 360px;

    .btn {
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    img {
        width: 18px;
        height: 18px;
    }

    .next {
        transform: rotateY(180deg);
    }
`

const LabelCalendar = styled.div`
    max-width: 800px;
    background: rgba(0, 38, 59, 0.6);
    border: 1px solid #002f4a;
    border-radius: 9px;
    padding: 20px;
`

const LabelHeader = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
    font-size: 22px;
`

const LabelDate = styled.div`
    margin: 0 auto;
    max-width: 500px;
    width: 100%;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 10px;
    justify-content: center;

    @media screen and (max-width: 576px) {
        /* flex-direction: column; */
        max-width: 300px;
    }

    div {
        width: 32px;
        height: 32px;
        /* padding: 5px; */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .day {
        color: #aaaaaa;
        pointer-events: none;
    }

    .date {
        /* border: 1px solid; */
        cursor: pointer;
    }

    .active {
        background: #00b2ff;
        border-radius: 50%;
    }

    .disable {
        border: none;
        cursor: unset;
    }

    .past {
        opacity: 0.5;
        cursor: unset;
        user-select: none;
    }
`
