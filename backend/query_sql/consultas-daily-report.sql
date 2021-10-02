SELECT * FROM daily_report


SELECT daily_report.date, datetime(daily_report.date) FROM daily_report

UPDATE daily_report
SET date = datetime(date) 