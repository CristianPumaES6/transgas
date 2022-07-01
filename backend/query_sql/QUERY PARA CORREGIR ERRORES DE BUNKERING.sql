select * from USER;


select date,bunkeringIfo,bunkeringMgo from daily_report 
WHERE daily_report.userId = 2 AND (bunkeringIfo > 0 || bunkeringMgo >0)
ORDER by date ASC;

